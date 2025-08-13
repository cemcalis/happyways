import express from "express";
import { getDB } from "../../database/db.js";
import bcrypt from "bcryptjs";
import jwt from  "jsonwebtoken";

const router = express.Router();


router.post("/", async (req, res) => {
  const db = getDB();
  const { email, password, phone } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

  if (!email || !password) {
    return res.status(400).json({ message: "Email ve şifre zorunludur." });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Geçersiz email formatı." });
  }

  if (!passwordRegex.test(password)) {
    return res.status(400).json({ message: "Geçersiz şifre formatı." });
  }
  try {
    const existingUser = await db.get("SELECT * FROM users WHERE email = ?", [email]);
    if (existingUser) {
      return res.status(409).json({ message: "Bu email zaten kayıtlı." });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);

 
    await db.run(
      "INSERT INTO users (email, password, phone) VALUES (?, ?, ?)",
      [email, hashedPassword, phone || ""]
    );

    return res.status(201).json({ message: "Kayıt başarılı." });
  } catch (error) {
    if (error.message.includes("UNIQUE constraint failed")) {
      return res.status(409).json({ message: "Bu email zaten kayıtlı." });
    }

   console.error("KAYIT HATASI:", error);
return res.status(500).json({ message: "Kayıt sırasında hata oluştu.", error: error.message });
  }
});

export default router;
