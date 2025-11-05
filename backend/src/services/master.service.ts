import Papa from "papaparse";
import { prisma } from "../config/db";

type CsvRow = {
  slot?: string;
  price?: string;
  count?: string;
  name?: string;
};

export async function importMasterSlots(machineId: string, fileBuffer: Buffer) {
  const csv = fileBuffer.toString("utf8");
  const parsed = Papa.parse<CsvRow>(csv, { header: true, skipEmptyLines: true });
  const rows = parsed.data ?? [];

  let processed = 0;

  await prisma.$transaction(async (tx) => {
    // ensure there's at least one tray for the machine; pick/create first tray
    let tray = await tx.machineTray.findFirst({
      where: { machineId },
      orderBy: { sortOrder: "asc" },
    });

    if (!tray) {
      tray = await tx.machineTray.create({
        data: {
          machineId,
          name: "Tray 1",
          sortOrder: 0,
        },
      });
    }

    for (const r of rows) {
      const slotNumber = r.slot?.trim();
      const skuName = r.name?.trim();
      const maxCapacity = Number(r.count ?? 0) || 0;

      if (!slotNumber || !skuName) {
        continue; // skip invalid row
      }

      // find or create SKU (case-insensitive)
      let sku = await tx.sku.findFirst({
        where: { name: { equals: skuName, mode: "insensitive" } },
      });

      if (!sku) {
        sku = await tx.sku.create({
          data: { name: skuName },
        });
      }

      // Check if slot exists (unique by machineId + slotNumber)
      const existingSlot = await tx.machineSlot.findFirst({
        where: { machineId, slotNumber },
      });

      let slotId: string;
      if (existingSlot) {
        // update maxCapacity if changed
        await tx.machineSlot.update({
          where: { id: existingSlot.id },
          data: { maxCapacity },
        });
        slotId = existingSlot.id;
      } else {
        const created = await tx.machineSlot.create({
          data: {
            machineId,
            trayId: tray.id,
            slotNumber,
            skuId: sku.id,
            capacityTemplateId: null,
            maxCapacity,
          },
        });
        slotId = created.id;
      }

      // ensure a CurrentStock row exists for this machine+slot
      const cs = await tx.currentStock.findFirst({
        where: { machineId, slotId },
      });

      if (!cs) {
        await tx.currentStock.create({
          data: {
            machineId,
            slotId,
            currentQty: maxCapacity,
          },
        });
      }

      processed += 1;
    }
  });

  return { processed };
}