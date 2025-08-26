import express from "express";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "../../database/db.js";
import jwt from "jsonwebtoken";
import { generateRefreshToken } from "../auth/refresh.js";
import { handleError } from "../../utils/errorHandler.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email ve şifre zorunludur." });
  }

  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Şifre hatalı." });
    }

    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" } 
    );

    const refreshToken = await generateRefreshToken(user.id);

    return res.status(200).json({
      message: "Giriş başarılı",
      accessToken,
      refreshToken,
      user: { 
        id: user.id,
        email: user.email, 
        phone: user.phone 
      },
    });
  } catch (error) {
    return handleError(res, error, 500, "Sunucu hatası");
  }
});

export default router;