
import express from "express";
import { getDB } from "../../../database/db.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Kullanıcının aktif rezervasyonlarını getir
router.get("/", async (req, res) => {
  try {
    // Token kontrolü
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: "Token gerekli" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = decoded.id;

    const db = getDB();
    
    // Aktif rezervasyonları getir
    const reservations = await db.all(`
      SELECT 
        r.*,
        c.model,
        c.year,
        c.image,
        c.price
      FROM reservations r
      JOIN cars c ON r.car_id = c.id
      WHERE r.user_id = ? AND r.status = 'active'
      ORDER BY r.pickup_date ASC
    `, [user_id]);

    // Resim yollarını düzelt
    const updatedReservations = reservations.map(reservation => ({
      ...reservation,
      image: `http://10.0.2.2:3000/${reservation.image}`
    }));

    res.status(200).json({ 
      reservations: updatedReservations,
      count: updatedReservations.length 
    });

  } catch (error) {
    console.error("Rezervasyonlar alınamadı:", error);
    res.status(500).json({ message: "Rezervasyonlar alınamadı", error: error.message });
  }
});

// Rezervasyon detayı getir
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Token kontrolü
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: "Token gerekli" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = decoded.id;

    const db = getDB();

    // Rezervasyon detayını getir
    const reservation = await db.get(`
      SELECT 
        r.*,
        c.model,
        c.year,
        c.image,
        c.gear,
        c.fuel,
        c.seats,
        c.ac
      FROM reservations r
      JOIN cars c ON r.car_id = c.id
      WHERE r.id = ? AND r.user_id = ?
    `, [id, user_id]);

    if (!reservation) {
      return res.status(404).json({ message: "Rezervasyon bulunamadı" });
    }

    // Resim yolunu düzelt
    reservation.image = `http://10.0.2.2:3000/${reservation.image}`;

    res.status(200).json({ reservation });

  } catch (error) {
    console.error("Rezervasyon detayı alınamadı:", error);
    res.status(500).json({ message: "Rezervasyon detayı alınamadı", error: error.message });
  }
});

export default router;
