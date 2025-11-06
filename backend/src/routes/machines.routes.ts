import { Router } from "express";
import * as ctrl from "../controllers/machines.controller";

const router = Router();

// GET /api/machines
router.get("/", ctrl.listMachines);

export default router;