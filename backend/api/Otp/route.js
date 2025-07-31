// backend/api/Otp/route.js
import express from "express";
import {
  getOtpForEmail,
  deleteOtpForEmail,
} from "../../utils/otpStore.js";

const router = express.Router();


router.post("/verify", (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ message: "Email ve kod zorunludur" });
  }
try{
  const record = getOtpForEmail(email);

  if (!record) {
    return res.status(400).json({ message: "Kod bulunamadı ya da süresi doldu" });
  }

  if (Date.now() > record.expiresAt) {
    deleteOtpForEmail(email);
    return res.status(400).json({ message: "Kodun süresi doldu" });
  }

  if (record.code !== code) {
    return res.status(401).json({ message: "Kod geçersiz" });
  }

  deleteOtpForEmail(email);
  return res.status(200).json({ message: "Doğrulama başarılı" });
}
catch (error) {
    return res.status(500).json({ message: "Sunucu hatası", error: error.message });
}
});

export default router;
