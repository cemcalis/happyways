import { open } from "sqlite";
import sqlite3 from "sqlite3";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, "happyways.db");

const migrateDatabaseSchema = async () => {
  try {
    const db = await open({ filename: dbPath, driver: sqlite3.Database });

    console.log("🔄 Database migration başlıyor...");

    // Check if 'available' column exists in cars table
    const tableInfo = await db.all("PRAGMA table_info(cars)");
    const hasAvailableColumn = tableInfo.some(column => column.name === 'available');

    if (!hasAvailableColumn) {
      console.log("➕ 'available' column ekleniyor...");
      await db.exec("ALTER TABLE cars ADD COLUMN available BOOLEAN DEFAULT 1");
      console.log("✅ 'available' column başarıyla eklendi");
    } else {
      console.log("ℹ️ 'available' column zaten mevcut");
    }

    // Check if reservations table has proper datetime columns
    const reservationInfo = await db.all("PRAGMA table_info(reservations)");
    const hasPickupDatetime = reservationInfo.some(column => column.name === 'pickup_datetime');
    const hasDropoffDatetime = reservationInfo.some(column => column.name === 'dropoff_datetime');

    if (!hasPickupDatetime) {
      console.log("➕ 'pickup_datetime' column ekleniyor...");
      await db.exec("ALTER TABLE reservations ADD COLUMN pickup_datetime TEXT");
      console.log("✅ 'pickup_datetime' column başarıyla eklendi");
    }

    if (!hasDropoffDatetime) {
      console.log("➕ 'dropoff_datetime' column ekleniyor...");
      await db.exec("ALTER TABLE reservations ADD COLUMN dropoff_datetime TEXT");
      console.log("✅ 'dropoff_datetime' column başarıyla eklendi");
    }

    // Update existing reservations to have datetime format
    await db.exec(`
      UPDATE reservations 
      SET pickup_datetime = pickup_date || ' ' || pickup_time,
          dropoff_datetime = dropoff_date || ' ' || dropoff_time
      WHERE pickup_datetime IS NULL OR dropoff_datetime IS NULL
    `);

    console.log("✅ Database migration tamamlandı!");
    await db.close();

  } catch (error) {
    console.error("❌ Database migration hatası:", error);
    throw error;
  }
};

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateDatabaseSchema();
}

export { migrateDatabaseSchema };
