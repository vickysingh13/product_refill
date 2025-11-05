import { prisma } from "../config/db";

export async function createTray(data: { machineId: string; name: string; sortOrder: number }) {
  const { machineId, name, sortOrder } = data;
  return prisma.machineTray.create({
    data: {
      machineId,
      name,
      sortOrder,
    },
  });
}

export async function listTrays(machineId: string) {
  return prisma.machineTray.findMany({
    where: { machineId },
    orderBy: { sortOrder: "asc" },
  });
}