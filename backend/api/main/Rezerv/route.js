
import express from "express";
import { getDB } from "../../../database/db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const db = getDB();

  try {
     const db = getDB();
    
   
  } catch (error) {
   res.status(500).json({ message: "as", error: err.message });

  }
});

export default router;
