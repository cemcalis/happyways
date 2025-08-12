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

    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: "Token gerekli" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = decoded.id;

    const db = getDB();
  
    const user = await db.get("SELECT * FROM users WHERE id = ?", [user_id]);
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }
    
    const reservations = await db.all(`
      SELECT 
        r.*,
        c.model,
        c.year,
        c.image,
        c.gear,
        c.fuel,
        c.seats,
        c.price
      FROM reservations r
      JOIN cars c ON r.car_id = c.id
      WHERE r.user_id = ?
      ORDER BY r.pickup_date DESC, r.pickup_time DESC
    `, [user_id]);

    const currentDate = new Date();
    const currentDateString = currentDate.toISOString().split('T')[0]; 
    const currentTimeString = currentDate.toTimeString().split(' ')[0].slice(0, 5); 

  
    const categorizedReservations = {
      active: [], 
      upcoming: [], 
      completed: [], 
      cancelled: [] 
    };

    reservations.forEach(reservation => {
      const updatedReservation = {
        ...reservation,
        image: reservation.image ? `http://10.0.2.2:3000/${reservation.image}` : null,
       
        duration: calculateDuration(reservation.pickup_date, reservation.pickup_time, reservation.dropoff_date, reservation.dropoff_time),
      
        status_info: getStatusInfo(reservation, currentDateString, currentTimeString)
      };

     
      if (reservation.status === 'cancelled') {
        categorizedReservations.cancelled.push(updatedReservation);
      }
      else if (reservation.dropoff_date < currentDateString || 
               (reservation.dropoff_date === currentDateString && reservation.dropoff_time <= currentTimeString)) {
        categorizedReservations.completed.push(updatedReservation);
      }
      else if (reservation.pickup_date > currentDateString || 
               (reservation.pickup_date === currentDateString && reservation.pickup_time > currentTimeString)) {
        categorizedReservations.upcoming.push(updatedReservation);
      }
      else {
        categorizedReservations.active.push(updatedReservation);
      }
    });

    const stats = {
      total: reservations.length,
      active: categorizedReservations.active.length,
      upcoming: categorizedReservations.upcoming.length,
      completed: categorizedReservations.completed.length,
      cancelled: categorizedReservations.cancelled.length,
      user_info: {
        name: user.name,
        email: user.email,
        total_reservations: reservations.length
      }
    };

    res.status(200).json({ 
      success: true,
      reservations: categorizedReservations,
      stats,
      message: `${reservations.length} rezervasyon bulundu`
    });

  } catch (error) {
    console.error("Rezervasyonlar alınamadı:", error);
    res.status(500).json({ 
      success: false,
      message: "Rezervasyonlar alınamadı", 
      error: error.message 
    });
  }
});

function calculateDuration(pickupDate, pickupTime, dropoffDate, dropoffTime) {
  const startDateTime = new Date(`${pickupDate}T${pickupTime}:00`);
  const endDateTime = new Date(`${dropoffDate}T${dropoffTime}:00`);
  
  const diffTime = Math.abs(endDateTime - startDateTime);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
  
  if (diffDays >= 1) {
    return `${diffDays} gün`;
  } else {
    return `${diffHours} saat`;
  }
}

function getStatusInfo(reservation, currentDate, currentTime) {
  const pickupDateTime = new Date(`${reservation.pickup_date}T${reservation.pickup_time}:00`);
  const dropoffDateTime = new Date(`${reservation.dropoff_date}T${reservation.dropoff_time}:00`);
  const currentDateTime = new Date(`${currentDate}T${currentTime}:00`);
  
  if (reservation.status === 'cancelled') {
    return {
      status: 'cancelled',
      message: 'İptal edildi',
      color: '#FF6B6B',
      icon: 'cancel'
    };
  }
  
  if (currentDateTime < pickupDateTime) {
    const timeDiff = pickupDateTime - currentDateTime;
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    return {
      status: 'upcoming',
      message: daysDiff === 1 ? 'Yarın başlıyor' : `${daysDiff} gün sonra`,
      color: '#4ECDC4',
      icon: 'schedule'
    };
  }
  
  if (currentDateTime >= pickupDateTime && currentDateTime <= dropoffDateTime) {
    return {
      status: 'active',
      message: 'Devam ediyor',
      color: '#45B7D1',
      icon: 'directions_car'
    };
  }
  
  return {
    status: 'completed',
    message: 'Tamamlandı',
    color: '#96CEB4',
    icon: 'check_circle'
  };
}

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

// Kullanıcının tüm rezervasyonlarını getir
router.post("/my-reservations", async (req, res) => {
  try {
    const { userEmail } = req.body;

    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: "Email adresi gerekli"
      });
    }

    const db = getDB();

    // Kullanıcının tüm rezervasyonlarını getir
    const reservations = await db.all(`
      SELECT 
        r.*,
        c.model as car_model,
        c.year as car_year,
        c.price_per_day as car_price_per_day
      FROM reservations r
      LEFT JOIN cars c ON r.car_id = c.id
      WHERE r.user_email = ?
      ORDER BY r.created_at DESC
    `, [userEmail]);

    res.status(200).json({
      success: true,
      reservations: reservations,
      total: reservations.length
    });

  } catch (error) {
    console.error("Rezervasyon listeleme hatası:", error);
    res.status(500).json({
      success: false,
      message: "Rezervasyonlar getirilemedi",
      error: error.message
    });
  }
});

// Kullanıcının rezervasyonlarını getir
router.post("/my-reservations", async (req, res) => {
  try {
    const { userEmail } = req.body;

    if (!userEmail) {
      return res.status(400).json({ 
        success: false,
        message: "Email adresi gerekli" 
      });
    }

    const db = getDB();

    // Kullanıcının tüm rezervasyonlarını getir
    const reservations = await db.all(`
      SELECT 
        r.*,
        c.model as car_model,
        c.year as car_year,
        c.image as car_image
      FROM reservations r
      LEFT JOIN cars c ON r.car_id = c.id
      WHERE r.user_email = ?
      ORDER BY r.created_at DESC
    `, [userEmail]);

    res.status(200).json({
      success: true,
      reservations: reservations,
      total: reservations.length
    });

  } catch (error) {
    console.error("Rezervasyon listesi getirme hatası:", error);
    res.status(500).json({
      success: false,
      message: "Rezervasyonlar getirilemedi",
      error: error.message
    });
  }
});

export default router;
