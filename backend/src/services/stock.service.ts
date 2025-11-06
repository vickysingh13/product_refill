import { prisma } from "../config/db";
import { isDbConnected } from "../config/db";

const FALLBACK_STOCKS = [
  {
    id: "fallback-1",
    machineId: "11ce502b-b1aa-4e36-87b3-9a42e91f044b",
    slotId: "A1",
    slotNumber: "A1",
    currentQty: 0,
    sku: { id: "sku-1", name: "Sample Product" },
  },
];

export async function getMachineStocks(machineId: string) {
  if (!isDbConnected()) {
    console.warn("DB offline — returning fallback stocks");
    return FALLBACK_STOCKS.filter((s) => s.machineId === machineId || true);
  }

  try {
    const rows = await prisma.currentStock.findMany({
      where: { machineId },
      include: {
        sku: { select: { id: true, name: true } },
        slot: { select: { id: true, slotNumber: true, trayId: true, skuId: true } },
      },
      orderBy: { slot: { slotNumber: "asc" } },
    });

    if (!rows || rows.length === 0) return FALLBACK_STOCKS.filter((s) => s.machineId === machineId || true);
    return rows;
  } catch (err: any) {
    console.error("getMachineStocks DB error:", err?.message ?? err);
    return FALLBACK_STOCKS.filter((s) => s.machineId === machineId || true);
  }
}