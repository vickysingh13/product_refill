import { Request, Response } from "express";
import * as service from "../services/slots.service";

export const getAll = async (_req: Request, res: Response) =>
  res.json({ message: "slots.getAll placeholder" });

export const getById = async (req: Request, res: Response) =>
  res.json({ message: `slots.getById ${req.params.id} placeholder` });

export async function createSlot(req: Request, res: Response) {
  try {
    const { machineId, trayId } = req.params;
    const { slotNumber, skuId, capacityTemplateId, maxCapacity } = req.body;

    if (!machineId) return res.status(400).json({ error: "machineId is required" });
    if (!trayId) return res.status(400).json({ error: "trayId is required" });
    if (!slotNumber || typeof slotNumber !== "string")
      return res.status(400).json({ error: "slotNumber is required and must be a string" });
    if (!skuId || typeof skuId !== "string")
      return res.status(400).json({ error: "skuId is required and must be a string" });

    const slot = await service.createSlot({
      machineId,
      trayId,
      slotNumber: slotNumber.trim(),
      skuId,
      capacityTemplateId: capacityTemplateId ?? null,
      maxCapacity: Number(maxCapacity) || 0,
    });

    return res.status(201).json(slot);
  } catch (err: any) {
    console.error("createSlot error:", err);
    if (err?.status && err?.message) return res.status(err.status).json({ error: err.message });
    return res.status(500).json({ error: "Failed to create slot" });
  }
}

export async function listSlots(req: Request, res: Response) {
  try {
    const { machineId } = req.params;
    if (!machineId) return res.status(400).json({ error: "machineId is required" });

    const slots = await service.listSlots(machineId);
    return res.json(slots);
  } catch (err) {
    console.error("listSlots error:", err);
    return res.status(500).json({ error: "Failed to list slots" });
  }
}