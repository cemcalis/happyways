import express from "express";
import { getDB } from "../../../../database/db.js";
// import authenticateToken from "../../../../middleware.js"; 

const router = express.Router();

router.get("/", async (req, res) => { 
  try {
    console.log("AllCars API hit with query:", req.query);
    const db = getDB();
    const { pickup, drop, pickupDate, dropDate, pickupTime, dropTime } = req.query;

    const cars = await db.all("SELECT * FROM cars");

    const updatedCars = cars.map((car) => ({
      ...car,
      image: car.image ? `http://10.0.2.2:3000/assets/cars/${car.image}` : null,
      available: car.available !== undefined ? car.available : 1 
    }));

    res.status(200).json({ 
      success: true,
      message: "Araçlar başarıyla getirildi",
      cars: updatedCars,
      count: updatedCars.length,
      searchInfo: pickup ? {
        pickup,
        drop,
        pickupDate,
        dropDate,
        pickupTime,  
        dropTime,
        availableCarsCount: updatedCars.length
      } : null
    });
  } catch (error) {
    console.error("All cars fetch error:", error);
    res.status(500).json({ 
      success: false,
      message: "Araç listesi alınırken hata oluştu", 
      error: error.message 
    });
  }
});

export default router;
