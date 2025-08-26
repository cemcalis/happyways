import { getDB } from "../../../database/db.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export async function deleteReservation(req, res) {
  try {
    const { id } = req.params;

    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "Token gerekli" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = decoded.id;

    const db = getDB();

    const reservation = await db.get(
      "SELECT * FROM reservations WHERE id = ? AND user_id = ?",
      [id, user_id]
    );
    if (!reservation) {
      return res.status(404).json({ message: "Rezervasyon bulunamadı" });
    }

    await db.run("DELETE FROM reservations WHERE id = ? AND user_id = ?", [id, user_id]);

    res.status(200).json({ message: "Rezervasyon başarıyla silindi" });
  } catch (error) {
    console.error("Rezervasyon silme hatası:", error);
    res
      .status(500)
      .json({ message: "Rezervasyon silinemedi", error: error.message });
  }
}