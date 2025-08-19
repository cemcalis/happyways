const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "happyways.db");
const db = new sqlite3.Database(dbPath);

function seed() {
  console.log("[SEED] started...");

  const cars = [
    ["BMW 3 Serisi", 2022, "/assets/cars/bmw.png", 4500],
    ["Mercedes C220", 2023, "/assets/cars/mercedes.png", 5000],
    ["Audi A4", 2021, "/assets/cars/audi.png", 4200],
  ];

  db.serialize(() => {
    db.run("DELETE FROM cars");
    const stmt = db.prepare(
      "INSERT INTO cars (model, year, image, price) VALUES (?, ?, ?, ?)"
    );
    cars.forEach((c) => stmt.run(c));
    stmt.finalize();
    console.log("[SEED] cars ok");

    // --- Locations ---
    const locations = [
      ["Ercan Havalimanı"],
      ["Girne Merkez"],
      ["Lefkoşa Ofis"],
    ];

    db.run("DELETE FROM locations");
    const stmtLoc = db.prepare("INSERT INTO locations (name) VALUES (?)");
    locations.forEach((l) => stmtLoc.run(l));
    stmtLoc.finalize();
    console.log("[SEED] locations ok");

 
    const campaigns = [
      [
        "Premium Modellerde Sezon Finali",
        "Sezon sonu özel kampanya fırsatı sizlerle!",
        "01.08.2025",
        "31.08.2025",
        "kampanya1.png",
        "Günlük 4.000 ₺",
        "En iyi fiyat garantisi",
      ],
    ];

    db.run("DELETE FROM campaigns");
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
