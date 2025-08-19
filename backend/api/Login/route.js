import express from "express";
import bcrypt from "bcryptjs";
import { getDB } from "../../database/db.js";
import jwt from "jsonwebtoken";
import { generateRefreshToken } from "../auth/refresh.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email ve şifre zorunludur." });
  }

  try {
    const db = getDB();
    const normalizedEmail = String(email).trim().toLowerCase();

    // Case-insensitive arama
    const user = await db.get(
      `SELECT * FROM users WHERE email = ? COLLATE NOCASE`,
      [normalizedEmail]
    );

    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: "Şifre hatalı." });
    }

    const accessToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    const refreshToken = await generateRefreshToken(user.id);

    return res.status(200).json({
      message: "Giriş başarılı",
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        first_name: user.first_name,
        last_name: user.last_name
      }
    });
  } catch (error) {
    console.error("LOGIN HATA:", error);
    return res.status(500).json({ message: "Sunucu hatası", error: error.message });
  }
});

export default router;
