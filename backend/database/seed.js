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
    CREATE TABLE IF NOT EXISTS locations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      address TEXT
    );
  `);

  await db.exec(`DELETE FROM locations`);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS campaigns (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      description TEXT,
      transaction_date TEXT,
      rent_date TEXT,
      image TEXT,
      subtitle1 TEXT,
      subtitle2 TEXT
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS cars (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      model TEXT,
      year INTEGER,
      price REAL,
      image TEXT,
      gear TEXT,
      fuel TEXT,
      seats INTEGER,
      ac BOOLEAN,
      kosullar TEXT,
      available BOOLEAN DEFAULT 1
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      car_id INTEGER,
      pickup_location TEXT NOT NULL,
      dropoff_location TEXT,
      pickup_date TEXT NOT NULL,
      dropoff_date TEXT NOT NULL,
      pickup_time TEXT NOT NULL,
      dropoff_time TEXT NOT NULL,
      total_price TEXT,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (car_id) REFERENCES cars(id)
    );
  `);

  await db.exec(`DELETE FROM campaigns`);
  await db.exec(`DELETE FROM cars`);

  await db.exec(`
    INSERT INTO campaigns 
      (title, description, transaction_date, rent_date, image, subtitle1, subtitle2)
    VALUES
      ('Premium Modellerde Sezon Finali',
       'Sezon sonu özel kampanya fırsatı sizlerle!',
       '01.08.2025 - 31.08.2025',
       '05.08.2025 - 30.08.2025',
       'kampanya1.svg',
       'Günlük 4.000 ₺',
       'En iyi fiyat garantisi'),

      ('Yaza Özel İndirim!',
       'Sınırlı süreli yaz indirimlerini kaçırmayın!',
       '15.07.2025 - 15.08.2025',
       '20.07.2025 - 10.08.2025',
       'kampanya2.svg',
       '%25 indirim fırsatı',
       'Hızlı rezervasyon avantajı'),
       
      ('Ekonomik Araçlarda Fırsat',
       'Bütçe dostu araçlarla keyifli yolculuklar!',
       '10.08.2025 - 25.08.2025',
       '12.08.2025 - 23.08.2025',
       'kampanya3.svg',
       'Günlük 2.500 ₺',
       'Ücretsiz kilometre');
  `);

 
  await db.exec(`
    INSERT INTO cars (model, year, price, image, gear, fuel, seats, ac, kosullar) VALUES
      ('Mercedes C220', 2024, 5000, 'mercedes.png', 'Otomatik', 'Dizel', 5, 1, 
       '• Minimum yaş: 21\n• Ehliyet süresi: En az 2 yıl\n• Kredi kartı gerekli\n• Depozito: 2.000 TL\n• Günlük km limiti: 300 km'),
      ('BMW 3 Serisi', 2020, 4500, 'bmw.png', 'Otomatik', 'Benzin', 5, 1,
       '• Minimum yaş: 23\n• Ehliyet süresi: En az 3 yıl\n• Kredi kartı gerekli\n• Depozito: 1.800 TL\n• Günlük km limiti: 250 km');
  `);


   await db.exec(`   INSERT INTO locations (name, address) VALUES
    ('Ercan Havalimanı', 'Ercan Havalimanı, Lefkoşa'),
    ('Girne Merkez', 'Atatürk Cd. No:12, Girne'),
    ('Gazimağusa Otogar', 'Otogar Sk. No:5, Gazimağusa'),
    ('Güzelyurt Terminal', 'Terminal Cd. No:3, Güzelyurt'),
    ('Lefke Meydan', 'Meydan Sk. No:1, Lefke')
  `);
    
  console.log(" Seed tamamlandı");
};

seed();
