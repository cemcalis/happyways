import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { carPrice, pickupDate, dropDate, discountCode, insuranceOptions } = req.body;

    if (!carPrice) {
      return res.status(400).json({ message: "Araç fiyatı gerekli" });
    }

    const basePrice = Number(carPrice.replace(/[^0-9]/g, "")) || 0;
    
  
    const kdvRate = 0.075;
    const kdv = Math.round(basePrice * kdvRate);
    
  
    let dayDifference = 1;
    if (pickupDate && dropDate) {
      const pickup = new Date(pickupDate);
      const drop = new Date(dropDate);
      dayDifference = Math.max(1, Math.ceil((drop - pickup) / (1000 * 60 * 60 * 24)));
    }

    const dailyPrice = basePrice * dayDifference;
    const dailyKdv = Math.round(dailyPrice * kdvRate);
    

    let discountAmount = 0;
    if (discountCode) {

      switch (discountCode.toUpperCase()) {
        case 'WELCOME10':
          discountAmount = Math.round(dailyPrice * 0.10);
          break;
        case 'SUMMER20':
          discountAmount = Math.round(dailyPrice * 0.20);
          break;
        default:
          discountAmount = 0;
      }
    }
    
 
    let insuranceAmount = 0;
    if (insuranceOptions && insuranceOptions.length > 0) {
      insuranceOptions.forEach(option => {
        switch (option) {
          case 'basic':
            insuranceAmount += dailyPrice * 0.05; 
            break;
          case 'premium':
            insuranceAmount += dailyPrice * 0.10; 
            break;
          case 'full':
            insuranceAmount += dailyPrice * 0.15; 
            break;
        }
      });
      insuranceAmount = Math.round(insuranceAmount);
    }

    const subtotal = dailyPrice - discountAmount + insuranceAmount;
    const totalKdv = Math.round(subtotal * kdvRate);
    const total = subtotal + totalKdv;

    res.json({
      success: true,
      pricing: {
        basePrice,
        dailyPrice,
        dayDifference,
        discountAmount,
        discountCode: discountCode || null,
        insuranceAmount,
        insuranceOptions: insuranceOptions || [],
        kdv: totalKdv,
        subtotal,
        total,
        breakdown: {
          originalPrice: basePrice,
          dailyCalculation: `${basePrice} x ${dayDifference} gün = ${dailyPrice}`,
          discount: discountAmount > 0 ? `-${discountAmount}` : 0,
          insurance: insuranceAmount > 0 ? `+${insuranceAmount}` : 0,
          kdv: `%${(kdvRate * 100).toFixed(1)} KDV = ${totalKdv}`,
          finalTotal: total
        }
      }
    });

  } catch (error) {
    console.error("Fiyat hesaplama hatası:", error);
    res.status(500).json({ 
      success: false, 
      message: "Fiyat hesaplama sırasında bir hata oluştu" 
    });
  }
});

export default router;