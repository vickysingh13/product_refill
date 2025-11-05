import { prisma } from "../config/db";

export async function createMachine(data: { code: string; location?: string }) {
  const { code, location } = data;
  return prisma.machine.create({
    data: {
      code,
      location: location ?? null,
    },
  });
}

export async function getMachines() {
  return prisma.machine.findMany({
    orderBy: { createdAt: "desc" },
  });
}