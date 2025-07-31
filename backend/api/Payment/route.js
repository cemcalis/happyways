import express from "express";
import { getDB } from "../../database/db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const db = getDB();

  try {
   
  } catch (error) {
   
  }
});

export default router;
