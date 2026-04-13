const SETTINGS_KEY = "trackerHistoryImporter.settings";
const DEFAULT_SETTINGS = {
  daysBack: 7,
  maxItems: 20,
  taskType: "short",
};

const autoImportedByTab = new Map();

function clamp(value, min, max, fallback) {
  const num = Number.parseInt(String(value), 10);
  if (Number.isNaN(num)) return fallback;
  return Math.min(max, Math.max(min, num));
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

function isTrackerUrlWithoutDataHash(rawUrl) {
  try {
    const url = new URL(rawUrl);
    const isTracker = url.pathname === "/tracker" || url.pathname === "/tracker/";
    const hasDataHash = url.hash.startsWith("#data=");
    return isTracker && !hasDataHash;
  } catch {
    return false;
  }
}

async function getSettings() {
  const result = await chrome.storage.sync.get([SETTINGS_KEY]);
  const settings = result[SETTINGS_KEY] || {};

  return {
    daysBack: clamp(settings.daysBack ?? DEFAULT_SETTINGS.daysBack, 1, 60, DEFAULT_SETTINGS.daysBack),
    maxItems: clamp(settings.maxItems ?? DEFAULT_SETTINGS.maxItems, 1, 100, DEFAULT_SETTINGS.maxItems),
    taskType: settings.taskType === "medium" || settings.taskType === "long" ? settings.taskType : DEFAULT_SETTINGS.taskType,
  };
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

async function dispatchImportToTab(tabId, payload) {
  await chrome.scripting.executeScript({
    target: { tabId },
    func: (detail) => {
      const event = new CustomEvent("tracker-external-import", {
        detail,
      });
      document.dispatchEvent(event);
    },
    args: [payload],
  });
}

async function autoImportHistoryToTracker(tabId, rawUrl) {
  const lastImportedUrl = autoImportedByTab.get(tabId);
  if (lastImportedUrl === rawUrl) {
    return;
  }

  const settings = await getSettings();
  const historyTasks = await getRecentHistory(settings.daysBack, settings.maxItems);
  if (historyTasks.length === 0) {
    return;
  }

  const payload = {
    source: "Browser history auto-import",
    showToasts: false,
    tasks: historyTasks.map((task) => ({
      title: task.title,
      description: task.description,
      type: settings.taskType,
    })),
  };

  await dispatchImportToTab(tabId, payload);
  autoImportedByTab.set(tabId, rawUrl);
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete") return;

  const currentUrl = tab.url;
  if (!currentUrl || !isTrackerUrlWithoutDataHash(currentUrl)) return;

  void autoImportHistoryToTracker(tabId, currentUrl);
});

chrome.tabs.onRemoved.addListener((tabId) => {
  autoImportedByTab.delete(tabId);
});
