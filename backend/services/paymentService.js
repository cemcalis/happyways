import jwt from 'jsonwebtoken';
import { getDB } from '../database/db.js';
import checkCarAvailability from '../api/Payment/availability.js';
import { sendReservationEmail } from '../api/Payment/emailService.js';
import logger from '../utils/logger.js';

function normalizeName(data) {
  try {
    let { firstName, lastName, name, fullName } = data || {};
    if ((!firstName || !lastName) && (name || fullName)) {
      const raw = String(name || fullName).trim().replace(/\s+/g, ' ');
      if (raw.length > 0) {
        const parts = raw.split(' ');
        if (parts.length === 1) {
          firstName = parts[0];
          lastName = parts[0];
        } else {
          firstName = parts[0];
          lastName = parts.slice(1).join(' ');
        }
        data.firstName = firstName;
        data.lastName = lastName;
      }
    }
  } catch (e) {
    logger.error(e);
  }
}

export const handlePayment = async (body, headers) => {
  logger.info('/api/payment -> isteği alındı');
  normalizeName(body);

  const {
    firstName,
    lastName,
    cardNo,
    expiryMonth,
    expiryYear,
    cvv,
    carInfo,
    userEmail,
    secure,
    emailChecked,
    smsChecked,
    carId: carIdParam,
    car_id: carIdSnake,
    pickupDate,
    dropDate,
    pickupTime,
    dropTime,
    pickup_date,
    dropoff_date,
    pickup_time,
    dropoff_time,
  } = body;

  const carId = carIdParam ?? carIdSnake;
  logger.info('/api/payment -> carId belirlendi ' + carId);

  const resolvedPickupDate = pickupDate ?? pickup_date ?? carInfo?.pickupDate ?? carInfo?.pickup_date ?? '';
  const resolvedDropDate = dropDate ?? dropoff_date ?? carInfo?.dropDate ?? carInfo?.dropoff_date ?? '';
  const resolvedPickupTime = pickupTime ?? pickup_time ?? carInfo?.pickupTime ?? carInfo?.pickup_time ?? '00:00';
  const resolvedDropTime = dropTime ?? dropoff_time ?? carInfo?.dropTime ?? carInfo?.dropoff_time ?? '00:00';

  if (!firstName || !lastName) {
    throw { status: 400, message: 'İsim bilgisi eksik' };
  }
  if (!cardNo || !expiryMonth || !expiryYear || !cvv) {
    throw { status: 400, message: 'Kart bilgileri eksik' };
  }
  if (!carInfo || typeof carInfo !== 'object') {
    throw { status: 400, message: 'Rezervasyon bilgisi (carInfo) eksik' };
  }
  if (!carId) {
    throw { status: 400, message: 'Araç ID gerekli' };
  }

  const priceNum = Number(
    carInfo.price ??
    carInfo.total ??
    carInfo.subtotal ??
    carInfo.basePrice ??
    carInfo.dailyPrice
  );
  if (!Number.isFinite(priceNum) || priceNum <= 0) {
    throw { status: 400, message: 'Geçersiz fiyat bilgisi' };
  }

  const token = headers.authorization?.replace('Bearer ', '');
  if (!token) {
    throw { status: 401, message: 'Token gerekli' };
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user_id = decoded.id;

  const db = getDB();
  const user = await db.get('SELECT * FROM users WHERE id = ?', [user_id]);
  if (!user) {
    throw { status: 404, message: 'Kullanıcı bulunamadı' };
  }

  const availability = await checkCarAvailability(carId, resolvedPickupDate, resolvedDropDate);
  if (!availability.available) {
    throw {
      status: 400,
      message: 'Seçilen tarihlerde araç uygun değil',
      details: availability.reason,
    };
  }

  const payment_success = true;
  if (!payment_success) {
    throw { status: 400, message: 'Ödeme başarısız' };
  }

  const uniqueId = Date.now();
  const payment_id = `PAY_${uniqueId}_${Math.random().toString(36).substr(2, 9)}`;
  const reservation_id = uniqueId;
  const currentTimestamp = new Date().toISOString();

  await db.run(
    `INSERT INTO reservations (
        id, user_id, car_id, pickup_location, dropoff_location, pickup_date, dropoff_date,
        pickup_time, dropoff_time, total_price, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      reservation_id,
      user_id,
      carId,
      carInfo?.pickup_location || carInfo?.pickup || '',
      carInfo?.dropoff_location || carInfo?.dropoff || '',
      resolvedPickupDate,
      resolvedDropDate,
      resolvedPickupTime,
      resolvedDropTime,
      priceNum,
      'confirmed',
      currentTimestamp,
      currentTimestamp,
    ]
  );

  sendReservationEmail({
    to: userEmail || user.email,
    reservationId: reservation_id,
    userName: `${firstName} ${lastName}`,
    carModel: carInfo?.model || '',
    pickup: carInfo?.pickup || '',
    dropoff: carInfo?.dropoff || '',
    pickupDate: resolvedPickupDate,
    dropDate: resolvedDropDate,
    total: priceNum,
  }).catch((err) => logger.error('Email gönderim hatası: ' + err));

  return {
    success: true,
    message: 'Kayıt başarılı',
    reservation_id,
    payment_id,
  };
};

export const fetchPaymentStatus = async (id, headers) => {
  const token = headers.authorization?.replace('Bearer ', '');
  if (!token) throw { status: 401, message: 'Token gerekli' };
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user_id = decoded.id;
  const db = getDB();

  const reservation = await db.get(
    `SELECT r.*, c.model, c.year, u.name as user_full_name
       FROM reservations r
       LEFT JOIN cars c ON r.car_id = c.id
       LEFT JOIN users u ON r.user_id = u.id
       WHERE r.id = ? AND r.user_id = ?`,
    [id, user_id]
  );

  if (!reservation) throw { status: 404, message: 'Rezervasyon bulunamadı' };

  return {
    success: true,
    reservation: {
      reservation_id: reservation.id,
      car_model: reservation.model,
      car_year: reservation.year,
      user_name: reservation.user_full_name,
      pickup_location: reservation.pickup_location,
      dropoff_location: reservation.dropoff_location,
      pickup_date: reservation.pickup_date,
      dropoff_date: reservation.dropoff_date,
      payment_status: reservation.payment_status || 'unknown',
      total_amount: reservation.total_price,
      created_at: reservation.created_at,
    },
  };
};