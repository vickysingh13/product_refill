import { prisma } from "../config/db";

async function main() {
  try {
    await prisma.$connect();
    const res = await prisma.$queryRaw`SELECT 1 AS result`;
    console.log("DB ok:", res);
  } catch (err) {
    console.error("DB test failed:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();