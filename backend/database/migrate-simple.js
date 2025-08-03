import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = path.join(__dirname, 'happyways.db');
const db = new sqlite3.Database(dbPath);

console.log('🔄 Database migration başlıyor...');

// Add available column to cars table
db.run("ALTER TABLE cars ADD COLUMN available BOOLEAN DEFAULT 1", function(err) {
  if (err) {
    if (err.message.includes('duplicate column name')) {
      console.log('ℹ️ Available column zaten mevcut');
    } else {
      console.error('❌ Migration hatası:', err.message);
    }
  } else {
    console.log('✅ Available column başarıyla eklendi');
  }
  
  // Add datetime columns to reservations table
  db.run("ALTER TABLE reservations ADD COLUMN pickup_datetime TEXT", function(err) {
    if (err && !err.message.includes('duplicate column name')) {
      console.error('❌ pickup_datetime migration hatası:', err.message);
    } else {
      console.log('✅ pickup_datetime column hazır');
    }
    
    db.run("ALTER TABLE reservations ADD COLUMN dropoff_datetime TEXT", function(err) {
      if (err && !err.message.includes('duplicate column name')) {
        console.error('❌ dropoff_datetime migration hatası:', err.message);
      } else {
        console.log('✅ dropoff_datetime column hazır');
      }
      
      // Update existing reservations
      db.run(`UPDATE reservations 
              SET pickup_datetime = pickup_date || ' ' || pickup_time,
                  dropoff_datetime = dropoff_date || ' ' || dropoff_time
              WHERE pickup_datetime IS NULL OR dropoff_datetime IS NULL`, function(err) {
        if (err) {
          console.error('❌ Data update hatası:', err.message);
        } else {
          console.log('✅ Existing data updated');
        }
        
        console.log('✅ Database migration tamamlandı!');
        db.close();
      });
    });
  });
});
