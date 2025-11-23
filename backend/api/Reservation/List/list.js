import { getDB } from "../../../database/db.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { calculateDuration, getStatusInfo } from "../Helpers/helpers.js";
import { JWT_SECRET } from "../../../utils/tokenUtils.js";

dotenv.config();

const decodeUserId = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.id;
  } catch (error) {
    return null;
  }
};

export async function listReservations(req, res) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: "Token gerekli" });
    }

    const user_id = decodeUserId(token);
    if (!user_id) {
      return res.status(401).json({ message: "Token doğrulanamadı" });
    }

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

    const name = user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email;

    const stats = {
      total: reservations.length,
      active: categorizedReservations.active.length,
      upcoming: categorizedReservations.upcoming.length,
      completed: categorizedReservations.completed.length,
      cancelled: categorizedReservations.cancelled.length,
      user_info: {
        name,
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
}
