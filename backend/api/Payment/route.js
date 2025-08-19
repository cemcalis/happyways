// backend/routes/payment/route.js
import express from "express";
import { getDB } from "../../database/db.js";
import jwt from "jsonwebtoken";
import checkCarAvailability from "./availability.js";
import { sendReservationEmail } from "./emailService.js";

const router = express.Router();

/* ----------------------- Helpers ----------------------- */
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
        req.body.lastName  = lastName;
      }
    }
  } catch (_) {}
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
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
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

  const car_id           = pick(body.car_id, body.carId);
  const pickup_location  = pick(body.pickup_location, body.pickupLocation ?? body.pickup);
  const dropoff_location = pick(body.dropoff_location, body.dropoffLocation ?? body.drop);
  const pickup_date_raw  = pick(body.pickup_date, body.pickupDate);
  const dropoff_date_raw = pick(body.dropoff_date, body.dropoffDate);
  const pickup_time_raw  = pick(body.pickup_time, body.pickupTime);
  const dropoff_time_raw = pick(body.dropoff_time, body.dropoffTime);
  const total_price      = pick(body.total_price, body.totalPrice);

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

/* ----------------------- Routes ----------------------- */

// POST /api/payment
router.post("/", async (req, res) => {
  normalizeNameOnReq(req);

  try {
    const {
      firstName, lastName,
      cardNo, expiryMonth, expiryYear, cvv,
      carInfo, userEmail
    } = req.body;

    // form validasyonu
    if (!firstName || !lastName) {
      return res.status(400).json({ success: false, message: "İsim bilgisi eksik" });
    }
    if (!cardNo || !expiryMonth || !expiryYear || !cvv) {
      return res.status(400).json({ success: false, message: "Kart bilgileri eksik" });
    }
    if (!carInfo || typeof carInfo !== "object") {
      return res.status(400).json({ success: false, message: "Rezervasyon bilgisi (carInfo) eksik" });
    }

    // body normalize (camelCase/snake_case)
    const norm = normalizeReservationBody(req.body);
    if (!norm.car_id) {
      return res.status(400).json({ success: false, message: "Geçersiz car_id/carId" });
    }

    // fiyat belirle (body total_price yoksa carInfo'dan)
    const priceNum =
      Number.isFinite(norm.total_price) && norm.total_price > 0
        ? norm.total_price
        : Number(
            carInfo.price ?? carInfo.total ?? carInfo.subtotal ?? carInfo.basePrice ?? carInfo.dailyPrice
          );
    if (!Number.isFinite(priceNum) || priceNum <= 0) {
      return res.status(400).json({ success: false, message: "Geçersiz fiyat bilgisi" });
    }

    // auth
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ success: false, message: "Token gerekli" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = decoded.id;

    const db = getDB();

    const user = await new Promise((resolve, reject) => {
      db.get(`SELECT * FROM users WHERE id = ?`, [user_id], (err, row) =>
        err ? reject(err) : resolve(row)
      );
    });
    if (!user) return res.status(404).json({ success: false, message: "Kullanıcı bulunamadı" });

    // tarih/saat: önce norm, yoksa carInfo
    const pickup_date   = norm.pickup_date   || normalizeDate(carInfo?.pickupDate);
    const dropoff_date  = norm.dropoff_date  || normalizeDate(carInfo?.dropoffDate);
    const pickup_time_n = norm.pickup_time   || normalizeTime(carInfo?.pickupTime);
    const dropoff_time_n= norm.dropoff_time  || normalizeTime(carInfo?.dropoffTime);

    // uygunluk kontrolü
    const availability = await checkCarAvailability(Number(norm.car_id), pickup_date, dropoff_date);
    if (!availability.available) {
      return res.status(400).json({
        success: false,
        message: "Seçilen tarihlerde araç uygun değil",
        details: availability.reason,
      });
    }

    // ödeme simülasyonu (gerçek gateway entegrasyonunu buraya koyarsın)
    const payment_success = true;
    if (!payment_success) {
      return res.status(400).json({ success: false, message: "Ödeme başarısız" });
    }

    const payment_id = `PAY_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const nowISO = new Date().toISOString();

    // INSERT
    const insertResult = await new Promise((resolve, reject) => {
      db.run(
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
        ],
        function (err) {
          if (err) reject(err);
          else resolve({ lastID: this.lastID });
        }
      );
    });

    const reservationId = insertResult?.lastID;

    // e-posta (best effort)
    try {
      await sendReservationEmail({
        to: userEmail || user.email,
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
      console.warn("E-posta gönderilemedi:", mailErr?.message);
    }

    // SELECT & response
    const updatedReservation = await new Promise((resolve, reject) => {
      db.get(
        `SELECT r.*, c.model AS car_model, c.year AS car_year
         FROM reservations r
         LEFT JOIN cars c ON r.car_id = c.id
         WHERE r.id = ?`,
        [reservationId],
        (err, row) => (err ? reject(err) : resolve(row))
      );
    });

    return res.status(201).json({
      success: true,
      message: "Ödeme başarılı ve rezervasyon oluşturuldu",
      reservationId,                 // camelCase
      reservation_id: reservationId, // snake_case de eklendi
      reservation: updatedReservation,
      payment_id,
    });
  } catch (error) {
    console.error("Ödeme hatası:", error);
    return res.status(500).json({ success: false, message: "Ödeme sırasında bir hata oluştu", error: error.message });
  }
});

// GET /api/payment/status/:id  (sadece ilgili kullanıcıya ait rezervasyon)
router.get("/status/:id", async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "Token gerekli" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = decoded.id;

    const db = getDB();
    const reservation = await new Promise((resolve, reject) => {
      db.get(
        `SELECT
           r.*,
           c.model AS car_model,
           c.year  AS car_year,
           u.name  AS user_full_name
         FROM reservations r
         LEFT JOIN cars  c ON r.car_id = c.id
         LEFT JOIN users u ON r.user_id = u.id
         WHERE r.id = ? AND r.user_id = ?`,
        [req.params.id, user_id],
        (err, row) => (err ? reject(err) : resolve(row))
      );
    });

    if (!reservation) return res.status(404).json({ message: "Rezervasyon bulunamadı" });

    return res.status(200).json({
      success: true,
      reservation: {
        reservation_id: reservation.id,
        car_model: reservation.car_model,
        car_year: reservation.car_year,
        user_name: reservation.user_full_name,
        pickup_location: reservation.pickup_location,
        dropoff_location: reservation.dropoff_location,
        pickup_date: reservation.pickup_date,
        dropoff_date: reservation.dropoff_date,
        payment_status: reservation.payment_status || "unknown",
        total_amount: reservation.total_price,
        created_at: reservation.created_at,
      },
    });
  } catch (error) {
    console.error("Ödeme durumu kontrol hatası:", error);
    return res.status(500).json({ message: "Ödeme durumu kontrol edilemedi", error: error.message });
  }
});

// GET /api/payment/history
router.get("/history", async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "Token gerekli" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = decoded.id;

    const db = getDB();
    const payments = await new Promise((resolve, reject) => {
      db.all(
        `SELECT 
           r.id, r.car_id, r.pickup_location, r.dropoff_location, r.pickup_date, r.dropoff_date,
           r.total_price, r.created_at, c.model, c.image
         FROM reservations r
         LEFT JOIN cars c ON r.car_id = c.id
         WHERE r.user_id = ? AND r.status = 'confirmed'
         ORDER BY r.created_at DESC`,
        [user_id],
        (err, rows) => (err ? reject(err) : resolve(rows || []))
      );
    });

    const updatedPayments = payments.map((p) => ({
      ...p,
      image: p.image ? `http://10.0.2.2:3000/${p.image}` : null, // emu loopback
      payment_id: `PAY_${p.id}_${p.created_at}`,
    }));

    return res.status(200).json({ success: true, payments: updatedPayments, total_count: updatedPayments.length });
  } catch (error) {
    console.error("Ödeme geçmişi hatası:", error);
    return res.status(500).json({ message: "Ödeme geçmişi alınamadı", error: error.message });
  }
});

// (opsiyonel public) GET /api/payment/reservation/:id
router.get("/reservation/:id", async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "Token gerekli" });

    const db = getDB();
    const reservation = await new Promise((resolve, reject) => {
      db.get(
        `SELECT
           r.*,
           c.model AS car_model,
           c.year  AS car_year,
           u.name  AS user_full_name
         FROM reservations r
         LEFT JOIN cars  c ON r.car_id = c.id
         LEFT JOIN users u ON r.user_id = u.id
         WHERE r.id = ?`,
        [req.params.id],
        (err, row) => (err ? reject(err) : resolve(row))
      );
    });

    if (!reservation) return res.status(404).json({ message: "Rezervasyon bulunamadı" });

    return res.status(200).json({
      success: true,
      reservation: {
        reservation_id: reservation.id,
        car_model: reservation.car_model,
        car_year: reservation.car_year,
        user_name: reservation.user_full_name,
        pickup_location: reservation.pickup_location,
        dropoff_location: reservation.dropoff_location,
        pickup_date: reservation.pickup_date,
        dropoff_date: reservation.dropoff_date,
        payment_status: reservation.payment_status || "unknown",
        total_amount: reservation.total_price,
        created_at: reservation.created_at,
      },
    });
  } catch (error) {
    console.error("Ödeme durumu kontrol hatası:", error);
    return res.status(500).json({ message: "Ödeme durumu kontrol edilemedi", error: error.message });
  }
});

export default router;
