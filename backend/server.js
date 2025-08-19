// backend/server.js
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { loadEnv } from "./utils/env.js";
import { validateAndSanitize } from "./utils/requestValidator.js";
import { errorHandler } from "./utils/errorHandler.js";

import { initDB, getDB, closeDB } from "./database/db.js";

// ROUTES
import registerRoute from "./api/Register/route.js";
import loginRoute from "./api/Login/route.js";
import forgetRoute from "./api/Forget/route.js";
import resetRoute from "./api/Reset/route.js";
import OtpRoute from "./api/Otp/route.js";
import HomeRoute from "./api/main/Home/route.js";
import CampaignRoute from "./api/main/Campaign/route.js";
import AllCarsRoute from "./api/main/Cars/AllCarsPage/route.js";
import PaymentRoute from "./api/Payment/route.js";
import ReservationRoute from "./api/Reservation/route.js";
import RezervRoute from "./api/main/Rezerv/route.js";
import CarsDetailRoute from "./api/main/Cars/CarsDetailPage/route.js";
import ProfileRoute from "./api/main/Profile/route.js";
import authRefreshRoute from "./api/auth/refresh.js";
import locationRoute from "./api/location/route.js";
import priceCalculationRoute from "./api/Payment/PriceCalculation/route.js";
import paymentValidationRoute from "./api/Payment/FormValidation/route.js";
import carFilterRoute from "./api/main/Cars/FilterCars/route.js";
import additionalServicesRoute from "./api/main/Cars/AdditionalServices/route.js";
import CarsRoute from "./api/Cars/route.js";

// ---- ENV ----
loadEnv();

// ---- APP ----
const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(validateAndSanitize);

// Static
app.use("/assets", express.static(path.join(__dirname, "assets")));

// Health (DB'ye hafif ping atar)
app.get("/health", async (req, res) => {
  try {
    const db = getDB();
    await db.get("SELECT 1 as ok");
    res.json({ ok: true, time: new Date().toISOString() });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// ---- ROUTES ----
app.use("/api/register", registerRoute);
app.use("/api/login", loginRoute);
app.use("/api/forgot-password", forgetRoute);
app.use("/api/reset-password", resetRoute);
app.use("/api/otp", OtpRoute);
app.use("/api/auth/refresh", authRefreshRoute);

app.use("/api/home", HomeRoute);
app.use("/api/campaign", CampaignRoute);

app.use("/api/cars/allcars", AllCarsRoute);
app.use("/api/cars/carsdetail", CarsDetailRoute);
app.use("/api/cars/filter", carFilterRoute);
app.use("/api/cars/additional-services", additionalServicesRoute);
app.use("/api/cars", CarsRoute);

app.use("/api/payment", PaymentRoute);
app.use("/api/payment/calculate-price", priceCalculationRoute);
app.use("/api/payment/validate-form", paymentValidationRoute);

app.use("/api/reservation", ReservationRoute);
app.use("/api/main/rezerv", RezervRoute);
app.use("/api/main/profile", ProfileRoute);
app.use("/api/location", locationRoute);

// 404
app.use((req, res) => res.status(404).json({ message: "Not Found" }));

// Global error handler (kendi errorHandler'ını kullan)
app.use(errorHandler);

// ---- DIAGNOSTIC: beklenmedik kapanmaları yakala ----
process.on("uncaughtException", (err) => {
  console.error("[uncaughtException]", err);
});
process.on("unhandledRejection", (reason) => {
  console.error("[unhandledRejection]", reason);
});
process.on("beforeExit", (code) => {
  console.warn("[beforeExit] code=", code);
});
process.on("exit", (code) => {
  console.warn("[exit] code=", code);
});

let server;

async function startServer() {
  try {
    await initDB();

    server = app.listen(PORT, HOST, () => {
      console.log(`Sunucu http://${HOST}:${PORT} adresinde çalışıyor.`);
    });

    server.on("close", () => {
      console.warn("[server] close event tetiklendi (sunucu kapandı).");
    });

    const shutdown = async (sig) => {
      console.log(`[signal] ${sig} alındı, sunucu kapatılıyor...`);
      try {
        if (server && server.listening) {
          await new Promise((resolve) => server.close(resolve));
        }
      } catch (e) {
        console.error("server.close hatası:", e);
      }
      try {
        await closeDB();
      } catch (e) {
        console.error("closeDB hatası:", e);
      }
      process.exit(0);
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    console.error("Veritabanı başlatma hatası:", error.message);
    // DB açılamazsa kapanır; burada process.exit(1) normaldir.
    process.exit(1);
  }
}

startServer();

export default app;
