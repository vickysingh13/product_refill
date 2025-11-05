import app from "./app";
import { prisma } from "./config/db";

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await prisma.$connect();
    console.log("✅ DB Connected Successfully");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (error) {
    console.error("❌ DB connection failed", error);
    process.exit(1);
  }
}

start();
