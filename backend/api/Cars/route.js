import express from "express";
import { getDB } from "../../database/db.js";
import { handleError } from "../../utils/errorHandler.js";

const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const db = getDB();
    const cars = await db.all("SELECT * FROM cars ORDER BY model");
    
    res.status(200).json({
      success: true,
      cars: cars
    });
  } catch (error) {
    return handleError(res, error, 500, "Araçlar getirilemedi");
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
    
    const availableCars = await db.all(`
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
        totalCarsChecked: await db.get("SELECT COUNT(*) as total FROM cars")
      }
    });

  } catch (error) {
    return handleError(res, error, 500, "Müsait araçlar getirilemedi");
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
    
    const car = await db.get("SELECT * FROM cars WHERE id = ?", [carId]);
    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Araç bulunamadı"
      });
    }


    const conflictingReservations = await db.all(`
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
    return handleError(res, error, 500, "Araç müsaitlik durumu kontrol edilemedi");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDB();
    
    const car = await db.get("SELECT * FROM cars WHERE id = ?", [id]);
    
    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Araç bulunamadı"
      });
    }

    const upcomingReservations = await db.all(`
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
    return handleError(res, error, 500, "Araç detayları getirilemedi");
  }
});

export default router;