import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // capacity templates
  await prisma.capacityTemplate.createMany({
    data: [
      { templateName: "CHIPS_9", defaultCapacity: 9 },
      { templateName: "BISCUIT_8", defaultCapacity: 8 },
      { templateName: "CAN_7", defaultCapacity: 7 },
      { templateName: "CHOC_12", defaultCapacity: 12 },
      { templateName: "CHOC_18", defaultCapacity: 18 },
      { templateName: "PET_8", defaultCapacity: 8 },
      { templateName: "TETRA_9", defaultCapacity: 9 },
    ],
    skipDuplicates: true,
  });

  // sample SKUs (must match CSV Name field)
  await prisma.sku.createMany({
    data: [
      { name: "DIET COKE", category: "Beverage" },
      { name: "HATSUN MANGO LASSI", category: "Dairy" },
      { name: "DARK FANTASY CHOCO CREAM", category: "Biscuits" },
      { name: "SUNFEAST FANTASTIK FRUIT AND NUT", category: "Biscuits" },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Seed completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
