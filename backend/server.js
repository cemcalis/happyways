import express from "express";
import cors from "cors";
import { initDB } from "./database/db.js";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

import registerRoute from "./api/Register/route.js";
import loginRoute from "./api/Login/route.js";
import forgetRoute from "./api/Forget/route.js";
import resetRoute from "./api/Reset/route.js";
import OtpRoute from "./api/Otp/route.js";
import HomeRoute from "./api/main/Home/route.js";
import AccountRoute from "./api/main/Profile/route.js";
import CampaignRoute from "./api/main/Campaign/route.js";
import AllCarsRoute from "./api/main/Cars/AllCarsPage/route.js";
import PaymentRoute from "./api/Payment/route.js";
import ReservationRoute from "./api/Reservation/route.js";
import RezervRoute from "./api/main/Rezerv/route.js";
import CarsDetailRoute from "./api/main/Cars/CarsDetailPage/route.js";
import ProfileRoute from "./api/main/Profile/route.js";
import authRefreshRoute from "./api/auth/refresh.js";
import locationRoute from "./api/Location/route.js";
import priceCalculationRoute from "./api/Payment/PriceCalculation/route.js";
import paymentValidationRoute from "./api/Payment/FormValidation/route.js";
import carFilterRoute from "./api/main/Cars/FilterCars/route.js";

dotenv.config();  
const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(cors()); 
app.use(express.json()); 

app.use("/assets", express.static(path.join(__dirname, "assets")));

app.use("/assets", (req, res, next) => {
  console.log("Asset request:", req.url);
  next();
}, express.static(path.join(__dirname, "assets")));

app.use("/api/register", registerRoute);
app.use("/api/login", loginRoute);
app.use("/api/forgot-password", forgetRoute);
app.use("/api/reset-password", resetRoute);
app.use("/api/otp", OtpRoute);
app.use("/api/auth/refresh", authRefreshRoute);
app.use("/api/home", HomeRoute);
app.use("/api/account", AccountRoute);
app.use("/api/campaign", CampaignRoute);
app.use("/api/cars/allcars", AllCarsRoute);
app.use("/api/payment", PaymentRoute);
app.use("/api/reservation", ReservationRoute);
app.use("/api/cars/carsdetail", CarsDetailRoute);
app.use("/api/main/rezerv", RezervRoute);
app.use("/api/main/profile", ProfileRoute);
app.use("/api/location", locationRoute);
app.use("/api/payment/calculate-price", priceCalculationRoute);
app.use("/api/payment/validate-form", paymentValidationRoute);
app.use("/api/cars/filter", carFilterRoute);

app.use('/assets', express.static(path.join(__dirname, 'assets')));
const startServer = async () => {
  try {
    await initDB();
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Sunucu http://0.0.0.0:${PORT} adresinde çalışıyor.`);
    });
  } catch (error) {
    console.error(" Veritabanı çalışmıyo:", error.message);
  }
};

startServer();
