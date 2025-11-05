import { Router } from "express";
import * as controller from "../controllers/trays.controller";

const router = Router();

// POST /api/machines/:machineId/trays
router.post("/machines/:machineId/trays", controller.createTray);

// GET /api/machines/:machineId/trays
router.get("/machines/:machineId/trays", controller.listTrays);

export default router;