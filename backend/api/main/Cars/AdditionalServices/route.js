import express from 'express';

const router = express.Router();

router.post('/calculate', async (req, res) => {
  try {
    const { 
      basePrice, 
      totalDays, 
      extraDriver, 
      insurance,
      carId 
    } = req.body;

    if (!basePrice || !totalDays) {
      return res.status(400).json({
        success: false,
        message: 'Base price ve total days gerekli'
      });
    }

    const extraDriverPrice = 297.00; 
    const insuranceRate = 0.1;

    const extraDriverTotal = extraDriver ? extraDriverPrice : 0;
    const insuranceTotal = insurance ? (basePrice * insuranceRate) : 0;
    const finalPrice = basePrice + extraDriverTotal + insuranceTotal;

    const priceBreakdown = {
      basePrice,
      totalDays,
      extraDriver: {
        selected: extraDriver,
        price: extraDriverTotal
      },
      insurance: {
        selected: insurance,
        rate: insuranceRate,
        price: insuranceTotal
      },
      finalPrice
    };

    res.json({
      success: true,
      data: priceBreakdown,
      message: 'Fiyat hesaplaması başarılı'
    });

  } catch (error) {
    console.error('Additional services calculation error:', error);
    res.status(500).json({
      success: false,
      message: 'Fiyat hesaplaması sırasında hata oluştu'
    });
  }
});

router.get('/prices', async (req, res) => {
  try {
    const additionalServicePrices = {
      extraDriver: {
        price: 297.00,
        description: 'Ek sürücü hizmeti',
        unit: 'per booking'
      },
      insurance: {
        rate: 0.1,
        description: 'Tam kasko sigorta',
        unit: 'percentage of base price'
      }
    };

    res.json({
      success: true,
      data: additionalServicePrices,
      message: 'Ek hizmet fiyatları başarıyla getirildi'
    });

  } catch (error) {
    console.error('Get additional service prices error:', error);
    res.status(500).json({
      success: false,
      message: 'Ek hizmet fiyatları getirilirken hata oluştu'
    });
  }
});

router.post('/validate', async (req, res) => {
  try {
    const { 
      extraDriver, 
      insurance, 
      carId, 
      pickupDate, 
      dropDate 
    } = req.body;

    const validationErrors = [];

    if (pickupDate && dropDate) {
      const pickup = new Date(pickupDate);
      const drop = new Date(dropDate);
      
      if (pickup >= drop) {
        validationErrors.push('Dönüş tarihi alış tarihinden sonra olmalıdır');
      }
    }

    if (!carId) {
      validationErrors.push('Araç seçimi gerekli');
    }

    if (extraDriver) {

    }

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validasyon hatası',
        errors: validationErrors
      });
    }

    res.json({
      success: true,
      message: 'Ek hizmet seçimleri geçerli',
      data: {
        extraDriver,
        insurance,
        carId
      }
    });

  } catch (error) {
    console.error('Additional services validation error:', error);
    res.status(500).json({
      success: false,
      message: 'Validasyon sırasında hata oluştu'
    });
  }
});

export default router;
