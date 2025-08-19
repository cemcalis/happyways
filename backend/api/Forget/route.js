import express from "express";
import nodemailer from "nodemailer";
import { saveOtpForEmail } from "../../utils/otpStore.js";
import { getUserByEmail } from "../../database/db.js";
import { loadEnv } from "../../utils/env.js";


loadEnv();
const router = express.Router();

router.post("/", async (req, res) => {
  console.log(" API /api/forgot-password çağrıldı.");

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email zorunludur" });
  }

  const resetCode = Math.floor(1000 + Math.random() * 9000).toString();

  try {
    const user = await getUserByEmail(email.trim().toLowerCase());

    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    saveOtpForEmail(email, resetCode);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
         user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `HappyWays <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Şifre Sıfırlama Talebi",
      text: `Şifrenizi sıfırlamak için doğrulama kodunuz: ${resetCode}`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: "Şifre sıfırlama kodu gönderildi" });
  } catch (error) {
    return res.status(500).json({ message: "Sunucu hatası", error: error.message });
  }
});

export default router;
