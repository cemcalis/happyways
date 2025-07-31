import express from "express";
import { getDB } from "../../../../database/db.js";

const router = express.Router();

// Tek araç detayı endpointi
router.get("/:id", async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;

   
    const car = await db.get("SELECT * FROM cars WHERE id = ?", [id]);

    if (!car) {
      return res.status(404).json({ message: "Araç bulunamadı" });
    }

   
    car.image = `http://10.0.2.2:3000/${car.image}`;

    res.status(200).json({ car });
  } catch (error) {
    console.error("Araç detayı alınırken hata:", error);
    res.status(500).json({ message: "Araç detayı alınamadı", error: error.message });
  }
});

export default router;
