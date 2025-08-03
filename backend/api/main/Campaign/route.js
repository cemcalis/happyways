import express from "express";
import { getDB } from "../../../database/db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const db = getDB();
    const campaigns = await db.all("SELECT * FROM campaigns");

    // Resim yolu düzeltme
    const updatedCampaigns = campaigns.map(c => ({
      ...c,
      image: c.image
        ? `http://10.0.2.2:3000/assets/campaign/${c.image}`
        : null
    }));

    res.status(200).json({ campaigns: updatedCampaigns });
  } catch (error) {
    console.error("Kampanyalar alınamadı:", error);
    res.status(500).json({
      success: false,
      message: "Veritabanı hatası",
      error: error.message,
    });
  }
});

export default router;
