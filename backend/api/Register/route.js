import express from "express";
import bcrypt from "bcryptjs";
import { getDB } from "../../database/db.js";
import jwt from "jsonwebtoken";
import { generateRefreshToken } from "../auth/refresh.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { first_name, last_name, email, password, phone } = req.body;

  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ message: "Tüm alanlar zorunludur." });
  }

  try {
    const db = getDB();
    const normalizedEmail = String(email).trim().toLowerCase();
    const existingUser = await db.get(
      `SELECT * FROM users WHERE email = ? COLLATE NOCASE`,
      [normalizedEmail]
    );
    if (existingUser) {
      return res.status(409).json({ message: "Bu email ile kayıtlı kullanıcı zaten var." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.run(
      `INSERT INTO users (email, password, phone, first_name, last_name) VALUES (?, ?, ?, ?, ?)`,
      [normalizedEmail, hashedPassword, phone || null, first_name, last_name]
    );
    return res.status(201).json({
      message: "Kayıt başarılı.",
      user: {
        id: result.lastID,
        email: normalizedEmail,
        phone: phone || null,
        first_name,
        last_name
      }
    });
  } catch (error) {
    console.error("REGISTER HATA:", error);
    return res.status(500).json({ message: "Sunucu hatası", error: error.message });
  }
});

export default router;
