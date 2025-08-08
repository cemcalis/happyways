import express from "express";

const router = express.Router();

// Kredi kartı validasyonu için Luhn algoritması
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
  
  return sum % 10 === 0;
}

// Kart tipini tespit et
function getCardType(cardNumber) {
  const number = cardNumber.replace(/\D/g, '');
  
  if (/^4/.test(number)) return 'Visa';
  if (/^5[1-5]/.test(number)) return 'MasterCard';
  if (/^3[47]/.test(number)) return 'American Express';
  if (/^6(?:011|5)/.test(number)) return 'Discover';
  
  return 'Unknown';
}

// Ödeme formu validasyonu endpoint'i
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
      smsChecked
    } = req.body;

    const errors = [];
    const warnings = [];

    // İsim validasyonu
    if (!name || name.trim().length < 2) {
      errors.push("Ad Soyad en az 2 karakter olmalıdır");
    } else if (!/^[a-zA-ZğĞıİşŞöÖüÜçÇ\s]+$/.test(name.trim())) {
      errors.push("Ad Soyad sadece harflerden oluşmalıdır");
    }

    // Kart numarası validasyonu
    if (!cardNo || cardNo.trim().length === 0) {
      errors.push("Kart numarası gereklidir");
    } else {
      const cleanCardNo = cardNo.replace(/\D/g, '');
      
      if (cleanCardNo.length < 13 || cleanCardNo.length > 19) {
        errors.push("Kart numarası 13-19 haneli olmalıdır");
      } else if (!validateCardNumber(cleanCardNo)) {
        errors.push("Geçersiz kart numarası");
      } else {
        const cardType = getCardType(cleanCardNo);
        if (cardType === 'Unknown') {
          warnings.push("Kart tipi tespit edilemedi");
        }
      }
    }

    // Son kullanma tarihi validasyonu
    if (!expiryMonth || !expiryYear) {
      errors.push("Son kullanma tarihi gereklidir");
    } else {
      const month = parseInt(expiryMonth);
      const year = parseInt(expiryYear);
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100; // Son 2 hane
      const currentMonth = currentDate.getMonth() + 1;

      if (month < 1 || month > 12) {
        errors.push("Geçersiz ay (1-12)");
      }
      
      if (year < currentYear || (year === currentYear && month < currentMonth)) {
        errors.push("Kartın son kullanma tarihi geçmiş");
      }
      
      if (year > currentYear + 10) {
        warnings.push("Son kullanma tarihi çok ileride görünüyor");
      }
    }

    // CVV validasyonu
    if (!cvv) {
      errors.push("CVV gereklidir");
    } else if (!/^\d{3,4}$/.test(cvv)) {
      errors.push("CVV 3-4 haneli olmalıdır");
    }

    // Email validasyonu
    if (!userEmail) {
      errors.push("Email adresi gereklidir");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
      errors.push("Geçersiz email formatı");
    }

    // Araç bilgileri validasyonu
    if (!carInfo || !carInfo.total || carInfo.total <= 0) {
      errors.push("Geçersiz ödeme tutarı");
    }

    // İletişim tercihi kontrolü
    if (!emailChecked && !smsChecked) {
      warnings.push("Bilgilendirme için en az bir iletişim yöntemi seçmeniz önerilir");
    }

    // Risk analizi
    const riskFactors = [];
    if (!secure) {
      riskFactors.push("3D Secure kullanılmıyor");
    }
    
    if (carInfo && carInfo.total > 10000) {
      riskFactors.push("Yüksek tutar ödeme");
    }

    const validationResult = {
      isValid: errors.length === 0,
      errors,
      warnings,
      riskFactors,
      cardInfo: cardNo ? {
        type: getCardType(cardNo.replace(/\D/g, '')),
        lastFourDigits: cardNo.replace(/\D/g, '').slice(-4),
        isValid: validateCardNumber(cardNo.replace(/\D/g, ''))
      } : null,
      securityLevel: secure ? 'high' : 'medium',
      recommendations: []
    };

    // Öneriler ekle
    if (!secure) {
      validationResult.recommendations.push("Güvenlik için 3D Secure kullanmanız önerilir");
    }
    
    if (riskFactors.length > 0) {
      validationResult.recommendations.push("Ek güvenlik önlemleri alınması önerilir");
    }

    if (validationResult.isValid) {
      res.json({
        success: true,
        message: "Form validasyonu başarılı",
        validation: validationResult
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Form validasyonu başarısız",
        validation: validationResult
      });
    }

  } catch (error) {
    console.error("Form validasyon hatası:", error);
    res.status(500).json({ 
      success: false, 
      message: "Validasyon sırasında bir hata oluştu" 
    });
  }
});

export default router;