import { Request, Response } from "express";
import * as service from "../services/machines.service";

export async function createMachine(req: Request, res: Response) {
  try {
    const { code, location } = req.body;
    if (!code || typeof code !== "string") {
      return res.status(400).json({ error: "code is required and must be a string" });
    }
    const machine = await service.createMachine({ code: code.trim(), location });
    return res.status(201).json(machine);
  } catch (err) {
    console.error("createMachine error:", err);
    return res.status(500).json({ error: "Failed to create machine" });
  }
}

export async function getMachines(_req: Request, res: Response) {
  try {
    const machines = await service.getMachines();
    return res.json(machines);
  } catch (err) {
    console.error("getMachines error:", err);
    return res.status(500).json({ error: "Failed to fetch machines" });
  }
}