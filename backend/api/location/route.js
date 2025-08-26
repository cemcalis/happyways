
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
  try {
    const { name, address } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Lokasyon adı gerekli." });
    }

    const db = getDB();
    const result = await db.run(
      "INSERT INTO locations (name, address) VALUES (?, ?)",
      [name, address || ""]
    );

    res.status(201).json({ id: result.lastID, name, address: address || "" });
  } catch (err) {
    res.status(500).json({ error: "Lokasyon eklenemedi." });
  }
});

export default router;