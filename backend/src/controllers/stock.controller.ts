import { Request, Response } from "express";

export const getStock = async (_req: Request, res: Response) =>
  res.json({ message: "stock.getStock placeholder" });

export const getById = async (req: Request, res: Response) =>
  res.json({ message: `stock.getById ${req.params.id} placeholder` });