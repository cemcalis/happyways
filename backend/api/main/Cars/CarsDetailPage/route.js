import express from "express";
import { dbGet } from "../../../../database/db.js";

const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

   
    const car = await dbGet("SELECT * FROM cars WHERE id = ?", [id]);

    if (!car) {
      return res.status(404).json({ message: "Araç bulunamadı" });
    }

   
    car.image = car.image ? `http://10.0.2.2:3000/assets/cars/${car.image}` : null;

    res.status(200).json({ car });
  } catch (error) {
    console.error("Araç detayı alınırken hata:", error);
    res.status(500).json({ message: "Araç detayı alınamadı", error: error.message });
  }
});

export default router;
