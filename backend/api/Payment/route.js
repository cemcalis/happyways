import express from "express";
import { getDB } from "../../database/db.js";
import jwt from "jsonwebtoken";
import checkCarAvailability from "./availability.js";
import { sendReservationEmail } from "./emailService.js";

console.log("[PAYMENT ROUTE] build=2025-08-19T08:10Z");

const router = express.Router();

const BYPASS = false;

const AVAIL_TIMEOUT_MS = 6000;
const INSERT_TIMEOUT_MS = 6000;

function normalizeNameOnReq(req) {
  try {
    let { firstName, lastName, name, fullName } = req.body || {};
    if ((!firstName || !lastName) && (name || fullName)) {
      const raw = String(name || fullName).trim().replace(/\s+/g, " ");
      if (raw.length > 0) {
        const parts = raw.split(" ");
        if (parts.length === 1) {
          firstName = parts[0];
          lastName = parts[0];
        } else {
          firstName = parts[0];
          lastName = parts.slice(1).join(" ");
        }
        req.body.firstName = firstName;
        req.body.lastName = lastName;
      }
    }
  } catch (e) {
    console.warn("[PAYMENT] normalizeNameOnReq error:", e?.message);
  }
}

function normalizeDate(d) {
  if (!d) return "";
  const dmy = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/;
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/;
  let m;
  if ((m = dmy.exec(d))) {
    const [, dd, mm, yy] = m;
    return `${yy}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`;
  }
  if (iso.test(d)) return d;
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return "";
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(
    dt.getDate()
  ).padStart(2, "0")}`;
}

function normalizeTime(t) {
  if (!t) return "00:00";
  const hhmm = /^(\d{1,2}):(\d{2})$/;
  const m = hhmm.exec(t);
  if (m) {
    const hh = String(Math.min(23, Math.max(0, parseInt(m[1], 10)))).padStart(2, "0");
    const mm = String(Math.min(59, Math.max(0, parseInt(m[2], 10)))).padStart(2, "0");
    return `${hh}:${mm}`;
  }
  const onlyDigits = String(t).replace(/[^\d]/g, "");
  if (onlyDigits.length === 4) {
    const hh = String(Math.min(23, Math.max(0, parseInt(onlyDigits.slice(0, 2), 10)))).padStart(2, "0");
    const mm = String(Math.min(59, Math.max(0, parseInt(onlyDigits.slice(2), 10)))).padStart(2, "0");
    return `${hh}:${mm}`;
  }
  return "00:00";
}

function normalizeReservationBody(body = {}) {
  const pick = (a, b) => (a !== undefined ? a : b);
  const car_id = pick(body.car_id, body.carId);
  const pickup_location = pick(body.pickup_location, body.pickupLocation ?? body.pickup);
  const dropoff_location = pick(body.dropoff_location, body.dropoffLocation ?? body.drop);
  const pickup_date_raw = pick(body.pickup_date, body.pickupDate);
  const dropoff_date_raw = pick(body.dropoff_date, body.dropoffDate);
  const pickup_time_raw = pick(body.pickup_time, body.pickupTime);
  const dropoff_time_raw = pick(body.dropoff_time, body.dropoffTime);
  const total_price = pick(body.total_price, body.totalPrice);
  return {
    car_id: Number(car_id) || null,
    pickup_location,
    dropoff_location,
    pickup_date: normalizeDate(pickup_date_raw),
    dropoff_date: normalizeDate(dropoff_date_raw),
    pickup_time: normalizeTime(pickup_time_raw),
    dropoff_time: normalizeTime(dropoff_time_raw),
    total_price: Number(total_price) || null,
  };
}

function withTimeout(promise, ms, label) {
  return Promise.race([
    promise,
    new Promise((_, rej) => setTimeout(() => rej(new Error(`${label || "op"}_TIMEOUT`)), ms)),
  ]);
}

router.post("/", async (req, res) => {
  console.log("[PAYMENT] hit", new Date().toISOString(), "keys=", Object.keys(req.body || {}));
  normalizeNameOnReq(req);

  if (BYPASS) {
    const fakeId = Math.floor(Date.now() / 1000);
    console.log("[PAYMENT][BYPASS] Immediate 201, id=", fakeId);
    return res.status(201).json({
      success: true,
      message: "BYPASS_OK",
      reservationId: fakeId,
      reservation_id: fakeId,
      payment_id: `PAY_BYPASS_${fakeId}`,
      reservation: {
        id: fakeId,
        car_id: Number(req.body?.car_id || req.body?.carId || 0),
        pickup_location: req.body?.pickup_location || req.body?.pickup || "",
        dropoff_location: req.body?.dropoff_location || req.body?.drop || "",
        pickup_date: normalizeDate(req.body?.pickup_date || req.body?.pickupDate),
        dropoff_date: normalizeDate(req.body?.dropoff_date || req.body?.dropoffDate),
        pickup_time: normalizeTime(req.body?.pickup_time || req.body?.pickupTime),
        dropoff_time: normalizeTime(req.body?.dropoff_time || req.body?.dropoffTime),
        total_price:
          Number(req.body?.total_price) ||
          Number(req.body?.carInfo?.total) ||
          Number(req.body?.carInfo?.price) ||
          0,
        status: "confirmed",
        created_at: new Date().toISOString(),
      },
    });
  }

  try {
    const { firstName, lastName, cardNo, expiryMonth, expiryYear, cvv, carInfo, userEmail } =
      req.body || {};

    console.log("[PAYMENT] step:validate");
    if (!firstName || !lastName)
      return res.status(400).json({ success: false, message: "İsim bilgisi eksik" });
    if (!cardNo || !expiryMonth || !expiryYear || !cvv)
      return res.status(400).json({ success: false, message: "Kart bilgileri eksik" });
    if (!carInfo || typeof carInfo !== "object")
      return res.status(400).json({ success: false, message: "Rezervasyon bilgisi (carInfo) eksik" });

    const norm = normalizeReservationBody(req.body);
    console.log("[PAYMENT] normalized:", norm);
    if (!norm.car_id)
      return res.status(400).json({ success: false, message: "Geçersiz car_id/carId" });

    const priceNum =
      Number.isFinite(norm.total_price) && norm.total_price > 0
        ? norm.total_price
        : Number(
            carInfo.price ??
              carInfo.total ??
              carInfo.subtotal ??
              carInfo.basePrice ??
              carInfo.dailyPrice
          );
    if (!Number.isFinite(priceNum) || priceNum <= 0)
      return res.status(400).json({ success: false, message: "Geçersiz fiyat bilgisi" });

    console.log("[PAYMENT] step:auth");
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ success: false, message: "Token gerekli" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = decoded.userId; // <-- Login payload ile uyumlu
    console.log("[PAYMENT] user ok", user_id);

    const db = getDB();
    const user = await db.get(`SELECT * FROM users WHERE id = ?`, [user_id]);
    if (!user) return res.status(404).json({ success: false, message: "Kullanıcı bulunamadı" });

    const pickup_date = norm.pickup_date || normalizeDate(carInfo?.pickupDate);
    const dropoff_date = norm.dropoff_date || normalizeDate(carInfo?.dropoffDate);
    const pickup_time_n = norm.pickup_time || normalizeTime(carInfo?.pickupTime);
    const dropoff_time_n = norm.dropoff_time || normalizeTime(carInfo?.dropoffTime);

    console.log("[PAYMENT] availability check ->", norm.car_id, pickup_date, dropoff_date);
    let availability;
    try {
      availability = await withTimeout(
        checkCarAvailability(Number(norm.car_id), pickup_date, dropoff_date),
        AVAIL_TIMEOUT_MS,
        "AVAIL"
      );
      console.log("[PAYMENT] availability result:", availability);
    } catch (e) {
      console.warn("[PAYMENT] availability error:", String(e));
      availability = { available: true, reason: "timeout-skip" };
    }
    if (!availability.available) {
      return res.status(400).json({
        success: false,
        message: "Seçilen tarihlerde araç uygun değil",
        details: availability.reason,
      });
    }

    const payment_id = `PAY_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

    console.log("[PAYMENT] inserting reservation...");
    const nowISO = new Date().toISOString();

    const insertResult = await db.run(
      `INSERT INTO reservations (
        user_id, car_id,
        pickup_location, dropoff_location,
        pickup_date, dropoff_date,
        pickup_time, dropoff_time,
        total_price, status,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        Number(norm.car_id),
        norm.pickup_location ?? carInfo?.pickup ?? "",
        norm.dropoff_location ?? carInfo?.dropoff ?? "",
        pickup_date,
        dropoff_date,
        pickup_time_n,
        dropoff_time_n,
        priceNum,
        "confirmed",
        nowISO,
        nowISO,
      ]
    );

    const reservationId = insertResult?.lastID;
    if (!reservationId) {
      return res.status(500).json({ success: false, message: "Rezervasyon DB insert başarısız." });
    }
    console.log("[PAYMENT] insert done id=", reservationId);

    // E-posta (emailService imzasına uygun: (userEmail, reservationData))
    try {
      await sendReservationEmail(userEmail || user.email, {
        reservationId,
        userName: `${firstName} ${lastName}`,
        carModel: carInfo?.model || "",
        pickup: norm.pickup_location ?? carInfo?.pickup ?? "",
        dropoff: norm.dropoff_location ?? carInfo?.dropoff ?? "",
        pickupDate: pickup_date,
        dropDate: dropoff_date,
        total: priceNum,
      });
    } catch (mailErr) {
      console.warn("[PAYMENT] email send failed:", mailErr?.message);
    }

    const updatedReservation = await db.get(
      `SELECT r.*, c.model AS car_model, c.year AS car_year
       FROM reservations r
       LEFT JOIN cars c ON r.car_id = c.id
       WHERE r.id = ?`,
      [reservationId]
    );

    console.log("[PAYMENT] respond 201");
    return res.status(201).json({
      success: true,
      message: "Ödeme başarılı ve rezervasyon oluşturuldu",
      reservationId,
      reservation_id: reservationId,
      reservation: updatedReservation,
      payment_id,
    });
  } catch (error) {
    console.error("[PAYMENT] CATCH ERROR:", error);
    return res
      .status(500)
      .json({ success: false, message: "Ödeme sırasında bir hata oluştu", error: error.message });
  }
});

router.get("/ping", (req, res) => {
  res.json({ ok: true, msg: "payment route alive", build: "2025-08-19T08:10Z" });
});

router.get("/version", (req, res) => {
  res.type("text/plain").send("payment-route build 2025-08-19T08:10Z");
});

export default router;
