import { Router } from "express";
import * as controller from "../controllers/stock.controller";
const router = Router();

router.get("/", controller.getStock);
router.get("/:id", controller.getById);

export default router;