const DEFAULT_TRACKER_URL = "https://peterchrjoergensen.dk/tracker/";
const SETTINGS_KEY = "trackerHistoryImporter.settings";

const trackerUrlInput = document.getElementById("tracker-url");
const daysBackInput = document.getElementById("days-back");
const maxItemsInput = document.getElementById("max-items");
const taskTypeInput = document.getElementById("task-type");
const importBtn = document.getElementById("import-btn");
const openTrackerBtn = document.getElementById("open-tracker-btn");
const statusEl = document.getElementById("status");

function setStatus(text, isError = false) {
  statusEl.textContent = text;
  statusEl.style.color = isError ? "#b91c1c" : "";
}

function normalizeTaskTitle(item) {
  const rawTitle = (item.title || "").trim();
  if (rawTitle) return rawTitle;

  try {
    const parsedUrl = new URL(item.url || "");
    const path = parsedUrl.pathname && parsedUrl.pathname !== "/" ? parsedUrl.pathname : "";
    return `${parsedUrl.hostname}${path}`;
  } catch {
    return (item.url || "Untitled visit").slice(0, 120);
  }
}

function clamp(value, min, max, fallback) {
  const num = Number.parseInt(String(value), 10);
  if (Number.isNaN(num)) return fallback;
  return Math.min(max, Math.max(min, num));
}

async function getStorageValue(key) {
  const result = await chrome.storage.sync.get([key]);
  return result[key];
}

async function setStorageValue(key, value) {
  await chrome.storage.sync.set({ [key]: value });
}

async function loadSettings() {
  const settings = (await getStorageValue(SETTINGS_KEY)) || {};
  trackerUrlInput.value = settings.trackerUrl || DEFAULT_TRACKER_URL;
  daysBackInput.value = String(clamp(settings.daysBack ?? 7, 1, 60, 7));
  maxItemsInput.value = String(clamp(settings.maxItems ?? 20, 1, 100, 20));
  taskTypeInput.value = settings.taskType === "medium" || settings.taskType === "long" ? settings.taskType : "short";
}

async function saveSettings() {
  const nextSettings = {
    trackerUrl: trackerUrlInput.value.trim() || DEFAULT_TRACKER_URL,
    daysBack: clamp(daysBackInput.value, 1, 60, 7),
    maxItems: clamp(maxItemsInput.value, 1, 100, 20),
    taskType: taskTypeInput.value === "medium" || taskTypeInput.value === "long" ? taskTypeInput.value : "short",
  };

  await setStorageValue(SETTINGS_KEY, nextSettings);
  return nextSettings;
}

async function getRecentHistory(daysBack, maxItems) {
  const startTime = Date.now() - daysBack * 24 * 60 * 60 * 1000;

  const rows = await chrome.history.search({
    text: "",
    startTime,
    maxResults: Math.max(maxItems * 4, maxItems),
  });

  const seenUrls = new Set();
  const tasks = [];

  for (const row of rows) {
    const url = row.url || "";
    if (!url || (!url.startsWith("http://") && !url.startsWith("https://"))) continue;
    if (seenUrls.has(url)) continue;

    seenUrls.add(url);
    tasks.push({
      title: normalizeTaskTitle(row),
      description: url,
    });

    if (tasks.length >= maxItems) break;
  }

  return tasks;
}

async function getActiveTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0] || null;
}

function looksLikeTrackerUrl(url) {
  return typeof url === "string" && /\/tracker\/?(?:#.*)?$/.test(url);
}

async function dispatchImportToTab(tabId, payload) {
  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId },
    func: (detail) => {
      const event = new CustomEvent("tracker-external-import", {
        detail,
      });
      document.dispatchEvent(event);
      return true;
    },
    args: [payload],
  });

  return result;
}

async function onImportClicked() {
  try {
    importBtn.disabled = true;
    setStatus("Reading browser history…");

    const settings = await saveSettings();
    const historyTasks = await getRecentHistory(settings.daysBack, settings.maxItems);

    if (historyTasks.length === 0) {
      setStatus("No recent history items found to import.", true);
      return;
    }

    const activeTab = await getActiveTab();
    if (!activeTab || typeof activeTab.id !== "number") {
      setStatus("No active tab found.", true);
      return;
    }

    if (!looksLikeTrackerUrl(activeTab.url || "")) {
      setStatus("Open your /tracker tab. Auto-import will run there (without #data=).", true);
      return;
    }

    const payload = {
      source: "Browser history import",
      tasks: historyTasks.map((task) => ({
        title: task.title,
        description: task.description,
        type: settings.taskType,
      })),
    };

    await dispatchImportToTab(activeTab.id, payload);
    setStatus(`Sent ${historyTasks.length} history item${historyTasks.length === 1 ? "" : "s"} to tracker.`);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    setStatus(`Import failed: ${message}`, true);
  } finally {
    importBtn.disabled = false;
  }
}

async function onOpenTrackerClicked() {
  const settings = await saveSettings();
  const url = settings.trackerUrl || DEFAULT_TRACKER_URL;
  await chrome.tabs.create({ url });
  setStatus("Opened tracker tab. Auto-import runs on load when URL has no #data= hash.");
}

[trackerUrlInput, daysBackInput, maxItemsInput, taskTypeInput].forEach((el) => {
  el.addEventListener("change", () => {
    void saveSettings();
  });
});

importBtn.addEventListener("click", () => {
  void onImportClicked();
});

openTrackerBtn.addEventListener("click", () => {
  void onOpenTrackerClicked();
});

void loadSettings();
