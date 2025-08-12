import express from "express";

const router = express.Router();

// Araç filtreleme endpoint'i - frontend'deki filter logic'ini burada yap
router.post("/", async (req, res) => {
  try {
    const { 
      cars, 
      searchText, 
      fuelTypes, 
      gearTypes, 
      priceRange, 
      yearRange,
      seatCount,
      hasAC,
      sortBy = 'price_asc' 
    } = req.body;

    if (!cars || !Array.isArray(cars)) {
      return res.status(400).json({ message: "Araç listesi gerekli" });
    }

    let filteredCars = [...cars];

    // Search text filtresi
    if (searchText && searchText.trim() !== "") {
      const searchLower = searchText.toLowerCase().trim();
      filteredCars = filteredCars.filter((car) => 
        car.model.toLowerCase().includes(searchLower) ||
        car.year.toString().includes(searchText) ||
        car.gear.toLowerCase().includes(searchLower) ||
        car.fuel.toLowerCase().includes(searchLower)
      );
    }
    
    // Fuel type filtresi
    if (fuelTypes && fuelTypes.length > 0) {
      filteredCars = filteredCars.filter(car => 
        fuelTypes.some(fuelType => 
          car.fuel.toLowerCase().includes(fuelType.toLowerCase())
        )
      );
    }
    
    // Gear type filtresi
    if (gearTypes && gearTypes.length > 0) {
      filteredCars = filteredCars.filter(car => 
        gearTypes.some(gearType => 
          car.gear.toLowerCase().includes(gearType.toLowerCase())
        )
      );
    }

    // Fiyat aralığı filtresi
    if (priceRange && priceRange.min !== undefined && priceRange.max !== undefined) {
      filteredCars = filteredCars.filter(car => {
        const carPrice = Number(car.price.replace(/[^0-9]/g, "")) || 0;
        return carPrice >= priceRange.min && carPrice <= priceRange.max;
      });
    }

    // Yıl aralığı filtresi
    if (yearRange && yearRange.min !== undefined && yearRange.max !== undefined) {
      filteredCars = filteredCars.filter(car => 
        car.year >= yearRange.min && car.year <= yearRange.max
      );
    }

    // Koltuk sayısı filtresi
    if (seatCount && seatCount > 0) {
      filteredCars = filteredCars.filter(car => car.seats >= seatCount);
    }

    // Klima filtresi
    if (hasAC === true) {
      filteredCars = filteredCars.filter(car => car.ac === true);
    }

    // Sıralama
    switch (sortBy) {
      case 'price_asc':
          filteredCars.sort((a, b) => {
            const priceA = typeof a.price === "string" ? Number(a.price.replace(/[^0-9]/g, "")) : Number(a.price);
            const priceB = typeof b.price === "string" ? Number(b.price.replace(/[^0-9]/g, "")) : Number(b.price);
            return priceA - priceB;
          });
        break;
      case 'price_desc':
        filteredCars.sort((a, b) => {
          const priceA = Number(a.price.replace(/[^0-9]/g, "")) || 0;
          const priceB = Number(b.price.replace(/[^0-9]/g, "")) || 0;
          return priceB - priceA;
        });
        break;
      case 'year_desc':
        filteredCars.sort((a, b) => b.year - a.year);
        break;
      case 'year_asc':
        filteredCars.sort((a, b) => a.year - b.year);
        break;
      case 'model_asc':
        filteredCars.sort((a, b) => a.model.localeCompare(b.model));
        break;
      case 'seats_desc':
        filteredCars.sort((a, b) => b.seats - a.seats);
        break;
    }

    // Filtreleme istatistikleri
    const stats = {
      totalCars: cars.length,
      filteredCount: filteredCars.length,
      filters: {
        searchText: searchText || null,
        fuelTypes: fuelTypes || [],
        gearTypes: gearTypes || [],
        priceRange: priceRange || null,
        yearRange: yearRange || null,
        seatCount: seatCount || null,
        hasAC: hasAC || null,
        sortBy
      }
    };

    res.json({
      success: true,
      cars: filteredCars,
      stats,
      message: `${filteredCars.length} araç filtrelendi`
    });

  } catch (error) {
    console.error("Araç filtreleme hatası:", error);
    res.status(500).json({ 
      success: false, 
      message: "Filtreleme sırasında bir hata oluştu" 
    });
  }
});

export default router;
