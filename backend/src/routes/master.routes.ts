import { Router } from "express";
import * as controller from "../controllers/master.controller";

const router = Router();

// POST /api/machines/:machineId/slots/master-upload
router.post("/machines/:machineId/slots/master-upload", controller.uploadMaster);

export default router;