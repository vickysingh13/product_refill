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

import notFound from "./middleware/not-found";
import errorHandler from "./middleware/error-handler";
import masterRouter from "./routes/master.routes";

dotenv.config();

console.log("app.ts loaded");

const app = express();
app.set("trust proxy", 1);

app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    createParentPath: true,
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
app.use("/api", traysRouter);
app.use("/api", slotsRouter);
app.use("/api/skus", skusRouter);
app.use("/api", refillRouter);
app.use("/api/sales", salesRouter);
app.use("/api", stockRouter);
app.use("/api", masterRouter);



app.use(notFound);
app.use(errorHandler);

export default app;
