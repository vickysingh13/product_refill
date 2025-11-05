import { PrismaClient } from "@prisma/client";
import Papa from "papaparse";

const prisma = new PrismaClient();

type CsvRow = { Selection: string; Name: string; TxnID?: string; Date?: string };

export async function importSalesCsv(machineId: string, csvBuffer: Buffer) {
  const parsed = Papa.parse<CsvRow>(csvBuffer.toString("utf-8"), {
    header: true,
    skipEmptyLines: true,
  }).data;

  // validate mapping cache
  const slots = await prisma.machineSlot.findMany({
    where: { machineId },
    include: { sku: true },
  });

  const slotBySelection = new Map(slots.map((s) => [s.slotNumber.trim(), s]));

  const salesCountBySlot = new Map<string, number>();

  for (const r of parsed) {
    if (!r.Selection || !r.Name) continue;

    const selectionKey = String(r.Selection).trim();
    const slot = slotBySelection.get(selectionKey);
    if (!slot) throw new Error(`Slot ${selectionKey} not registered for this machine.`);

    // SKU name must match
    const expectedName = slot.sku.name.trim().toUpperCase();
    if (expectedName !== String(r.Name).trim().toUpperCase()) {
      throw new Error(
        `CSV SKU mismatch for Selection ${selectionKey}. Expected "${expectedName}" got "${r.Name}".`
      );
    }

    salesCountBySlot.set(slot.id, (salesCountBySlot.get(slot.id) ?? 0) + 1);
  }

  // transaction section
  await prisma.$transaction(async (tx) => {
    for (const [slotId, soldQty] of salesCountBySlot.entries()) {
      const slot = await tx.machineSlot.findUnique({ where: { id: slotId } });
      if (!slot) throw new Error("Slot vanished");

      const cs = await tx.currentStock.findUnique({
        where: { machineId_slotId: { machineId, slotId } },
      });
      if (!cs) throw new Error(`No currentStock row found for slot ${slot.slotNumber}`);

      const next = cs.currentQty - soldQty;
      if (next < 0) throw new Error(`Stock would go negative for slot ${slot.slotNumber}`);

      // insert sales log condensed as one row (faster)
      await tx.salesLog.create({
        data: {
          machineId,
          slotId,
        },
      });

      await tx.currentStock.update({
        where: { machineId_slotId: { machineId, slotId } },
        data: { currentQty: next },
      });
    }
  });

  return { ok: true, processedRows: parsed.length };
}
