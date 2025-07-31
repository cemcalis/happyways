import express from "express";
import { getDB } from "../../database/db.js";
import bcrypt from "bcryptjs";

const router = express.Router();

router.post("/", async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ message: "Email ve yeni şifre zorunludur" });
  }

  try {
    const db = getDB();
    const hashedPassword = await bcrypt.hash(newPassword, 10);


    const result = await new Promise((resolve, reject) => {
      db.run(
        "UPDATE users SET password = ? WHERE email = ?",
        [hashedPassword, email],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve(this.changes); 
          }
        }
      );
    });

    if (result === 0) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    return res.status(200).json({ message: "Şifre başarıyla güncellendi" });

  } catch (error) {
    return res.status(500).json({ message: "Sunucu hatası", error: error.message });
  }
});

export default router;
