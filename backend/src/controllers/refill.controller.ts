import { Request, Response } from "express";

export const createRefill = async (req: Request, res: Response) =>
  res.json({ message: "refill.create placeholder", body: req.body });

export const getAll = async (_req: Request, res: Response) =>
  res.json({ message: "refill.getAll placeholder" });