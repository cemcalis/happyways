import { getDB } from "../../database/db.js";

export default async function checkCarAvailability(carId, pickupDate, dropDate) {
  const db = getDB();

  try {
    const conflictingReservations = await db.all(`
      SELECT id, pickup_date, dropoff_date, status
      FROM reservations
      WHERE car_id = ?
        AND status IN ('confirmed', 'active')
        AND (
          (pickup_date <= ? AND dropoff_date >= ?) OR
          (pickup_date <= ? AND dropoff_date >= ?) OR
          (pickup_date >= ? AND pickup_date <= ?)
        )
    `, [carId, pickupDate, pickupDate, dropDate, dropDate, pickupDate, dropDate]);

    return {
      available: conflictingReservations.length === 0,
      conflictingReservations
    };
  } catch (error) {
    console.error('Araç müsaitlik kontrolü hatası:', error);
    return { available: false, error: error.message };
  }
}