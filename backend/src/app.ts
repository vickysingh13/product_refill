import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";

import machinesRouter from "./routes/machines.routes";
import slotsRouter from "./routes/slots.routes";
import skusRouter from "./routes/skus.routes";
import refillRouter from "./routes/refill.routes";
import salesRouter from "./routes/sales.routes";
import stockRouter from "./routes/stock.routes";
import traysRouter from "./routes/trays.routes";
import masterRouter from "./routes/master.routes";

import notFound from "./middleware/not-found";
import errorHandler from "./middleware/error-handler";

dotenv.config();

console.log("app.ts loaded");

const app = express();
app.set("trust proxy", 1);

// build allow-list from env FRONTEND_ORIGIN (comma separated) or fallbacks
const rawOrigins = process.env.FRONTEND_ORIGIN ?? "http://localhost:5173,http://localhost:3000";
const ALLOWED_ORIGINS = rawOrigins.split(",").map(s => s.trim()).filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // allow non-browser tools (Postman, curl) with no origin
      if (!origin) return callback(null, true);
      if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
      return callback(new Error("CORS origin denied"));
    },
    credentials: false,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// larger file size limit for CSV uploads (10MB)
app.use(
  fileUpload({
    createParentPath: true,
    limits: { fileSize: 10 * 1024 * 1024 },
  })
);

app.get("/", (_req, res) =>
  res.send(
    `<html><body>
      <h1>Product Refill API</h1>
      <p>This server is running successfully.</p>
      <p>Health: <a href="/health">/health</a></p>
    </body></html>`
  )
);

app.get("/health", (_req, res) => res.json({ status: "ok" }));

// API routes
// Mount routers under /api
app.use("/api/machines", machinesRouter);
// note: stock routes are registered as /api/machines/:machineId/stocks via stock.routes
app.use("/api", stockRouter);
app.use("/api", traysRouter);
app.use("/api", slotsRouter);
app.use("/api/skus", skusRouter);
app.use("/api", refillRouter);
app.use("/api", salesRouter);

// Fallback and error handlers
app.use(notFound);
app.use(errorHandler);

export default app;
