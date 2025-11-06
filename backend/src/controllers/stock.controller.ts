import { Request, Response } from "express";
import * as svc from "../services/stock.service";

export const getStock = async (_req: Request, res: Response) =>
  res.json({ message: "stock.getStock placeholder" });

export const getById = async (req: Request, res: Response) =>
  res.json({ message: `stock.getById ${req.params.id} placeholder` });

export async function getMachineStocks(req: Request, res: Response) {
  try {
    const { machineId } = req.params;
    if (!machineId) return res.status(400).json({ error: "machineId required" });
    const stocks = await svc.getMachineStocks(machineId);
    return res.json(stocks);
  } catch (err) {
    console.error("getMachineStocks error:", err);
    // if DB not available surface friendly message
    return res.status(500).json({ error: "Failed to fetch stocks" });
  }
}