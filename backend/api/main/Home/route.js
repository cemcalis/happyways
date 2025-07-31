import express from "express";
import { getDB } from "../../../database/db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const db = getDB();

  try {
    const campaigns = await db.all("SELECT * FROM campaigns");
    const cars = await db.all("SELECT * FROM cars");

    res.status(200).json({ campaigns, cars });
  } catch (error) {
    res.status(500).json({ message: "Veri çekilemedi", error: error.message });
  }
});

export default router;
