import express from "express";
import { getDB } from "../../../../database/db.js";
import authenticateToken from "../../../../middleware.js";

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  try {
    const db = getDB();
    const { pickup, drop, pickupDate, dropDate, pickupTime, dropTime } = req.query;

    let cars;
    
    // If search parameters are provided, filter available cars
    if (pickup && pickupDate && dropDate && pickupTime && dropTime) {
      // Convert date and time to datetime format for comparison
      const startDateTime = `${pickupDate} ${pickupTime}`;
      const endDateTime = `${dropDate} ${dropTime}`;

      // Get cars that are NOT reserved during the requested time period
      const reservedCarsQuery = `
        SELECT DISTINCT car_id 
        FROM reservations 
        WHERE status != 'cancelled' AND (
          (pickup_datetime <= ? AND dropoff_datetime >= ?) OR
          (pickup_datetime <= ? AND dropoff_datetime >= ?) OR
          (pickup_datetime >= ? AND dropoff_datetime <= ?)
        )
      `;

      const reservedCars = await db.all(reservedCarsQuery, [
        endDateTime, startDateTime,    // Mevcut rezervasyon başlangıçtan önce başlayıp başlangıçtan sonra bitiyor
        startDateTime, endDateTime,    // Mevcut rezervasyon bitiş tarihinden önce başlayıp bitiş tarihinden sonra bitiyor
        startDateTime, endDateTime     // Mevcut rezervasyon tamamen istenen dönem içinde
      ]);

      const reservedCarIds = reservedCars.map(row => row.car_id);

      if (reservedCarIds.length > 0) {
        const placeholders = reservedCarIds.map(() => '?').join(',');
        cars = await db.all(`SELECT * FROM cars WHERE id NOT IN (${placeholders})`, reservedCarIds);
      } else {
        cars = await db.all("SELECT * FROM cars");
      }
    } else {
      // No filters, return all cars
      cars = await db.all("SELECT * FROM cars");
    }

    const updatedCars = cars.map((car) => ({
      ...car,
      image: car.image ? `http://10.0.2.2:3000/assets/cars/${car.image}` : null,
      available: car.available !== undefined ? car.available : 1 // Default to available if column doesn't exist
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
