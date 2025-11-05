import { Router } from "express";
import * as controller from "../controllers/machines.controller";

const router = Router();

// create machine
router.post("/", controller.createMachine);

// list machines
router.get("/", controller.getMachines);

export default router;