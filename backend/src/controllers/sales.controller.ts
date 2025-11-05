import { importSalesCsv } from "../services/sales.service";

export async function uploadSales(req, res) {
  try {
    const { machineId } = req.params;
    const file = req.files?.file;
    if (!file) return res.status(400).json({ error: "CSV file required" });

    const result = await importSalesCsv(machineId, file.data);
    return res.json(result);
  } catch (err: any) {
    console.error("sales upload error:", err);
    return res.status(500).json({ error: err.message });
  }
}
