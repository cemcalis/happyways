import express from "express";
import jwt from "jsonwebtoken";
import { getDB } from "../../../database/db.js";
import { JWT_SECRET } from "../../../utils/tokenUtils.js";

const router = express.Router();


function validateCardNumber(cardNumber) {
  const number = cardNumber.replace(/\D/g, '');
  let sum = 0;
  let isEven = false;
  
  for (let i = number.length - 1; i >= 0; i--) {
    let digit = parseInt(number[i]);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return (sum % 10) === 0;
}

function detectCardType(cardNumber) {
  const number = cardNumber.replace(/\D/g, '');

  if (/^4/.test(number)) {
    return 'Visa';
  } else if (/^(5[1-5]|2[2-7])/.test(number)) {
    return 'MasterCard';
  } else if (/^3[47]/.test(number)) {
    return 'American Express';
  } else if (/^6(?:011|5)/.test(number)) {
    return 'Discover';
  } else if (/^(?:2131|1800|35)/.test(number)) {
    return 'JCB';
  } else if (/^3(?:0[0-5]|[68])/.test(number)) {
    return 'Diners Club';
  } else {
    return 'Unknown';
  }
}

function validateCvv(cvv, cardType) {
  const cvvStr = String(cvv || '').replace(/\D/g, '');
  
  if (cardType === 'American Express') {
    return /^\d{4}$/.test(cvvStr);
  } else {
    return /^\d{3}$/.test(cvvStr);
  }
}

function validateExpiry(month, year) {
  const m = parseInt(month, 10);
  let y = parseInt(year, 10);
  
  if (y < 100) {
    const currentYear = new Date().getFullYear();
    const century = Math.floor(currentYear / 100) * 100;
    y += century;
    if (y < currentYear) y += 100;
  }
  
  if (isNaN(m) || isNaN(y) || m < 1 || m > 12) return false;
  
  const now = new Date();
  const expiryDate = new Date(y, m - 1, 1);
  expiryDate.setMonth(expiryDate.getMonth() + 1);
  
  return expiryDate > now;
}

function sanitizeName(name) {
  if (typeof name !== 'string') return '';
  const trimmed = name.trim();
  if (!trimmed) return '';
  return trimmed.replace(/[^a-zA-ZığüşöçİĞÜŞÖÇ\s.-]/g, '');
}

function validateEmail(email) {
  if (typeof email !== 'string') return false;
  const trimmed = email.trim();
  if (!trimmed) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(trimmed);
}

function detectRiskFactors(request) {
  const riskFactors = [];
  const ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
  
  if (!ip || ip === '::1' || ip.startsWith('127.')) {
    riskFactors.push('LOCAL_IP');
  }
  
  return riskFactors;
}

router.post("/", async (req, res) => {

  (function normalizeNameOnReq(req){
    try {
      let { firstName, lastName, name, fullName } = req.body || {};
      if ((!firstName || !lastName) && (name || fullName)) {
        const raw = String(name || fullName).trim().replace(/\s+/g, " ");
        if (raw.length > 0) {
          const parts = raw.split(" ");
          if (parts.length === 1) {
            firstName = parts[0];
            lastName = parts[0]; 
          } else {
            firstName = parts[0];
            lastName = parts.slice(1).join(" ");
          }
          req.body.firstName = firstName;
          req.body.lastName  = lastName;
        }
      }
    } catch (_) {}
  })(req);

  try {
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
      smsChecked
    } = req.body;

    const errors = [];
    const warnings = [];
    const riskFactors = detectRiskFactors(req);
    const securityLevel = riskFactors.length > 0 ? "high" : "normal";

    const sanitizedFirstName = sanitizeName(firstName);
    const sanitizedLastName = sanitizeName(lastName);

    if (!sanitizedFirstName || sanitizedFirstName.length < 2) {
      errors.push("Ad en az 2 karakter olmalıdır");
    }
    if (!sanitizedLastName || sanitizedLastName.length < 2) {
      errors.push("Soyad en az 2 karakter olmalıdır");
    }

    if (!cardNo) {
      errors.push("Kart numarası gereklidir");
    } else {
      const digits = cardNo.replace(/\D/g, '');
      if (digits.length < 13 || digits.length > 19) {
        errors.push("Geçersiz kart numarası uzunluğu");
      }
      if (!validateCardNumber(cardNo)) {
        errors.push("Geçersiz kart numarası (Luhn başarısız)");
      }
    }

    if (!expiryMonth || !expiryYear) {
      errors.push("Son kullanma tarihi gereklidir");
    } else {
      const month = parseInt(expiryMonth, 10);
      const year = parseInt(expiryYear, 10);
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;

      if (isNaN(month) || isNaN(year) || month < 1 || month > 12) {
        errors.push("Geçersiz ay (1-12)");
      }
      
      if (year < currentYear || (year === currentYear && month < currentMonth)) {
        errors.push("Kartın son kullanma tarihi geçmiş");
      }
      
      if (year > currentYear + 10) {
        warnings.push("Son kullanma tarihi çok ileride görünüyor");
      }
    }

  
    if (!cvv) {
      errors.push("CVV gereklidir");
    } else {
      const cardType = detectCardType(cardNo);
      if (!validateCvv(cvv, cardType)) {
        errors.push(`CVV formatı geçersiz (${cardType === 'American Express' ? '4 haneli' : '3 haneli'})`);
      }
    }

    if (userEmail && !validateEmail(userEmail)) {
      errors.push("Geçersiz email formatı");
    }

    if (!carInfo || typeof carInfo !== 'object') {
      errors.push("Geçersiz rezervasyon verisi (carInfo)");
    } else {
      if (typeof carInfo.price !== 'number' || carInfo.price <= 0) {
        errors.push("Geçersiz fiyat bilgisi");
      }
      if (!carInfo.model || typeof carInfo.model !== 'string') {
        errors.push("Araç modeli eksik");
      }
    }

    const response = {
      success: errors.length === 0,
      message: errors.length === 0 ? "Form geçerli" : "Form validasyonu başarısız",
      validation: {
        isValid: errors.length === 0,
        errors,
        warnings,
        riskFactors,
        cardInfo: {
          type: detectCardType(cardNo),
          lastFourDigits: cardNo ? cardNo.replace(/\D/g, '').slice(-4) : undefined,
          isValid: errors.length === 0
        },
        securityLevel,
        recommendations: []
      }
    };

    if (warnings.length > 0) {
      response.validation.recommendations.push("Lütfen kart bilgilerini dikkatlice kontrol edin.");
    }

    res.status(response.success ? 200 : 400).json(response);
  } catch (error) {
    console.error("Form validasyon hatası:", error);
    res.status(500).json({
      success: false,
      message: "Validasyon sırasında bir hata oluştu",
      validation: {
        isValid: false,
        errors: [],
        warnings: [],
        riskFactors: []
      }
    });
  }
});
router.get("/history", async (req, res) => {
  try {

    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: "Token gerekli" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ message: "Token doğrulanamadı" });
    }
    const user_id = decoded.id;

    const db = getDB();

    const reservation = await db.get(
      `SELECT
         r.*,
         c.model,
         c.year,
         COALESCE(u.full_name, TRIM(COALESCE(u.first_name,'') || ' ' || COALESCE(u.last_name,''))) AS user_full_name
       FROM reservations r
       LEFT JOIN cars c ON r.car_id = c.id
       LEFT JOIN users u ON r.user_id = u.id
       WHERE r.user_id = ?
       ORDER BY r.created_at DESC`,
      [user_id]
    );

    if (!reservation) {
      return res.status(404).json({ message: "Rezervasyon bulunamadı" });
    }

    res.status(200).json({
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
        created_at: reservation.created_at
      }
    });

  } catch (error) {
    console.error("Ödeme durumu kontrol hatası:", error);
    res.status(500).json({
      message: "Ödeme durumu kontrol edilemedi",
      error: error.message
    });
  }
});

export default router;
