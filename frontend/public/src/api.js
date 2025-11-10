const BASE_URL = "https://cautious-space-fishstick-jrgvrqgv963546p-4000.app.github.dev";
const DEFAULT_MACHINE_ID = "11ce502b-b1aa-4e36-87b3-9a42e91f044b";

async function fetchJson(url, opts = {}) {
  const res = await fetch(url, opts);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${res.statusText} - ${text}`);
  }
  return res.json();
}

export async function healthCheck() {
  return fetchJson(`${BASE_URL}/health`);
}

export async function getMachines() {
  return fetchJson(`${BASE_URL}/api/machines`);
}

export async function uploadMasterSlots(machineId = DEFAULT_MACHINE_ID, file) {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${BASE_URL}/api/machines/${machineId}/slots/master-upload`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
  return res.json();
}

export async function uploadSales(machineId = DEFAULT_MACHINE_ID, file) {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${BASE_URL}/api/machines/${machineId}/sales/upload`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
  return res.json();
}

export async function getSlots(machineId = DEFAULT_MACHINE_ID) {
  return fetchJson(`${BASE_URL}/api/machines/${machineId}/slots`);
}

export async function getCurrentStock(machineId = DEFAULT_MACHINE_ID) {
  return fetchJson(`${BASE_URL}/api/machines/${machineId}/stocks`);
}

export default {
  healthCheck,
  getMachines,
  uploadMasterSlots,
  uploadSales,
  getSlots,
  getCurrentStock,
};