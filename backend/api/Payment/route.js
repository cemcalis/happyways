import express from "express";
import { getDB } from "../../database/db.js";
import jwt from "jsonwebtoken";
import checkCarAvailability from "./availability.js";
import { sendReservationEmail } from "./emailService.js";

const router = express.Router();

// --- normalize full name -> firstName + lastName ---
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
  } catch (_) {}
}

router.post("/", async (req, res) => {
  normalizeNameOnReq(req);

   try {
    const {
      firstName,
      lastName,
      cardNo,
      expiryMonth,
      expiryYear,
      cvv,
      carInfo,
      userEmail,
      secure,
      emailChecked,
      smsChecked,
      carId: carIdParam,
      car_id: carIdSnake,
      pickupDate,
      dropDate,
      pickupTime,
      dropTime,
    } = req.body;

    const carId = carIdParam ?? carIdSnake;

    if (!firstName || !lastName) {
      return res.status(400).json({ success: false, message: "İsim bilgisi eksik" });
    }
    if (!cardNo || !expiryMonth || !expiryYear || !cvv) {
      return res.status(400).json({ success: false, message: "Kart bilgileri eksik" });
    }
    if (!carInfo || typeof carInfo !== "object") {
      return res.status(400).json({ success: false, message: "Rezervasyon bilgisi (carInfo) eksik" });
    }
    if (!carId) {
      return res.status(400).json({ success: false, message: "Araç ID gerekli" });
    }
    // fiyat normalize (FormValidation'da da yapıyoruz; burada da emniyet)
    const priceNum = Number(
      carInfo.price ??
        carInfo.total ??
        carInfo.subtotal ??
        carInfo.basePrice ??
        carInfo.dailyPrice
    );
    if (!Number.isFinite(priceNum) || priceNum <= 0) {
      return res.status(400).json({ success: false, message: "Geçersiz fiyat bilgisi" });
    }

    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "Token gerekli" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = decoded.id;

    const db = getDB();

    const user = await db.get("SELECT * FROM users WHERE id = ?", [user_id]);
    if (!user) return res.status(404).json({ success: false, message: "Kullanıcı bulunamadı" });

    // Uygunluk kontrolü
    const availability = await checkCarAvailability(carId, pickupDate, dropDate);
    if (!availability.available) {
      return res.status(400).json({
        success: false,
        message: "Seçilen tarihlerde araç uygun değil",
        details: availability.reason,
      });
    }

    // Ödeme simülasyonu
    const payment_success = true;

    if (!payment_success) {
      return res.status(400).json({ success: false, message: "Ödeme başarısız" });
    }

    // Rezervasyon oluştur
    const uniqueId = Date.now();
    const payment_id = `PAY_${uniqueId}_${Math.random().toString(36).substr(2, 9)}`;
    const reservation_id = uniqueId;
    const currentTimestamp = new Date().toISOString();

    await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO reservations (
          id, user_id, car_id, pickup_location, dropoff_location, pickup_date, dropoff_date,
          pickup_time, dropoff_time, total_price, status, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          reservation_id,
          user_id,
          carId,
          carInfo?.pickup || "",
          carInfo?.dropoff || "",
          pickupDate || "",
          dropDate || "",
          pickupTime || "00:00",
          dropTime || "00:00",
          priceNum, // normalize edilmiş
          "confirmed",
          currentTimestamp,
          currentTimestamp,
        ],
        function (err) {
          if (err) reject(err);
          else resolve(this);
        }
      );
    });

    await sendReservationEmail({
      to: userEmail || user.email,
      reservationId: reservation_id,
      userName: `${firstName} ${lastName}`,
      carModel: carInfo?.model || "",
      pickup: carInfo?.pickup || "",
      dropoff: carInfo?.dropoff || "",
      pickupDate: pickupDate || "",
      dropDate: dropDate || "",
      total: priceNum,
    });

    const updatedReservation = await db.get(
      `
      SELECT
        r.*,
        c.model as car_model,
        c.year as car_year
      FROM reservations r
      LEFT JOIN cars c ON r.car_id = c.id
      WHERE r.id = ?
    `,
      [reservation_id]
    );

    return res.status(200).json({
      success: true,
      message: "Ödeme başarılı ve rezervasyon oluşturuldu",
      reservation: updatedReservation,
      payment_id,
    });
  } catch (error) {
    console.error("Ödeme hatası:", error);
    res.status(500).json({ success: false, message: "Ödeme sırasında bir hata oluştu", error: error.message });
  }
});

router.get("/status/:id", async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "Token gerekli" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = decoded.id;

    const db = getDB();

    const reservation = await db.get(
      `SELECT r.*, c.model, c.year, u.name as user_full_name
       FROM reservations r
       LEFT JOIN cars c ON r.car_id = c.id
       LEFT JOIN users u ON r.user_id = u.id
       WHERE r.id = ? AND r.user_id = ?`,
      [req.params.id, user_id]
    );

    if (!reservation) return res.status(404).json({ message: "Rezervasyon bulunamadı" });

    res.status(200).json({
      success: true,
      reservation: {
        reservation_id: reservation.id,
        car_model: reservation.model,
        car_year: reservation.year,
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
    res.status(500).json({ message: "Ödeme durumu kontrol edilemedi", error: error.message });
  }
});

router.get("/history", async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "Token gerekli" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = decoded.id;

    const db = getDB();

    const payments = await db.all(
      `
      SELECT 
        r.id, r.car_id, r.pickup_location, r.dropoff_location, r.pickup_date, r.dropoff_date,
        r.total_price, r.created_at, c.model, c.image
      FROM reservations r
      LEFT JOIN cars c ON r.car_id = c.id
      WHERE r.user_id = ? AND r.status = 'confirmed'
      ORDER BY r.created_at DESC
    `,
      [user_id]
    );

    const updatedPayments = payments.map((payment) => ({
      ...payment,
      image: `http://10.0.2.2:3000/${payment.image}`,
      payment_id: `PAY_${payment.id}_${payment.created_at}`,
    }));

    res.status(200).json({ payments: updatedPayments, total_count: updatedPayments.length });
  } catch (error) {
    console.error("Ödeme geçmişi hatası:", error);
    res.status(500).json({ message: "Ödeme geçmişi alınamadı", error: error.message });
  }
});

router.get("/reservation/:id", async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "Token gerekli" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = decoded.id;

    const db = getDB();

    const reservation = await db.get(
      `SELECT r.*, c.model, c.year, u.name as user_full_name
       FROM reservations r
       LEFT JOIN cars c ON r.car_id = c.id
       LEFT JOIN users u ON r.user_id = u.id
       WHERE r.id = ?`,
      [req.params.id]
    );

    if (!reservation) return res.status(404).json({ message: "Rezervasyon bulunamadı" });

    res.status(200).json({
      success: true,
      reservation: {
        reservation_id: reservation.id,
        car_model: reservation.model,
        car_year: reservation.year,
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
    res.status(500).json({ message: "Ödeme durumu kontrol edilemedi", error: error.message });
  }
});

export default router;
