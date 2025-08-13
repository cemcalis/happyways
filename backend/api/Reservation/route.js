import express from "express";
import { getDB } from "../../database/db.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { createReservation } from "../Reservation/Create/create.js";
import { listReservations } from "../Reservation/List/list.js";
import { userReservations } from "../Reservation/Helpers/helpers.js";
import { cancelReservation } from "../Reservation/Cancel/cancel.js";

dotenv.config();

const router = express.Router();


router.post("/", createReservation);
router.get("/", listReservations);
router.post("/my-reservations", userReservations);
router.delete("/:id", cancelReservation);
