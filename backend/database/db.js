  // backend/database/db.js
  import sqlite3 from "sqlite3";
  import { open } from "sqlite";
  import { fileURLToPath } from "url";
  import { dirname, join } from "path";


  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  let db;


  export async function initDB() {
    db = await open({
      filename: join(__dirname, "happyways.db"),
      driver: sqlite3.Database,
    });

    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        full_name TEXT,
        phone TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
      `);
    await db.exec(`
    CREATE TABLE IF NOT EXISTS campaigns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    transaction_date TEXT,
    rent_date TEXT,
    image TEXT,
    subtitle1 TEXT,
    subtitle2 TEXT);
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
      ac BOOLEAN,
      kosullar TEXT
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      car_id INTEGER,
      user_name TEXT,
      user_email TEXT,
      user_phone TEXT,
      car_model TEXT,
      car_year INTEGER,
      car_image TEXT,
      pickup_location TEXT NOT NULL,
      dropoff_location TEXT,
      pickup_date TEXT NOT NULL,
      dropoff_date TEXT NOT NULL,
      pickup_time TEXT NOT NULL,
      dropoff_time TEXT NOT NULL,
      pickup_datetime TEXT,
      dropoff_datetime TEXT,
      total_price TEXT,
      status TEXT DEFAULT 'pending',
      payment_status TEXT DEFAULT 'pending',
      payment_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (car_id) REFERENCES cars(id)
    );
  `);

    return db;
  }


  export function getDB() {
    if (!db) {
      throw new Error("Veritabanı henüz başlatılmadı. Önce initDB() çağırılmalı.");
    }
    return db;
  }


  export async function getUserByEmail(email) {
    const database = getDB();
    return database.get("SELECT * FROM users WHERE email = ?", [email]);
  }


    