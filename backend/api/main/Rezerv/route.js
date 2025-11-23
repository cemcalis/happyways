import express from "express";
import { getDB } from "../../../database/db.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../../utils/tokenUtils.js";

const router = express.Router();

const decodeUserId = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.id;
  } catch (error) {
    return null;
  }
};

router.get("/", async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "Token gerekli" });
    }

    const user_id = decodeUserId(token);
    if (!user_id) {
      return res.status(401).json({ message: "Token doğrulanamadı" });
    }

    const db = getDB();

    const reservations = await db.all(
      `
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
    `,
      [user_id]
    );

    const updatedReservations = reservations.map((reservation) => ({
      ...reservation,
      image: `http://10.0.2.2:3000/${reservation.image}`,
    }));

    res.status(200).json({
      reservations: updatedReservations,
      count: updatedReservations.length,
    });
  } catch (error) {
    console.error("Rezervasyonlar alınamadı:", error);
    res.status(500).json({ message: "Rezervasyonlar alınamadı", error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "Token gerekli" });
    }

    const user_id = decodeUserId(token);
    if (!user_id) {
      return res.status(401).json({ message: "Token doğrulanamadı" });
    }

    const db = getDB();

    const reservation = await db.get(
      `
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
    `,
      [id, user_id]
    );

    if (!reservation) {
      return res.status(404).json({ message: "Rezervasyon bulunamadı" });
    }

    reservation.image = `http://10.0.2.2:3000/${reservation.image}`;

    res.status(200).json({ reservation });
  } catch (error) {
    console.error("Rezervasyon detayı alınamadı:", error);
    res.status(500).json({ message: "Rezervasyon detayı alınamadı", error: error.message });
  }
});

export default router;
