import sqlite3pkg from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const sqlite3 = sqlite3pkg.verbose();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, "happyways.db");
const db = new sqlite3.Database(dbPath);

function seed() {
  console.log("[SEED] started...");

  // Kampanya verileri
  const campaigns = [
    ["Premium Modellerde Sezon Finali","Sezon sonu özel kampanya fırsatı sizlerle!","2025-08-01","2025-08-31","/assets/campaign/kampanya1.png","Günlük 4.000 ₺","En iyi fiyat garantisi"],
    ["Hafta Sonu İndirimi","Cuma-Pazar arası %15 indirim","2025-09-05","2025-09-30","/assets/campaign/kampanya2.png","%15 indirim","Erken rezervasyon fırsatı"]
  ];

  const cars = [
    ["BMW 3 Serisi", 2022, "/assets/cars/bmw.png", 4500],
    ["Mercedes C220", 2023, "/assets/cars/mercedes.png", 5000],
    ["Audi A4", 2021, "/assets/cars/audi.png", 4200],
  ];

  db.serialize(() => {
    // Lokasyonlar tablosunu oluştur
    db.run(`CREATE TABLE IF NOT EXISTS locations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      address TEXT,
      city TEXT,
      country TEXT
    )`);

    // Lokasyonları ekle
    const locationNames = [
      ["Happy Ways Ofis", "Ofis adresi", "Lefkoşa", "Kıbrıs"],
      ["Ercan Airport", "Havalimanı adresi", "Lefkoşa", "Kıbrıs"],
      ["YD Akaryakıt", "Akaryakıt adresi", "Girne", "Kıbrıs"],
      ["Girne Turizm Limanı", "Liman adresi", "Girne", "Kıbrıs"],
      ["Mimoza Hotel", "Otel adresi", "Bafra", "Kıbrıs"],
      ["Nuhun Gemisi", "Otel adresi", "Bafra", "Kıbrıs"]
    ];
    const stmtLoc = db.prepare("INSERT INTO locations (name, address, city, country) VALUES (?, ?, ?, ?)");
    locationNames.forEach((loc) => stmtLoc.run(loc));
    stmtLoc.finalize();
    console.log("[SEED] locations ok");
    // Arabalar tablosunu oluştur
    db.run(`CREATE TABLE IF NOT EXISTS cars (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      model TEXT NOT NULL,
      year INTEGER NOT NULL,
      image TEXT,
      price REAL NOT NULL
    )`);

    // Arabaları ekle
    const stmtCar = db.prepare("INSERT INTO cars (model, year, image, price) VALUES (?, ?, ?, ?)");
    cars.forEach((c) => stmtCar.run(c));
    stmtCar.finalize();
    console.log("[SEED] cars ok");

    // Reservations tablosunu oluştur
    db.run(`CREATE TABLE IF NOT EXISTS reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      car_id INTEGER NOT NULL,
      pickup_location TEXT,
      dropoff_location TEXT,
      pickup_date TEXT NOT NULL,
      dropoff_date TEXT NOT NULL,
      pickup_time TEXT NOT NULL,
      dropoff_time TEXT NOT NULL,
      total_price REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'confirmed',
      payment_status TEXT DEFAULT 'paid',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY(car_id) REFERENCES cars(id) ON DELETE CASCADE
    )`);

    // Örnek rezervasyon verisi ekle
    const reservations = [
      [1, 1, "Happy Ways Ofis", "Ercan Airport", "2025-08-21", "2025-08-22", "10:00", "18:00", 5310, "confirmed", "paid"],
      [2, 2, "YD Akaryakıt", "Girne Turizm Limanı", "2025-09-01", "2025-09-03", "09:00", "17:00", 8000, "confirmed", "paid"]
    ];
    const stmtRes = db.prepare(`INSERT INTO reservations (user_id, car_id, pickup_location, dropoff_location, pickup_date, dropoff_date, pickup_time, dropoff_time, total_price, status, payment_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    reservations.forEach((r) => stmtRes.run(r));
    stmtRes.finalize();
    console.log("[SEED] reservations ok");
    

    db.run(`CREATE TABLE IF NOT EXISTS campaigns (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      image TEXT,
      price_text TEXT,
      note TEXT
    )`);

    const stmtCamp = db.prepare(
      `INSERT INTO campaigns 
        (title, description, start_date, end_date, image, price_text, note) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    );
    campaigns.forEach((c) => stmtCamp.run(c));
    stmtCamp.finalize();
    console.log("[SEED] campaigns ok");
  });

  db.close();
  console.log("[SEED] done.");
}

seed();
