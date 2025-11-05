-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'REFILLER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" "Role" NOT NULL DEFAULT 'REFILLER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CapacityTemplate" (
    "id" TEXT NOT NULL,
    "templateName" TEXT NOT NULL,
    "defaultCapacity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CapacityTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sku" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT,
    "category" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sku_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Machine" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Machine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MachineTray" (
    "id" TEXT NOT NULL,
    "machineId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,

    CONSTRAINT "MachineTray_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MachineSlot" (
    "id" TEXT NOT NULL,
    "machineId" TEXT NOT NULL,
    "trayId" TEXT,
    "slotNumber" TEXT NOT NULL,
    "skuId" TEXT NOT NULL,
    "capacityTemplateId" TEXT,
    "maxCapacity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MachineSlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CurrentStock" (
    "id" TEXT NOT NULL,
    "machineId" TEXT NOT NULL,
    "slotId" TEXT NOT NULL,
    "currentQty" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CurrentStock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefillLog" (
    "id" TEXT NOT NULL,
    "machineId" TEXT NOT NULL,
    "slotId" TEXT NOT NULL,
    "quantityAdded" INTEGER NOT NULL,
    "refilledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "refillerId" TEXT,

    CONSTRAINT "RefillLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalesLog" (
    "id" TEXT NOT NULL,
    "machineId" TEXT NOT NULL,
    "slotId" TEXT NOT NULL,
    "soldAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rawTxnId" TEXT,

    CONSTRAINT "SalesLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CapacityTemplate_templateName_key" ON "CapacityTemplate"("templateName");

-- CreateIndex
CREATE UNIQUE INDEX "Sku_name_key" ON "Sku"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Machine_code_key" ON "Machine"("code");

-- CreateIndex
CREATE UNIQUE INDEX "MachineTray_machineId_name_key" ON "MachineTray"("machineId", "name");

-- CreateIndex
CREATE INDEX "MachineSlot_machineId_trayId_idx" ON "MachineSlot"("machineId", "trayId");

-- CreateIndex
CREATE INDEX "MachineSlot_skuId_idx" ON "MachineSlot"("skuId");

-- CreateIndex
CREATE UNIQUE INDEX "MachineSlot_machineId_slotNumber_key" ON "MachineSlot"("machineId", "slotNumber");

-- CreateIndex
CREATE INDEX "CurrentStock_slotId_idx" ON "CurrentStock"("slotId");

-- CreateIndex
CREATE UNIQUE INDEX "CurrentStock_machineId_slotId_key" ON "CurrentStock"("machineId", "slotId");

-- CreateIndex
CREATE INDEX "RefillLog_machineId_slotId_refilledAt_idx" ON "RefillLog"("machineId", "slotId", "refilledAt");

-- CreateIndex
CREATE INDEX "SalesLog_machineId_slotId_soldAt_idx" ON "SalesLog"("machineId", "slotId", "soldAt");

-- AddForeignKey
ALTER TABLE "MachineTray" ADD CONSTRAINT "MachineTray_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MachineSlot" ADD CONSTRAINT "MachineSlot_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MachineSlot" ADD CONSTRAINT "MachineSlot_trayId_fkey" FOREIGN KEY ("trayId") REFERENCES "MachineTray"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MachineSlot" ADD CONSTRAINT "MachineSlot_skuId_fkey" FOREIGN KEY ("skuId") REFERENCES "Sku"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MachineSlot" ADD CONSTRAINT "MachineSlot_capacityTemplateId_fkey" FOREIGN KEY ("capacityTemplateId") REFERENCES "CapacityTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurrentStock" ADD CONSTRAINT "CurrentStock_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurrentStock" ADD CONSTRAINT "CurrentStock_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "MachineSlot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefillLog" ADD CONSTRAINT "RefillLog_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefillLog" ADD CONSTRAINT "RefillLog_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "MachineSlot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefillLog" ADD CONSTRAINT "RefillLog_refillerId_fkey" FOREIGN KEY ("refillerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesLog" ADD CONSTRAINT "SalesLog_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesLog" ADD CONSTRAINT "SalesLog_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "MachineSlot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
