import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = path.join(__dirname, 'happyways.db');
const db = new sqlite3.Database(dbPath);

console.log('Database migration başlıyor...');

db.run("ALTER TABLE cars ADD COLUMN available BOOLEAN DEFAULT 1", function(err) {
  if (err) {
    if (err.message.includes('duplicate column name')) {
      console.log('ℹ Available column zaten mevcut');
    } else {
      console.error('Migration hatası:', err.message);
    }
  } else {
    console.log('Available column başarıyla eklendi');
  }

  db.run("ALTER TABLE reservations ADD COLUMN pickup_datetime TEXT", function(err) {
    if (err && !err.message.includes('duplicate column name')) {
      console.error('pickup_datetime migration hatası:', err.message);
    } else {
      console.log('pickup_datetime column hazır');
    }

    db.run("ALTER TABLE reservations ADD COLUMN dropoff_datetime TEXT", function(err) {
      if (err && !err.message.includes('duplicate column name')) {
        console.error('dropoff_datetime migration hatası:', err.message);
      } else {
        console.log('dropoff_datetime column hazır');
      }

      db.run(`UPDATE reservations
              SET pickup_datetime = pickup_date || ' ' || pickup_time,
                  dropoff_datetime = dropoff_date || ' ' || dropoff_time
              WHERE pickup_datetime IS NULL OR dropoff_datetime IS NULL`, function(err) {
        if (err) {
          console.error('Data update hatası:', err.message);
        } else {
          console.log('Existing data updated');
        }

         db.run("ALTER TABLE users ADD COLUMN first_name TEXT", function(err) {
          if (err && !err.message.includes('duplicate column name')) {
            console.error('first_name migration hatası:', err.message);
          } else {
            console.log('first_name column hazır');
          }

          db.run("ALTER TABLE users ADD COLUMN last_name TEXT", function(err) {
            if (err && !err.message.includes('duplicate column name')) {
              console.error('last_name migration hatası:', err.message);
            } else {
              console.log('last_name column hazır');
            }

            db.run(`UPDATE users
                    SET first_name = CASE
                          WHEN instr(full_name, ' ') > 0 THEN substr(full_name, 1, instr(full_name, ' ') - 1)
                          ELSE full_name
                        END,
                        last_name = CASE
                          WHEN instr(full_name, ' ') > 0 THEN substr(full_name, instr(full_name, ' ') + 1)
                          ELSE ''
                        END
                    WHERE full_name IS NOT NULL AND full_name != ''`, function(err) {
              if (err) {
                console.error('Users data update hatası:', err.message);
              } else {
                console.log('User names migrated');
              }

              console.log('Database migration tamamlandı!');
              db.close();
            });
          });
        });
      });
    });
  });
});
