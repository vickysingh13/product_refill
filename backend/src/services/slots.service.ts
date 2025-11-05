import { prisma } from "../config/db";

export async function createSlot(data: {
  machineId: string;
  trayId: string;
  slotNumber: string;
  skuId: string;
  capacityTemplateId: string | null;
  maxCapacity: number;
}) {
  const { machineId, trayId, slotNumber, skuId, capacityTemplateId, maxCapacity } = data;

  const tray = await prisma.machineTray.findUnique({ where: { id: trayId } });
  if (!tray) {
    const err: any = new Error("Tray not found");
    err.status = 404;
    throw err;
  }
  if (tray.machineId !== machineId) {
    const err: any = new Error("Tray does not belong to the specified machine");
    err.status = 400;
    throw err;
  }

  const slot = await prisma.machineSlot.create({
    data: {
      machineId,
      trayId,
      slotNumber,
      skuId,
      capacityTemplateId,
      maxCapacity,
    },
  });

  // initialize stock entry for this slot
  await prisma.currentStock.create({
    data: {
      machineId,
      slotId: slot.id,
      currentQty: 0,
    },
  });

  return slot;
}

export async function listSlots(machineId: string) {
  return prisma.machineSlot.findMany({
    where: { machineId },
    include: {
      tray: true,
      sku: true,
      capacityTemplate: true,
    },
    orderBy: { slotNumber: "asc" },
  });
}
