import express from "express";
import { getDB } from "../../database/db.js";
import jwt from "jsonwebtoken";
import checkCarAvailability from "./availability.js";
import { sendReservationEmail } from "./emailService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      name,
      cardNo,
      expiryMonth,
      expiryYear,
      cvv,
      carInfo,
      userEmail,
      secure,
      emailChecked,
      smsChecked,
      carId,
      carModel,
      carPrice,
      pickupDate,
      dropDate,
      pickupTime,
      dropTime,
      pickup,
      drop,
      extraDriver,
      extraDriverPrice,
      insurance,
      insurancePrice,
      totalPrice,
      calculatedBasePrice
    } = req.body;

    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token gerekli"
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Geçersiz token"
      });
    }

    const user_id = decoded.id;

    if (!userEmail || !userEmail.includes('@')) {
      return res.status(400).json({
        success: false,
        message: "Geçerli email adresi gerekli"
      });
    }

    const db = getDB();

    const user = await db.get("SELECT * FROM users WHERE id = ?", [user_id]);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Kullanıcı bulunamadı"
      });
    }

    const availability = await checkCarAvailability(carId, pickupDate, dropDate);

    if (!availability.available) {
      return res.status(409).json({
        success: false,
        message: "Seçilen tarihler için araç müsait değil",
        conflictingReservations: availability.conflictingReservations || []
      });
    }

    const payment_success = true;

    if (payment_success) {

      const uniqueId = Date.now();
      const payment_id = `PAY_${uniqueId}_${Math.random().toString(36).substr(2, 9)}`;
      const reservation_id = uniqueId;
      const currentTimestamp = new Date().toISOString();

      const insertResult = await new Promise((resolve, reject) => {
        db.run(
          `INSERT INTO reservations (
            id, user_id, car_id, pickup_location, dropoff_location,
            pickup_date, dropoff_date, pickup_time, dropoff_time,
            total_price, status, created_at, user_email,
            extra_driver, extra_driver_price, insurance, insurance_price
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            reservation_id,
            Number(user_id),
            Number(carId),
            String(pickup),
            String(drop),
            String(pickupDate),
            String(dropDate),
            String(pickupTime),
            String(dropTime),
            String(totalPrice),
            'confirmed',
            currentTimestamp,
            String(userEmail),
            extraDriver ? 1 : 0,
            Number(extraDriverPrice) || 0,
            insurance ? 1 : 0,
            Number(insurancePrice) || 0
          ],
          function(err) {
            if (err) {
              console.error('INSERT ERROR:', err.message);
              reject(err);
            } else {
              console.log('INSERT SUCCESS, reservation_id:', reservation_id, 'rowid:', this.lastID, 'changes:', this.changes);
              resolve({ lastID: this.lastID, changes: this.changes });
            }
          }
        );
      });

      const car = await db.get("SELECT * FROM cars WHERE id = ?", [carId]);

      const emailSent = await sendReservationEmail(userEmail, {
        reservation_id,
        carModel: car ? `${car.model} ${car.year}` : carModel,
        pickupDate,
        dropDate,
        pickupTime,
        dropTime,
        pickup,
        drop,
        totalPrice,
        extraDriver,
        insurance
      });

      if (emailSent) {
        console.log(` Rezervasyon emaili gönderildi: ${userEmail}`);
      } else {
        console.log(` Email gönderilemedi: ${userEmail}`);
      }

      const updatedReservation = await db.get(`
          SELECT
            r.*,
            c.model as car_model,
            c.year as car_year
          FROM reservations r
          LEFT JOIN cars c ON r.car_id = c.id
          WHERE r.id = ?
        `, [Number(reservation_id)]);
      console.log('INSERT edilen reservation_id:', reservation_id);

      let reservationSummary;
      if (updatedReservation) {
        reservationSummary = {
          user: updatedReservation.user_email || userEmail,
          car: `${updatedReservation.car_model} ${updatedReservation.car_year}`,
          period: `${updatedReservation.pickup_date} ${updatedReservation.pickup_time} - ${updatedReservation.dropoff_date} ${updatedReservation.dropoff_time}`,
          locations: `${updatedReservation.pickup_location} → ${updatedReservation.dropoff_location}`,
          total_paid: updatedReservation.total_price,
          payment_date: currentTimestamp,
          status: 'confirmed'
        };
      } else {

        reservationSummary = {
          user: userEmail,
          car: carModel,
          period: `${pickupDate} ${pickupTime} - ${dropDate} ${dropTime}`,
          locations: `${pickup} → ${drop}`,
          total_paid: totalPrice,
          payment_date: currentTimestamp,
          status: 'confirmed'
        };
      }

      res.status(200).json({
        success: true,
        message: "Ödeme başarılı, rezervasyonunuz onaylandı",
        payment_id: payment_id,
        reservation_id: reservation_id,
        reservation_summary: reservationSummary
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Ödeme işlemi başarısız, lütfen tekrar deneyin"
      });
    }

  } catch (error) {
    console.error("Ödeme işlemi hatası:", error);
    res.status(500).json({
      success: false,
      message: "Ödeme işleminde hata oluştu",
      error: error.message
    });
  }
});

router.get("/history", async (req, res) => {
  try {

    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: "Token gerekli" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = decoded.id;

    const db = getDB();

    const payments = await db.all(`
      SELECT
        r.*,
        c.model,
        c.year,
        c.image
      FROM reservations r
      JOIN cars c ON r.car_id = c.id
      WHERE r.user_id = ? AND r.status = 'confirmed'
      ORDER BY r.created_at DESC
    `, [user_id]);

    const updatedPayments = payments.map(payment => ({
      ...payment,
      image: `http://10.0.2.2:3000/${payment.image}`,
      payment_id: `PAY_${payment.id}_${payment.created_at}`
    }));

    res.status(200).json({
      payments: updatedPayments,
      total_count: updatedPayments.length
    });

  } catch (error) {
    console.error("Ödeme geçmişi alınamadı:", error);
    res.status(500).json({
      message: "Ödeme geçmişi alınamadı",
      error: error.message
    });
  }
});

router.get("/status/:reservation_id", async (req, res) => {
  try {
    const { reservation_id } = req.params;

    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: "Token gerekli" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = decoded.id;

    const db = getDB();

    const reservation = await db.get(
      `SELECT
         r.*,
         c.model,
         c.year
       FROM reservations r
       JOIN cars c ON r.car_id = c.id
       WHERE r.id = ? AND r.user_id = ?`,
      [reservation_id, user_id]
    );

    if (!reservation) {
      return res.status(404).json({ message: "Rezervasyon bulunamadı" });
    }

    const payment_status = reservation.status === 'confirmed' ? 'paid' : 'pending';

    res.status(200).json({
      reservation_id: reservation.id,
      payment_status: payment_status,
      car_info: `${reservation.model} ${reservation.year}`,
      total_amount: reservation.total_price,
      created_at: reservation.created_at
    });

  } catch (error) {
    console.error("Ödeme durumu kontrol hatası:", error);
    res.status(500).json({
      message: "Ödeme durumu kontrol edilemedi",
      error: error.message
    });
  }
});

export default router;
