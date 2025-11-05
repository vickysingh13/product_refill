import { Request, Response } from "express";
import { importMasterSlots } from "../services/master.service";

export async function uploadMaster(req: Request, res: Response) {
  try {
    const { machineId } = req.params;
    const file = (req.files as any)?.file;
    if (!file) return res.status(400).json({ error: "CSV file required (field: file)" });

    const result = await importMasterSlots(machineId, file.data as Buffer);
    return res.json(result);
  } catch (err: any) {
    console.error("master upload error:", err);
    return res.status(500).json({ error: err?.message ?? "Internal Server Error" });
  }
}