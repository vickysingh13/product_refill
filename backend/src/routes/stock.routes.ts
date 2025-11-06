import { Router } from "express";
import * as ctrl from "../controllers/stock.controller";

const router = Router();

// GET /api/machines/:machineId/stocks
router.get("/machines/:machineId/stocks", ctrl.getMachineStocks);

export default router;