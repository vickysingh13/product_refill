import { prisma } from "../config/db";
import { isDbConnected } from "../config/db";

const FALLBACK_MACHINES = [
  {
    id: "11ce502b-b1aa-4e36-87b3-9a42e91f044b",
    code: "VV00001",
    name: "Machine VV00001",
    location: "Unknown",
  },
];

export async function createMachine(data: { code: string; location?: string }) {
  const { code, location } = data;
  return prisma.machine.create({
    data: {
      code,
      location: location ?? null,
    },
  });
}

export async function listMachines() {
  // if DB is offline, return a cached/fallback list
  if (!isDbConnected()) {
    console.warn("DB offline — returning fallback machines");
    return FALLBACK_MACHINES;
  }

  try {
    const machines = await prisma.machine.findMany({
      select: { id: true, code: true, name: true, location: true },
      orderBy: { code: "asc" },
    });
    if (!machines || machines.length === 0) return FALLBACK_MACHINES;
    return machines;
  } catch (err: any) {
    console.error("listMachines DB error:", err?.message ?? err);
    return FALLBACK_MACHINES;
  }
}