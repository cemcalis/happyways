import express from "express";
import { getDB } from "../../database/db.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { 
      reservation_id,
      payment_method,
      card_number,
      card_holder,
      expiry_date,
      cvv,
      amount
    } = req.body;

    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: "Token gerekli" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = decoded.id;

    if (!reservation_id || !payment_method || !amount) {
      return res.status(400).json({ message: "Gerekli ödeme bilgileri eksik" });
    }

    const db = getDB();

    const reservation = await db.get(
      "SELECT * FROM reservations WHERE id = ? AND user_id = ?", 
      [reservation_id, user_id]
    );

    if (!reservation) {
      return res.status(404).json({ message: "Rezervasyon bulunamadı" });
    }

    const payment_success = Math.random() > 0.1; 

    if (payment_success) {

      const payment_id = `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const currentTimestamp = new Date().toISOString();

      await db.run(
        `UPDATE reservations 
         SET status = 'confirmed', 
             payment_status = 'paid',
             payment_id = ?,
             updated_at = ?
         WHERE id = ?`,
        [payment_id, currentTimestamp, reservation_id]
      );

      const updatedReservation = await db.get(`
        SELECT 
          r.*,
          u.full_name as user_full_name,
          u.email as user_email,
          c.model as car_model,
          c.year as car_year
        FROM reservations r
        JOIN users u ON r.user_id = u.id  
        JOIN cars c ON r.car_id = c.id
        WHERE r.id = ?
      `, [reservation_id]);

      res.status(200).json({ 
        success: true,
        message: "Ödeme başarılı, rezervasyonunuz onaylandı",
        payment_id: payment_id,
        reservation_id: reservation_id,
        reservation_summary: {
          user: updatedReservation.user_full_name || updatedReservation.user_email,
          car: `${updatedReservation.car_model} ${updatedReservation.car_year}`,
          period: `${updatedReservation.pickup_date} ${updatedReservation.pickup_time} - ${updatedReservation.dropoff_date} ${updatedReservation.dropoff_time}`,
          locations: `${updatedReservation.pickup_location} → ${updatedReservation.dropoff_location}`,
          total_paid: updatedReservation.total_price,
          payment_date: currentTimestamp,
          status: 'confirmed'
        }
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
