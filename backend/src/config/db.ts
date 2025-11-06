import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

let dbConnected = false;

// wrap $connect so callers won't throw on import/startup
const origConnect = prisma.$connect.bind(prisma);
prisma.$connect = async () => {
  try {
    await origConnect();
    dbConnected = true;
    console.log("DB Connected Successfully (safe)");
  } catch (err: any) {
    dbConnected = false;
    console.error("DB connection failed (safe):", err?.message ?? err);
    // do not rethrow so server can start
  }
};

// also wrap $disconnect to update flag
const origDisconnect = prisma.$disconnect.bind(prisma);
prisma.$disconnect = async () => {
  try {
    await origDisconnect();
  } finally {
    dbConnected = false;
  }
};

export { prisma, dbConnected as _dbConnectedFlag };
export function isDbConnected() {
  return dbConnected;
}
