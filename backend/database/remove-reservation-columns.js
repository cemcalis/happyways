import sqlite3 from 'sqlite3';

const dbPath = 'c:/Users/Cem/Desktop/happyweyse1/happyways/backend/database/happyways.db';
const db = new sqlite3.Database(dbPath);

const columnsToRemove = [
  'model', 'dropoff', 'pickupDate', 'pickupTime', 'dropoffDate', 'dropoffTime',
  'price', 'insurancePrice', 'kdv', 'pickup', 'total', 'totalPrice', 'totalDays',
  'extraDriver', 'extraDriverPrice', 'payment_id'
];

// SQLite'da ALTER TABLE DROP COLUMN doğrudan desteklenmez.
// Bunun için tabloyu yeniden oluşturmak gerekir.
// Bu script sadece bilgi amaçlıdır, elle migration gerektirir.

console.log('Aşağıdaki sütunlar reservations tablosundan kaldırılmalı:');
columnsToRemove.forEach(col => console.log(col));
db.close();
