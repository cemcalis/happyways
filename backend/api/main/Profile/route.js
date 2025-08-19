import express from "express";
import bcrypt from "bcryptjs";
import { getDB } from "../../../database/db.js";

const router = express.Router();



router.get("/:id", async (req, res) => {
  const db = getDB();
  const { id } = req.params;

  try {
    const user = await db.get(
      "SELECT id, first_name, last_name, email, phone FROM users WHERE id = ?",
      [id]
    );
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: "Profil bilgileri alınamadı.", error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  const db = getDB();
  const { id } = req.params;
  const { first_name, last_name, email, phone, password } = req.body;

  if (!first_name || !last_name || !email) {
    return res.status(400).json({ message: "Ad, soyad ve email zorunludur." });
  }

  try {
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
    await db.run(
      "UPDATE users SET first_name = ?, last_name = ?, full_name = ?, email = ?, phone = ?, password = COALESCE(?, password) WHERE id = ?",
      [
        first_name,
        last_name,
        `${first_name} ${last_name}`.trim(),
        email,
        phone || "",
        hashedPassword,
        id,
      ]
    );
     res.status(200).json(user);
  } catch (error) {
    console.error("Profile data fetch error:", error);
    res.status(500).json({
      message: "Profil verileri alınamadı",
      error: error.message,
    });
  }
});
  
export default router;
