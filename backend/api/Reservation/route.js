import express from "express";
import { getDB } from "../../database/db.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { 
      car_id, 
      pickup_location, 
      dropoff_location, 
      pickup_location_id,
      dropoff_location_id,
      pickup_date, 
      dropoff_date,
      pickup_time,
      dropoff_time,
      total_price 
    } = req.body;

    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: "Token gerekli" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = decoded.id;

    if (!car_id || (!pickup_location && !pickup_location_id) || !pickup_date || !dropoff_date || !pickup_time || !dropoff_time) {
      return res.status(400).json({ message: "Tüm gerekli alanlar doldurulmalıdır" });
    }

    const db = getDB();

    const user = await db.get("SELECT * FROM users WHERE id = ?", [user_id]);
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    const car = await db.get("SELECT * FROM cars WHERE id = ?", [car_id]);
    if (!car) {
      return res.status(404).json({ message: "Araç bulunamadı" });
    }

    let finalPickupLocation = pickup_location;
    let finalDropoffLocation = dropoff_location;

    if (pickup_location_id) {
      const pickupLoc = await db.get("SELECT name FROM locations WHERE id = ?", [pickup_location_id]);
      if (pickupLoc) {
        finalPickupLocation = pickupLoc.name;
      }
    }

    if (dropoff_location_id) {
      const dropoffLoc = await db.get("SELECT name FROM locations WHERE id = ?", [dropoff_location_id]);
      if (dropoffLoc) {
        finalDropoffLocation = dropoffLoc.name;
      }
    }
    const pickup_datetime = `${pickup_date} ${pickup_time}`;
    const dropoff_datetime = `${dropoff_date} ${dropoff_time}`;

    const conflictingReservation = await db.get(`
      SELECT id FROM reservations 
      WHERE car_id = ? 
      AND status != 'cancelled'
      AND (
        (pickup_datetime <= ? AND dropoff_datetime >= ?) OR
        (pickup_datetime <= ? AND dropoff_datetime >= ?) OR
        (pickup_datetime >= ? AND dropoff_datetime <= ?)
      )
    `, [
      car_id,
      pickup_datetime, pickup_datetime,  
      dropoff_datetime, dropoff_datetime, 
      pickup_datetime, dropoff_datetime  
    ]);

    if (conflictingReservation) {
      return res.status(409).json({ 
        message: "Bu araç seçilen tarih aralığında zaten rezerve edilmiş" 
      });
    }
    const currentTimestamp = new Date().toISOString();
    
    const result = await db.run(
      `INSERT INTO reservations 
       (user_id, car_id, 
        pickup_location, dropoff_location,
        pickup_location_id, dropoff_location_id, 
        pickup_date, dropoff_date, 
        pickup_time, dropoff_time,
        pickup_datetime, dropoff_datetime,
        total_price, status, 
        created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id, car_id,
        finalPickupLocation, finalDropoffLocation || finalPickupLocation,
        pickup_location_id, dropoff_location_id || pickup_location_id,
        pickup_date, dropoff_date,
        pickup_time, dropoff_time,
        pickup_datetime, dropoff_datetime,
        total_price, 'pending',
        currentTimestamp
      ]
    );

    const newReservation = await db.get(`
      SELECT 
        r.*,
        u.email as user_email,
        c.model as car_model,
        c.year as car_year,
        c.image as car_image
      FROM reservations r
      JOIN users u ON r.user_id = u.id
      JOIN cars c ON r.car_id = c.id
      WHERE r.id = ?
    `, [result.lastID]);

    res.status(201).json({ 
      success: true,
      message: "Rezervasyon başarıyla oluşturuldu",
      reservation_id: result.lastID,
      reservation_details: {
        id: newReservation.id,
        user: {
          id: newReservation.user_id,
          email: newReservation.user_email
        },
        car: {
          id: newReservation.car_id,
          model: newReservation.car_model,
          year: newReservation.car_year,
          image: newReservation.car_image ? `http://10.0.2.2:3000/assets/cars/${newReservation.car_image}` : null
        },
        rental_period: {
          pickup: {
            location: newReservation.pickup_location,
            date: newReservation.pickup_date,
            time: newReservation.pickup_time,
            datetime: newReservation.pickup_datetime
          },
          dropoff: {
            location: newReservation.dropoff_location,
            date: newReservation.dropoff_date,
            time: newReservation.dropoff_time,
            datetime: newReservation.dropoff_datetime
          }
        },
        pricing: {
          total_price: newReservation.total_price,
          currency: 'TL'
        },
        status: newReservation.status,
        created_at: newReservation.created_at
      }
    });

  } catch (error) {
    console.error("Rezervasyon oluşturma hatası:", error);
    res.status(500).json({ 
      success: false,
      message: "Rezervasyon oluşturulamadı", 
      error: error.message 
    });
  }
});

router.get("/", async (req, res) => {
  try {
    // Token kontrolü
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: "Token gerekli" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = decoded.id;

    const db = getDB();
    
    const reservations = await db.all(`
      SELECT 
        r.*,
        c.model,
        c.year,
        c.image,
        c.gear,
        c.fuel,
        c.seats
      FROM reservations r
      JOIN cars c ON r.car_id = c.id
      WHERE r.user_id = ?
      ORDER BY r.created_at DESC
    `, [user_id]);

    const updatedReservations = reservations.map(reservation => ({
      ...reservation,
      image: `http://10.0.2.2:3000/${reservation.image}`
    }));

    res.status(200).json({ reservations: updatedReservations });

  } catch (error) {
    console.error("Rezervasyonlar alınamadı:", error);
    res.status(500).json({ message: "Rezervasyonlar alınamadı", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
 
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: "Token gerekli" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = decoded.id;

    const db = getDB();

    const reservation = await db.get("SELECT * FROM reservations WHERE id = ? AND user_id = ?", [id, user_id]);
    if (!reservation) {
      return res.status(404).json({ message: "Rezervasyon bulunamadı" });
    }
    await db.run("UPDATE reservations SET status = 'cancelled' WHERE id = ?", [id]);

    res.status(200).json({ message: "Rezervasyon başarıyla iptal edildi" });

  } catch (error) {
    console.error("Rezervasyon iptal hatası:", error);
    res.status(500).json({ message: "Rezervasyon iptal edilemedi", error: error.message });
  }
});

export default router;
