import { getDB } from "../../../database/db.js";

export async function userReservations(req, res) {
  try {
    const { userEmail } = req.body;

    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: "Email adresi gerekli"
      });
    }

    const db = getDB();

    const reservations = await db.all(`
      SELECT
        r.*,
        c.model as car_model,
        c.year as car_year,
        c.price_per_day as car_price_per_day,
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
}

