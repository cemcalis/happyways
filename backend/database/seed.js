import { open } from "sqlite";
import sqlite3 from "sqlite3";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, "happyways.db");

const seed = async () => {
  const db = await open({ filename: dbPath, driver: sqlite3.Database });


  await db.exec(`
    CREATE TABLE IF NOT EXISTS campaigns (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      description TEXT,
      price TEXT,
      image TEXT,
      discount INTEGER
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS cars (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      model TEXT,
      year INTEGER,
      price TEXT,
      image TEXT,
      gear TEXT,
      fuel TEXT,
      seats INTEGER,
      ac BOOLEAN
    );
  `);


  await db.exec(`DELETE FROM campaigns`);
  await db.exec(`DELETE FROM cars`);


  await db.exec(`
    INSERT INTO campaigns (title, description, price, image, discount)
    VALUES
      ('Premium Modellerde Sezon Finali', 'Sezon sonu özel kampanya', '4.000 ₺', '/assets/campaigns/premium.png', 10),
      ('Yaza Özel İndirim!', 'Sınırlı süreli yaz indirimi', '3.500 ₺', '/assets/campaigns/yaz_indirimi.png', 10);
  `);


  await db.exec(`
    INSERT INTO cars (model, year, price, image, gear, fuel, seats, ac) VALUES
      ('Mercedes C220', 2024, '5.000 ₺', '/assets/cars/mercedes.png', 'Otomatik', 'Dizel', 5, 1),
      ('BMW 3 Serisi', 2020, '4.500 ₺', '/assets/cars/bmw.png', 'Otomatik', 'Benzin', 5, 1),
      ('Mercedes C220', 2024, '5.000 ₺', '/assets/cars/mercedes.png', 'Otomatik', 'Dizel', 5, 1),
      ('BMW 3 Serisi', 2020, '4.500 ₺', '/assets/cars/bmw.png', 'Otomatik', 'Benzin', 5, 1);
  `);

  console.log(" Seed  tamamlandı");
};

seed();
