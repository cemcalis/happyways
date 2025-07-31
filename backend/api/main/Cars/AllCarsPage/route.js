import express from "express";
import { getDB } from "../../../../database/db.js";

const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const db = getDB();
    const cars = await db.all("SELECT * FROM cars");

   
    const updatedCars = cars.map((car) => ({
      ...car,
      image: `http://10.0.2.2:3000/${car.image}`,
    }));

    res.status(200).json({ cars: updatedCars });
  } catch (error) {
    console.error("Arabalar alınamadı:", error);
    res.status(500).json({ message: "Arabalar alınamadı", error: error.message });
  }
});

export default router;
