import express from "express";
import { getDB } from "../../../database/db.js";
import authenticateToken from "../../../middleware.js";
const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  const db = getDB();
  try {
    const user = await db.get(
      "SELECT id, email, full_name, phone FROM users WHERE id = ?",
      [req.user.id]
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Kullanıcı bulunamadı.",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Profil bilgisi alınırken hata:", error);
    return res.status(500).json({
      success: false,
      message: "Sunucu hatası.",
    });
  }
});
export default router;
