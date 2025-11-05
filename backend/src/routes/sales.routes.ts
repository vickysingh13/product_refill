import { Router } from "express";
import { uploadSales } from "../controllers/sales.controller";

const router = Router();

// CSV Sales Upload
// POST /api/machines/:machineId/sales/upload
router.post("/machines/:machineId/sales/upload", uploadSales);

export default router;
