import express from "express";
import { getDB } from "../../../database/db.js";
import authenticateToken from "../../../middleware.js";

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  const db = getDB();

  try {
    const campaigns = await db.all("SELECT * FROM campaigns");
    const cars = await db.all("SELECT * FROM cars");

 const updatedCampaigns = campaigns.map(campaign => ({
      ...campaign,
      image: campaign.image ? `http://10.0.2.2:3000/assets/campaign/${campaign.image}` : null
    }));

    const updatedCars = cars.map(car => ({
      ...car,
      image: car.image ? `http://10.0.2.2:3000/assets/cars/${car.image}` : null
    }));

    res.status(200).json({ 
      success: true,
      message: "Ana sayfa verileri başarıyla getirildi",
      campaigns: updatedCampaigns, 
      cars: updatedCars 
    });
  } catch (error) {
    console.error("Home data fetch error:", error);
    res.status(500).json({ 
      success: false,
      message: "Ana sayfa verileri alınamadı", 
      error: error.message 
    });
  }
});

export default router;
