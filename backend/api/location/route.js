
import express from "express";
import { getDB } from "../../database/db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const db = getDB();
    const locations = await db.all("SELECT * FROM locations");
    res.json(locations);
  } catch (err) {
    res.status(500).json({ error: "Lokasyonlar alınamadı." });
  }
});

router.post("/", async (req, res) => {
  console.log("çağrıldı.");
  res.json({ message: "Location endpoint çalıştı." });
});

export default router;