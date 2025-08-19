import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, "happyways.db");
let db;

export async function initDB() {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error("[DB] connection error:", err.message);
        reject(err);
      } else {
        console.log("[DB] connected:", dbPath);

        db.serialize(() => {
          db.run(`
            CREATE TABLE IF NOT EXISTS users (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              full_name TEXT,
              email TEXT UNIQUE NOT NULL,
              password TEXT NOT NULL,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
          `);

          db.run(`
            CREATE TABLE IF NOT EXISTS cars (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              model TEXT NOT NULL,
              year INTEGER,
              image TEXT,
              price REAL NOT NULL
            )
          `);

          db.run(`
            CREATE TABLE IF NOT EXISTS locations (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              name TEXT NOT NULL
            )
          `);

          db.run(`
            CREATE TABLE IF NOT EXISTS campaigns (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              title TEXT NOT NULL,
              description TEXT,
              start_date TEXT,
              end_date TEXT,
              image TEXT,
              price_text TEXT,
              note TEXT
            )
          `);

          db.run(`
            CREATE TABLE IF NOT EXISTS reservations (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              user_id INTEGER NOT NULL,
              car_id INTEGER NOT NULL,

              user_name TEXT,
              user_email TEXT,
              user_phone TEXT,
              car_model TEXT,
              car_year INTEGER,
              car_image TEXT,

              pickup_location TEXT NOT NULL,
              dropoff_location TEXT NOT NULL,
              pickup_location_id INTEGER,
              dropoff_location_id INTEGER,
              pickup_date TEXT NOT NULL,
              dropoff_date TEXT NOT NULL,
              pickup_time TEXT NOT NULL,
              dropoff_time TEXT NOT NULL,
              pickup_datetime TEXT,
              dropoff_datetime TEXT,

              total_price REAL NOT NULL,
              status TEXT NOT NULL DEFAULT 'confirmed',
              payment_status TEXT DEFAULT 'paid',
              payment_id TEXT,
              notes TEXT,

              created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

              FOREIGN KEY (user_id) REFERENCES users(id),
              FOREIGN KEY (car_id) REFERENCES cars(id),
              FOREIGN KEY (pickup_location_id) REFERENCES locations(id),
              FOREIGN KEY (dropoff_location_id) REFERENCES locations(id)
            )
          `);

          resolve();
        });
      }
    });
  });
}

export function getDB() {
  if (!db) throw new Error("[DB] not initialized");
  return db;
}

export async function closeDB() {
  return new Promise((resolve, reject) => {
    if (!db) return resolve();
    db.close((err) => {
      if (err) {
        console.error("[DB] close error:", err.message);
        reject(err);
      } else {
        console.log("[DB] closed.");
        resolve();
      }
    });
  });
}


export function getUserByEmail(email) {
  return new Promise((resolve, reject) => {
    if (!db) return reject(new Error("[DB] not initialized"));
    db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}
