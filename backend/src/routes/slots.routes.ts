import { Router } from "express";
import * as controller from "../controllers/slots.controller";

const router = Router();

// POST /api/machines/:machineId/trays/:trayId/slots
router.post("/machines/:machineId/trays/:trayId/slots", controller.createSlot);

// GET /api/machines/:machineId/slots
router.get("/machines/:machineId/slots", controller.listSlots);

export default router;