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
        phone TEXT);
      `);
    await db.exec(`
    CREATE TABLE IF NOT EXISTS campaigns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    price TEXT,
    image TEXT,
    discount INTEGER);
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


    