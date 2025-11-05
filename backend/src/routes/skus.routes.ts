import { Router } from "express";
import * as controller from "../controllers/skus.controller";
const router = Router();

router.get("/", controller.getAll);
router.get("/:id", controller.getById);

export default router;