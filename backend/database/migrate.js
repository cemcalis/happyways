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

    console.log("Database migration başlıyor...");

     const userInfo = await db.all("PRAGMA table_info(users)");
    const hasFirstName = userInfo.some(column => column.name === 'first_name');
    const hasLastName = userInfo.some(column => column.name === 'last_name');

    if (!hasFirstName) {
      console.log("'first_name' column ekleniyor...");
      await db.exec("ALTER TABLE users ADD COLUMN first_name TEXT");
      console.log("'first_name' column başarıyla eklendi");
    }

    if (!hasLastName) {
      console.log("'last_name' column ekleniyor...");
      await db.exec("ALTER TABLE users ADD COLUMN last_name TEXT");
      console.log("'last_name' column başarıyla eklendi");
    }

    

    const tableInfo = await db.all("PRAGMA table_info(cars)");
    const hasAvailableColumn = tableInfo.some(column => column.name === 'available');

   
    if (!hasAvailableColumn) {
      console.log("'available' column ekleniyor...");
      await db.exec("ALTER TABLE cars ADD COLUMN available BOOLEAN DEFAULT 1");
      console.log("'available' column başarıyla eklendi");
    } else {
      console.log("ℹ️ 'available' column zaten mevcut");
    }

    const reservationInfo = await db.all("PRAGMA table_info(reservations)");
    const hasPickupDatetime = reservationInfo.some(column => column.name === 'pickup_datetime');
    const hasDropoffDatetime = reservationInfo.some(column => column.name === 'dropoff_datetime');

    if (!hasPickupDatetime) {
      console.log("'pickup_datetime' column ekleniyor...");
      await db.exec("ALTER TABLE reservations ADD COLUMN pickup_datetime TEXT");
      console.log("'pickup_datetime' column başarıyla eklendi");
    }

    if (!hasDropoffDatetime) {
      console.log("'dropoff_datetime' column ekleniyor...");
      await db.exec("ALTER TABLE reservations ADD COLUMN dropoff_datetime TEXT");
      console.log("'dropoff_datetime' column başarıyla eklendi");
    }

    await db.exec(`
      UPDATE reservations
      SET pickup_datetime = pickup_date || ' ' || pickup_time,
          dropoff_datetime = dropoff_date || ' ' || dropoff_time
      WHERE pickup_datetime IS NULL OR dropoff_datetime IS NULL
    `);

    const usersInfo = await db.all("PRAGMA table_info(users)");
    const hasFirstNameColumn = usersInfo.some(column => column.name === 'first_name');
    const hasLastNameColumn = usersInfo.some(column => column.name === 'last_name');

    if (!hasFirstNameColumn) {
      console.log("'first_name' column ekleniyor...");
      await db.exec("ALTER TABLE users ADD COLUMN first_name TEXT");
      console.log("'first_name' column başarıyla eklendi");
    } else {
      console.log("ℹ️ 'first_name' column zaten mevcut");
    }

    if (!hasLastNameColumn) {
      console.log("'last_name' column ekleniyor...");
      await db.exec("ALTER TABLE users ADD COLUMN last_name TEXT");
      console.log("'last_name' column başarıyla eklendi");
    } else {
      console.log("ℹ️ 'last_name' column zaten mevcut");
    }

    if (!hasFirstNameColumn || !hasLastNameColumn) {
      await db.exec(`
        UPDATE users
        SET first_name = CASE
            WHEN full_name IS NOT NULL THEN TRIM(substr(full_name, 1, instr(full_name, ' ') - 1))
            ELSE first_name
          END,
          last_name = CASE
            WHEN full_name IS NOT NULL THEN TRIM(substr(full_name, instr(full_name, ' ') + 1))
            ELSE last_name
          END
        WHERE full_name IS NOT NULL AND (first_name IS NULL OR last_name IS NULL)
      `);
      console.log("Kullanıcı isimleri güncellendi");
    }

    console.log("Database migration tamamlandı!");
    await db.close();

  } catch (error) {
    console.error("Database migration hatası:", error);
    throw error;
  }
};
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateDatabaseSchema();
}

export { migrateDatabaseSchema };