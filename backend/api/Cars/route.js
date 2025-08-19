import express from "express";
import { dbAll, dbGet, getDB } from "../../database/db.js";

const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const cars = await dbAll("SELECT * FROM cars ORDER BY model");
    
    res.status(200).json({
      success: true,
      cars: cars
    });
  } catch (error) {
    console.error("Araç listesi getirme hatası:", error);
    res.status(500).json({
      success: false,
      message: "Araçlar getirilemedi",
      error: error.message
    });
  }
});


router.post("/available", async (req, res) => {
  try {
    const { pickupDate, dropDate } = req.body;
    
    if (!pickupDate || !dropDate) {
      return res.status(400).json({
        success: false,
        message: "Alış ve teslim tarihleri gerekli"
      });
    }

    const db = getDB();
    const availableCars = await dbAll(`
      SELECT DISTINCT c.*
      FROM cars c
      WHERE c.id NOT IN (
        SELECT DISTINCT r.car_id
        FROM reservations r
        WHERE r.status IN ('confirmed', 'active')
          AND (
            (r.pickup_date <= ? AND r.dropoff_date >= ?) OR
            (r.pickup_date <= ? AND r.dropoff_date >= ?) OR
            (r.pickup_date >= ? AND r.pickup_date <= ?)
          )
      )
       ORDER BY c.price
    `, [pickupDate, pickupDate, dropDate, dropDate, pickupDate, dropDate]);

    res.status(200).json({
      success: true,
      availableCars: availableCars,
      searchCriteria: {
        pickupDate,
        dropDate,
        totalCarsChecked: await dbGet("SELECT COUNT(*) as total FROM cars")
      }
    });

  } catch (error) {
    console.error("Müsait araç arama hatası:", error);
    res.status(500).json({
      success: false,
      message: "Müsait araçlar getirilemedi",
      error: error.message
    });
  }
});


router.post("/check-availability", async (req, res) => {
  try {
    const { carId, pickupDate, dropDate } = req.body;
    
    if (!carId || !pickupDate || !dropDate) {
      return res.status(400).json({
        success: false,
        message: "Araç ID, alış ve teslim tarihleri gerekli"
      });
    }

    const db = getDB();
    const car = await dbGet("SELECT * FROM cars WHERE id = ?", [carId]);
    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Araç bulunamadı"
      });
    }

    const conflictingReservations = await dbAll(`
      SELECT id, pickup_date, dropoff_date, status, user_email
      FROM reservations 
      WHERE car_id = ? 
        AND status IN ('confirmed', 'active')
        AND (
          (pickup_date <= ? AND dropoff_date >= ?) OR
          (pickup_date <= ? AND dropoff_date >= ?) OR
          (pickup_date >= ? AND pickup_date <= ?)
        )
    `, [carId, pickupDate, pickupDate, dropDate, dropDate, pickupDate, dropDate]);

    const isAvailable = conflictingReservations.length === 0;

    res.status(200).json({
      success: true,
      car: car,
      available: isAvailable,
      conflictingReservations: conflictingReservations,
      searchCriteria: {
        carId,
        pickupDate,
        dropDate
      }
    });

  } catch (error) {
    console.error("Araç müsaitlik kontrol hatası:", error);
    res.status(500).json({
      success: false,
      message: "Araç müsaitlik durumu kontrol edilemedi",
      error: error.message
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDB();
    const car = await dbGet("SELECT * FROM cars WHERE id = ?", [id]);
    
    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Araç bulunamadı"
      });
    }

    const upcomingReservations = await dbAll(`
      SELECT pickup_date, dropoff_date, status 
      FROM reservations 
      WHERE car_id = ? 
        AND status IN ('confirmed', 'active')
        AND pickup_date >= date('now')
      ORDER BY pickup_date
    `, [id]);

    res.status(200).json({
      success: true,
      car: car,
      upcomingReservations: upcomingReservations
    });

  } catch (error) {
    console.error("Araç detay getirme hatası:", error);
    res.status(500).json({
      success: false,
      message: "Araç detayları getirilemedi",
      error: error.message
    });
  }
});

export default router;
