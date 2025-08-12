import express from "express";
import { getDB } from "../../database/db.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const router = express.Router();

// Email konfigürasyonu (Test amaçlı - gerçek email servisi olmadan)
const transporter = {
  sendMail: async (mailOptions) => {
    // Test amaçlı - console'a yazdır
    console.log('\n🔔 EMAIL GÖNDERİLDİ:');
    console.log('📧 To:', mailOptions.to);
    console.log('📝 Subject:', mailOptions.subject);
    console.log('📄 HTML Content Preview:');
    console.log(mailOptions.html.substring(0, 200) + '...');
    console.log('✅ Email başarıyla gönderildi (simüle edildi)\n');
    
    return { success: true };
  }
};

// Rezervasyon onay emaili gönderme fonksiyonu
async function sendReservationEmail(userEmail, reservationData) {
  const mailOptions = {
    from: 'happyways.rental@gmail.com',
    to: userEmail,
    subject: 'HappyWays - Rezervasyon Onayı',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2196F3;">🚗 Rezervasyonunuz Onaylandı!</h2>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Rezervasyon Detayları</h3>
          <p><strong>Rezervasyon ID:</strong> ${reservationData.reservation_id}</p>
          <p><strong>Araç:</strong> ${reservationData.carModel}</p>
          <p><strong>Alış Tarihi:</strong> ${reservationData.pickupDate} ${reservationData.pickupTime}</p>
          <p><strong>Teslim Tarihi:</strong> ${reservationData.dropDate} ${reservationData.dropTime}</p>
          <p><strong>Alış Yeri:</strong> ${reservationData.pickup}</p>
          <p><strong>Teslim Yeri:</strong> ${reservationData.drop}</p>
        </div>

        <div style="background-color: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Ödeme Bilgileri</h3>
          <p><strong>Toplam Tutar:</strong> ${reservationData.totalPrice} TL</p>
          <p><strong>Ödeme Durumu:</strong>  Onaylandı</p>
          ${reservationData.extraDriver ? '<p><strong>Ek Sürücü:</strong> ✅ Dahil</p>' : ''}
          ${reservationData.insurance ? '<p><strong>Sigorta:</strong> ✅ Dahil</p>' : ''}
        </div>

        <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h4> Önemli Bilgiler:</h4>
          <ul>
            <li>Araç teslim alırken geçerli ehliyet ve kimlik belgenizi yanınızda bulundurun</li>
            <li>Teslim alma saatinize lütfen 15 dakika öncesinden gelin</li>
            <li>Herhangi bir sorunuz için +90 555 123 45 67 numarasından bize ulaşabilirsiniz</li>
          </ul>
        </div>

        <p style="text-align: center; color: #666;">
          İyi yolculuklar dileriz! 🛣️<br>
          <strong>HappyWays Ekibi</strong>
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email başarıyla gönderildi:', userEmail);
    return true;
  } catch (error) {
    console.error('Email gönderim hatası:', error);
    return false;
  }
}

router.post("/", async (req, res) => {
  try {
    const { 
      name,
      cardNo,
      expiryMonth,
      expiryYear,
      cvv,
      carInfo,
      userEmail,
      secure,
      emailChecked,
      smsChecked,
      // Rezervasyon bilgileri
      carId,
      carModel,
      carPrice,
      pickupDate,
      dropDate,
      pickupTime,
      dropTime,
      pickup,
      drop,
      extraDriver,
      extraDriverPrice,
      insurance,
      insurancePrice,
      totalPrice,
      calculatedBasePrice
    } = req.body;

    // Token kontrolü
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: "Token gerekli" 
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ 
        success: false,
        message: "Geçersiz token" 
      });
    }

    const user_id = decoded.id;

    // Basit email validasyonu
    if (!userEmail || !userEmail.includes('@')) {
      return res.status(400).json({ 
        success: false,
        message: "Geçerli email adresi gerekli" 
      });
    }

    const db = getDB();

    // Kullanıcının varlığını kontrol et
    const user = await db.get("SELECT * FROM users WHERE id = ?", [user_id]);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "Kullanıcı bulunamadı" 
      });
    }

   
    const availability = await checkCarAvailability(carId, pickupDate, dropDate);
    
    if (!availability.available) {
      return res.status(409).json({
        success: false,
        message: "Seçilen tarihler için araç müsait değil",
        conflictingReservations: availability.conflictingReservations || []
      });
    }


  const payment_success = true; 

    if (payment_success) {
    
      const payment_id = `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const reservation_id = `RES_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const currentTimestamp = new Date().toISOString();

 
      await db.run(
        `INSERT INTO reservations (
          id, user_id, car_id, pickup_location, dropoff_location, 
          pickup_date, dropoff_date, pickup_time, dropoff_time, 
          total_price, status, created_at, user_email,
          extra_driver, extra_driver_price, insurance, insurance_price
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          Date.now(), // id: integer, benzersiz
          Number(user_id), // user_id: integer
          Number(carId), // car_id: integer
          String(pickup), // pickup_location: text
          String(drop), // dropoff_location: text
          String(pickupDate), // pickup_date: text
          String(dropDate), // dropoff_date: text
          String(pickupTime), // pickup_time: text
          String(dropTime), // dropoff_time: text
          String(totalPrice), // total_price: text
          'confirmed', // status: text
          currentTimestamp, // created_at: datetime
          String(userEmail), // user_email: text
          extraDriver ? 1 : 0, // extra_driver: integer
          Number(extraDriverPrice) || 0, // extra_driver_price: integer
          insurance ? 1 : 0, // insurance: integer
          Number(insurancePrice) || 0 // insurance_price: integer
        ]
      );

    
      const car = await db.get("SELECT * FROM cars WHERE id = ?", [carId]);

 
      const emailSent = await sendReservationEmail(userEmail, {
        reservation_id,
        carModel: car ? `${car.model} ${car.year}` : carModel,
        pickupDate,
        dropDate,
        pickupTime,
        dropTime,
        pickup,
        drop,
        totalPrice,
        extraDriver,
        insurance
      });

     
      if (emailSent) {
        console.log(` Rezervasyon emaili gönderildi: ${userEmail}`);
      } else {
        console.log(` Email gönderilemedi: ${userEmail}`);
      }

      const updatedReservation = await db.get(`
        SELECT 
          r.*,
          c.model as car_model,
          c.year as car_year
        FROM reservations r
        LEFT JOIN cars c ON r.car_id = c.id
        WHERE r.id = ?
      `, [reservation_id]);

      res.status(200).json({ 
        success: true,
        message: "Ödeme başarılı, rezervasyonunuz onaylandı",
        payment_id: payment_id,
        reservation_id: reservation_id,
        reservation_summary: {
          user: updatedReservation.user_email || userEmail,
          car: `${updatedReservation.car_model} ${updatedReservation.car_year}`,
          period: `${updatedReservation.pickup_date} ${updatedReservation.pickup_time} - ${updatedReservation.dropoff_date} ${updatedReservation.dropoff_time}`,
          locations: `${updatedReservation.pickup_location} → ${updatedReservation.dropoff_location}`,
          total_paid: updatedReservation.total_price,
          payment_date: currentTimestamp,
          status: 'confirmed'
        }
      });
    } else {
      res.status(400).json({ 
        success: false,
        message: "Ödeme işlemi başarısız, lütfen tekrar deneyin"
      });
    }

  } catch (error) {
    console.error("Ödeme işlemi hatası:", error);
    res.status(500).json({ 
      success: false,
      message: "Ödeme işleminde hata oluştu", 
      error: error.message 
    });
  }
});

router.get("/history", async (req, res) => {
  try {

    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: "Token gerekli" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = decoded.id;

    const db = getDB();

    const payments = await db.all(`
      SELECT 
        r.*,
        c.model,
        c.year,
        c.image
      FROM reservations r
      JOIN cars c ON r.car_id = c.id
      WHERE r.user_id = ? AND r.status = 'confirmed'
      ORDER BY r.created_at DESC
    `, [user_id]);

    const updatedPayments = payments.map(payment => ({
      ...payment,
      image: `http://10.0.2.2:3000/${payment.image}`,
      payment_id: `PAY_${payment.id}_${payment.created_at}`
    }));

    res.status(200).json({ 
      payments: updatedPayments,
      total_count: updatedPayments.length
    });

  } catch (error) {
    console.error("Ödeme geçmişi alınamadı:", error);
    res.status(500).json({ 
      message: "Ödeme geçmişi alınamadı", 
      error: error.message 
    });
  }
});

router.get("/status/:reservation_id", async (req, res) => {
  try {
    const { reservation_id } = req.params;

    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: "Token gerekli" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = decoded.id;

    const db = getDB();

    const reservation = await db.get(
      `SELECT 
         r.*,
         c.model,
         c.year
       FROM reservations r
       JOIN cars c ON r.car_id = c.id
       WHERE r.id = ? AND r.user_id = ?`, 
      [reservation_id, user_id]
    );

    if (!reservation) {
      return res.status(404).json({ message: "Rezervasyon bulunamadı" });
    }

    const payment_status = reservation.status === 'confirmed' ? 'paid' : 'pending';

    res.status(200).json({
      reservation_id: reservation.id,
      payment_status: payment_status,
      car_info: `${reservation.model} ${reservation.year}`,
      total_amount: reservation.total_price,
      created_at: reservation.created_at
    });

  } catch (error) {
    console.error("Ödeme durumu kontrol hatası:", error);
    res.status(500).json({ 
      message: "Ödeme durumu kontrol edilemedi", 
      error: error.message 
    });
  }
});

// Araç müsaitlik kontrolü
async function checkCarAvailability(carId, pickupDate, dropDate) {
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
      conflictingReservations: conflictingReservations
    };
  } catch (error) {
    console.error('Araç müsaitlik kontrolü hatası:', error);
    return { available: false, error: error.message };
  }
}

export default router;
