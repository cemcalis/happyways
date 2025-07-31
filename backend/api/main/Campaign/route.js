import express from "express";
import { getDB } from "../../../database/db.js";

const router = express.Router();

router.get("/:id", async (req, res) => {
  const db = getDB();
  const { id } = req.params;

  try {
    const campaign = await db.get("SELECT * FROM campaigns WHERE id = ?", [id]);

    if (!campaign) {
      return res.status(404).json({ success: false, message: "Kampanya bulunamadı." });
    }

  
    if (campaign.image && !campaign.image.startsWith("http")) {
      campaign.image = `http://10.0.2.2:3000/assets/campaigns/${campaign.image}`;
    }

    return res.status(200).json({ success: true, ...campaign });
  } catch (error) {
    console.error("Kampanya detayı alınamadı:", error);
    return res.status(500).json({ success: false, message: "Veritabanı hatası", error: error.message });
  }
});

export default router;
