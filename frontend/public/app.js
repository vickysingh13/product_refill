import api from "../src/api.js";

const NOTIF = document.getElementById("notification");
const NOTIF_TEXT = document.getElementById("notification-text");
const DEFAULT_MACHINE_ID = "11ce502b-b1aa-4e36-87b3-9a42e91f044b";
let selectedMachineId = DEFAULT_MACHINE_ID;

function showNotification(msg, isError = false) {
  NOTIF_TEXT.textContent = msg;
  NOTIF.style.background = isError ? "linear-gradient(to right,#e74c3c,#c0392b)" : "linear-gradient(to right,#2ecc71,#27ae60)";
  NOTIF.classList.add("show");
  setTimeout(() => NOTIF.classList.remove("show"), 3000);
}

function navigateTo(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  const el = document.getElementById(id);
  if (el) el.classList.add("active");
}

function wireNavButtons() {
  document.querySelectorAll("[data-nav]").forEach(btn => {
    btn.addEventListener("click", () => navigateTo(btn.dataset.nav));
  });
}

function setDbBanner(show, message = "") {
  const banner = document.getElementById("db-banner");
  if (!banner) return;
  banner.style.display = show ? "block" : "none";
  banner.textContent = show ? (message || "Database unavailable — some features are disabled") : "";
}

function isDbError(err) {
  if (!err) return false;
  const m = (err.message || "").toString();
  return m.includes("P1001") || m.includes("Can't reach database") || m.includes("Can't reach database server") || m.includes("500");
}

async function init() {
  wireNavButtons();

  // basic health check
  try {
    await api.healthCheck();
    showNotification("Backend reachable");
    setDbBanner(false);
  } catch (err) {
    showNotification("Backend unreachable: " + err.message, true);
    if (isDbError(err)) {
      setDbBanner(true, "Database unreachable — some features disabled");
    } else {
      setDbBanner(true, "Backend unreachable");
    }
  }

  // dynamic machine list from backend
  const ml = document.getElementById("machine-list");
  try {
    const machines = await api.getMachines();
    setDbBanner(false);
    if (Array.isArray(machines) && machines.length) {
      machines.forEach(m => {
        const d = document.createElement("div");
        d.className = "machine";
        d.textContent = m.code ?? m.name ?? m.id ?? "Machine";
        d.addEventListener("click", () => {
          selectedMachineId = m.id;
          showNotification(`Selected ${m.code ?? m.name ?? m.id}`);
          navigateTo("data-management-screen");
          const name = m.code ?? m.name ?? m.id;
          document.getElementById("display-machine-data")?.textContent && (document.getElementById("display-machine-data").textContent = name);
        });
        ml.appendChild(d);
      });
    } else {
      throw new Error("No machines returned");
    }
  } catch (err) {
    console.error("Failed to load machines:", err);
    // show fallback machine(s)
    setDbBanner(isDbError(err), "DB unavailable — using fallback machines");
    const fallback = [{ id: DEFAULT_MACHINE_ID, name: "Machine VV00001" }];
    fallback.forEach(m => {
      const d = document.createElement("div");
      d.className = "machine";
      d.textContent = m.name;
      d.addEventListener("click", () => {
        selectedMachineId = m.id;
        showNotification(`Selected ${m.name}`);
        navigateTo("data-management-screen");
      });
      ml.appendChild(d);
    });
  }

  // wire login
  document.getElementById("login-btn").addEventListener("click", () => {
    const uid = document.getElementById("userId").value.trim();
    const pwd = document.getElementById("password").value.trim();
    if (!uid) { document.getElementById("userId-error").style.display = "block"; return; }
    if (!pwd) { document.getElementById("password-error").style.display = "block"; return; }
    navigateTo("machine-selection-screen");
    showNotification("Login successful");
  });

  // file uploads
  document.getElementById("master-upload-btn").addEventListener("click", async () => {
    const input = document.getElementById("master-csv");
    if (!input.files.length) return showNotification("Select a CSV first", true);
    try {
      const res = await api.uploadMasterSlots(selectedMachineId, input.files[0]);
      showNotification(`Master uploaded: ${res.processed || "ok"}`);
      // refresh stock
      await refreshStock();
    } catch (err) {
      showNotification("Master upload failed: " + err.message, true);
    }
  });

  document.getElementById("sale-upload-btn").addEventListener("click", async () => {
    const input = document.getElementById("sale-csv");
    if (!input.files.length) return showNotification("Select a CSV first", true);
    try {
      const res = await api.uploadSales(selectedMachineId, input.files[0]);
      showNotification("Sales uploaded");
      await refreshStock();
    } catch (err) {
      showNotification("Sales upload failed: " + err.message, true);
    }
  });

  document.getElementById("refill-btn").addEventListener("click", () => {
    navigateTo("refill-screen");
    showNotification("Refill saved");
  });

  await refreshStock();
}

async function refreshStock() {
  try {
    const list = await api.getCurrentStock(selectedMachineId).catch(() => []);
    const container = document.getElementById("current-stack-list");
    container.innerHTML = "";
    if (!list || !list.length) {
      container.innerHTML = "<div class='stack-item'>No stock data</div>";
      return;
    }
    list.slice(0, 4).forEach(item => {
      const el = document.createElement("div");
      el.className = "stack-item";
      el.innerHTML = `<div>${item.sku?.name ?? item.slotNumber ?? "Item"}</div><div>${item.currentQty ?? 0} units</div>`;
      container.appendChild(el);
    });
  } catch (err) {
    console.error(err);
  }
}

document.addEventListener("DOMContentLoaded", init);