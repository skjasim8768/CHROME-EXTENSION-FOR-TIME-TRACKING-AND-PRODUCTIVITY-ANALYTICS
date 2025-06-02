let currentHost = "";
let startTime = Date.now();

// Get current active tab URL
async function getActiveTabHost() {
  const tabs = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  if (tabs[0] && tabs[0].url.startsWith("http")) {
    return new URL(tabs[0].url).hostname;
  }
  return null;
}

// Save time spent on previous site
async function logTime() {
  if (!currentHost) return;
  const timeSpent = Math.floor((Date.now() - startTime) / 1000); 

  const key = `time_${currentHost}`;
  chrome.storage.local.get([key], (result) => {
    const previous = result[key] || 0;
    chrome.storage.local.set({ [key]: previous + timeSpent });
    console.log(`⏱️ Logged ${timeSpent}s on ${currentHost}`);
  });
}

// Detect tab switch
chrome.tabs.onActivated.addListener(async () => {
  await logTime();
  currentHost = await getActiveTabHost();
  startTime = Date.now();
});

// Detect tab URL update
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (tab.active && changeInfo.status === "complete") {
    await logTime();
    currentHost = new URL(tab.url).hostname;
    startTime = Date.now();
  }
});

// Detect when user becomes idle
chrome.idle.onStateChanged.addListener(async (newState) => {
  if (newState === "idle" || newState === "locked") {
    await logTime();
    currentHost = "";
  } else if (newState === "active") {
    currentHost = await getActiveTabHost();
    startTime = Date.now();
  }
});
