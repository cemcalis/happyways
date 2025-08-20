import express from "express";
import { getDB } from "../../database/db.js";
import jwt from "jsonwebtoken";
import checkCarAvailability from "./availability.js";
import { sendReservationEmail } from "./emailService.js";

const router = express.Router();


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
  console.log("/api/payment -> isteği alındı", req.body);
  normalizeNameOnReq(req);

  try {
    console.log("/api/payment -> işlem başlatıldı");
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
        pickup_date,
      dropoff_date,
      pickup_time,
      dropoff_time,
    } = req.body;

     const carId = carIdParam ?? carIdSnake;
    console.log("/api/payment -> carId belirlendi", carId);

    const resolvedPickupDate =
      pickupDate ?? pickup_date ?? carInfo?.pickupDate ?? carInfo?.pickup_date ?? "";
    const resolvedDropDate =
      dropDate ?? dropoff_date ?? carInfo?.dropDate ?? carInfo?.dropoff_date ?? "";
    const resolvedPickupTime =
      pickupTime ?? pickup_time ?? carInfo?.pickupTime ?? carInfo?.pickup_time ?? "00:00";
    const resolvedDropTime =
      dropTime ?? dropoff_time ?? carInfo?.dropTime ?? carInfo?.dropoff_time ?? "00:00";

    if (!firstName || !lastName) {
      console.log("/api/payment -> isim bilgisi eksik");
      return res.status(400).json({ success: false, message: "İsim bilgisi eksik" });
    }
    if (!cardNo || !expiryMonth || !expiryYear || !cvv) {
      console.log("/api/payment -> kart bilgileri eksik");
      return res.status(400).json({ success: false, message: "Kart bilgileri eksik" });
    }
    if (!carInfo || typeof carInfo !== "object") {
      console.log("/api/payment -> carInfo eksik");
      return res.status(400).json({ success: false, message: "Rezervasyon bilgisi (carInfo) eksik" });
    }
    if (!carId) {
      console.log("/api/payment -> araç ID eksik");
      return res.status(400).json({ success: false, message: "Araç ID gerekli" });
    }
  
    const priceNum = Number(
      carInfo.price ??
        carInfo.total ??
        carInfo.subtotal ??
        carInfo.basePrice ??
        carInfo.dailyPrice
    );
    console.log("/api/payment -> price hesaplandı", priceNum);
    if (!Number.isFinite(priceNum) || priceNum <= 0) {
      console.log("/api/payment -> geçersiz fiyat", priceNum);
      return res.status(400).json({ success: false, message: "Geçersiz fiyat bilgisi" });
    }

    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      console.log("/api/payment -> token yok");
      return res.status(401).json({ message: "Token gerekli" });
    }

    console.log("/api/payment -> token alındı");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = decoded.id;
    console.log("/api/payment -> token doğrulandı", user_id);

    const db = getDB();

    const user = await db.get("SELECT * FROM users WHERE id = ?", [user_id]);
    if (!user) {
      console.log("/api/payment -> kullanıcı bulunamadı", user_id);
      return res.status(404).json({ success: false, message: "Kullanıcı bulunamadı" });
    }
    console.log("/api/payment -> kullanıcı bulundu", user_id);

  
    console.log("/api/payment -> uygunluk kontrolü başlıyor");
    const availability = await checkCarAvailability(
      carId,
      resolvedPickupDate,
      resolvedDropDate
    );
    console.log("/api/payment -> uygunluk sonucu", availability);
    if (!availability.available) {
      console.log("/api/payment -> araç uygun değil");
      return res.status(400).json({
        success: false,
        message: "Seçilen tarihlerde araç uygun değil",
        details: availability.reason,
      });
    }

    // Ödeme simülasyonu
    console.log("/api/payment -> ödeme simülasyonu yapılıyor");
    const payment_success = true;

    if (!payment_success) {
      console.log("/api/payment -> ödeme başarısız");
      return res.status(400).json({ success: false, message: "Ödeme başarısız" });
    }
    console.log("/api/payment -> ödeme başarılı");

   
    console.log("/api/payment -> rezervasyon kaydı hazırlanıyor");
    const uniqueId = Date.now();
    const payment_id = `PAY_${uniqueId}_${Math.random().toString(36).substr(2, 9)}`;
    const reservation_id = uniqueId;
    const currentTimestamp = new Date().toISOString();

    await db.run(
      `INSERT INTO reservations (
        id, user_id, car_id, pickup_location, dropoff_location, pickup_date, dropoff_date,
        pickup_time, dropoff_time, total_price, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        reservation_id,
        user_id,
        carId,
        carInfo?.pickup_location || carInfo?.pickup || "",
        carInfo?.dropoff_location || carInfo?.dropoff || "",
        resolvedPickupDate,
        resolvedDropDate,
        resolvedPickupTime,
        resolvedDropTime,
        priceNum, 
        "confirmed",
        currentTimestamp,
        currentTimestamp,
      ]
    );
    console.log("/api/payment -> rezervasyon kaydı tamam", reservation_id);


    console.log("/api/payment -> yanıt gönderiliyor");
    res.status(200).json({
      success: true,
      message: "Kayıt başarılı",
      reservation_id,
      payment_id,
    });
    console.log("/api/payment -> yanıt gönderildi");

    
    console.log("/api/payment -> email gönderimi başlıyor");
    sendReservationEmail({
      to: userEmail || user.email,
      reservationId: reservation_id,
      userName: `${firstName} ${lastName}`,
      carModel: carInfo?.model || "",
      pickup: carInfo?.pickup || "",
      dropoff: carInfo?.dropoff || "",
      pickupDate: resolvedPickupDate,
      dropDate: resolvedDropDate,
      total: priceNum,
    })
      .then(() => console.log("/api/payment -> email gönderildi"))
      .catch((err) => console.error("Email gönderim hatası:", err));

    return;
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

export default router;
