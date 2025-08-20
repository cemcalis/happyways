import express from "express";
import { createReservation } from "../Reservation/Create/create.js";
import { listReservations } from        "../Reservation/List/list.js";
import { userReservations } from "../Reservation/UserReservation/userReservations.js";
import { deleteReservation } from "../Reservation/Cancel/cancel.js";

const router = express.Router();


router.post("/", createReservation);
router.get("/", listReservations);
router.post("/my-reservations", userReservations);
router.delete("/:id", deleteReservation);


export default router;