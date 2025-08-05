import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = path.join(__dirname, 'happyways.db');
const db = new sqlite3.Database(dbPath);

console.log('Database schema kontrol ediliyor...\n');


db.all("PRAGMA table_info(reservations)", function(err, rows) {
  if (err) {
    console.error('Reservations schema hatası:', err.message);
  } else {
    console.log('RESERVATIONS TABLE COLUMNS:');
    rows.forEach(row => {
      console.log(`   - ${row.name} (${row.type}) ${row.notnull ? 'NOT NULL' : ''} ${row.dflt_value ? `DEFAULT ${row.dflt_value}` : ''}`);
    });
  }
  
  console.log('\n');
 
  db.all("PRAGMA table_info(cars)", function(err, rows) {
    if (err) {
      console.error('Cars schema hatası:', err.message);
    } else {
      console.log('CARS TABLE COLUMNS:');
      rows.forEach(row => {
        console.log(`   - ${row.name} (${row.type}) ${row.notnull ? 'NOT NULL' : ''} ${row.dflt_value ? `DEFAULT ${row.dflt_value}` : ''}`);
      });
    }
    
    console.log('\n');
    

    db.all("PRAGMA table_info(users)", function(err, rows) {
      if (err) {
        console.error(' Users schema hatası:', err.message);
      } else {
        console.log('USERS TABLE COLUMNS:');
        rows.forEach(row => {
          console.log(`   - ${row.name} (${row.type}) ${row.notnull ? 'NOT NULL' : ''} ${row.dflt_value ? `DEFAULT ${row.dflt_value}` : ''}`);
        });
      }
      
      console.log('\nSchema kontrol tamamlandı');
      db.close();
    });
  });
});
