import { Request, Response } from "express";
import * as service from "../services/trays.service";

export async function createTray(req: Request, res: Response) {
  try {
    const { machineId } = req.params;
    const { name, sortOrder } = req.body;

    if (!machineId) return res.status(400).json({ error: "machineId is required" });
    if (!name || typeof name !== "string") return res.status(400).json({ error: "name is required" });

    const so = Number(sortOrder ?? 0);
    if (!Number.isFinite(so)) return res.status(400).json({ error: "sortOrder must be a number" });

    const tray = await service.createTray({ machineId, name: name.trim(), sortOrder: so });
    return res.status(201).json(tray);
  } catch (err) {
    console.error("createTray error:", err);
    return res.status(500).json({ error: "Failed to create tray" });
  }
}

export async function listTrays(req: Request, res: Response) {
  try {
    const { machineId } = req.params;
    if (!machineId) return res.status(400).json({ error: "machineId is required" });

    const trays = await service.listTrays(machineId);
    return res.json(trays);
  } catch (err) {
    console.error("listTrays error:", err);
    return res.status(500).json({ error: "Failed to list trays" });
  }
}