import { Request, Response } from "express";

export const getAll = async (_req: Request, res: Response) =>
  res.json({ message: "skus.getAll placeholder" });

export const getById = async (req: Request, res: Response) =>
  res.json({ message: `skus.getById ${req.params.id} placeholder` });