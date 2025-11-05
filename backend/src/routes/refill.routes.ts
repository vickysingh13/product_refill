import { Router } from "express";
import * as controller from "../controllers/refill.controller";
const router = Router();

router.post("/", controller.createRefill);
router.get("/", controller.getAll);

export default router;