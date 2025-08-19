// backend/database/db.js
import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, "happyways.db");
let db;

// --- Promisify sqlite3 methods so `await db.all/get/run` works ---
function promisifyDB(database) {
  if (!database || database._promisified) return database;
  const runOrig = database.run.bind(database);
  const getOrig = database.get.bind(database);
  const allOrig = database.all.bind(database);

  database.run = (sql, params = []) =>
    new Promise((resolve, reject) => {
      runOrig(sql, params, function (err) {
        if (err) return reject(err);
        resolve({ lastID: this.lastID, changes: this.changes });
      });
    });

  database.get = (sql, params = []) =>
    new Promise((resolve, reject) => {
      getOrig(sql, params, (err, row) => (err ? reject(err) : resolve(row)));
    });

  database.all = (sql, params = []) =>
    new Promise((resolve, reject) => {
      allOrig(sql, params, (err, rows) => (err ? reject(err) : resolve(rows || [])));
    });

  database._promisified = true;
  return database;
}

export async function initDB() {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error("[DB] connection error:", err.message);
        return reject(err);
      }
      // Promisify sqlite3 methods for async/await usage
      promisifyDB(db);

      db.exec(
        `
        PRAGMA foreign_keys = ON;

        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          phone TEXT,
          first_name TEXT,
          last_name TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS refresh_tokens (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          token TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS cars (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          model TEXT NOT NULL,
          year INTEGER NOT NULL,
          image TEXT,
          price REAL NOT NULL,
          available BOOLEAN DEFAULT 1
        );

        CREATE TABLE IF NOT EXISTS reservations (
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
        );

        CREATE TABLE IF NOT EXISTS campaigns (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          start_date TEXT NOT NULL,
          end_date TEXT NOT NULL,
          image TEXT,
          price_text TEXT,
          note TEXT
        );
        `,
        (execErr) => {
          if (execErr) {
            console.error("[DB] schema error:", execErr.message);
            return reject(execErr);
          }
          console.log("[DB] ready:", dbPath);
          resolve();
        }
      );
    });
  });
}

export function getDB() {
  if (!db) throw new Error("[DB] not initialized");
  return db;
}

// --- Helper'lar (await ile kullanıma uygun) ---
export const dbAll = (sql, params = []) => getDB().all(sql, params);
export const dbGet = (sql, params = []) => getDB().get(sql, params);
export const dbRun = (sql, params = []) => getDB().run(sql, params);

// --- getUserByEmail: email'i normalize ederek (trim+lower) ve case-insensitive arar ---
export function getUserByEmail(email) {
  const normalized = String(email || "").trim().toLowerCase();
  const sql = `SELECT * FROM users WHERE email = ? COLLATE NOCASE`;
  return getDB().get(sql, [normalized]);
}

export function closeDB() {
  return new Promise((resolve) => {
    if (!db) return resolve();
    db.close((err) => {
      if (err) {
        console.error("[DB] close error:", err.message);
      } else {
        console.log("[DB] connection closed");
      }
      resolve();
    });
  });
}

