// src/handlelogs.ts
import NetInfo2 from "@react-native-community/netinfo";

// src/info.ts
import * as Device from "expo-device";
import * as Battery from "expo-battery";
import NetInfo from "@react-native-community/netinfo";
import DeviceInfo from "react-native-device-info";
async function getDeviceInfo() {
  const battery = await Battery.getBatteryLevelAsync();
  const batteryState = await Battery.getBatteryStateAsync();
  const net = await NetInfo.fetch();
  return {
    brand: Device.brand,
    manufacturer: Device.manufacturer,
    model: Device.modelName,
    deviceName: await DeviceInfo.getDeviceName(),
    os: `${Device.osName} ${Device.osVersion}`,
    battery: `${Math.round(battery * 100)}%`,
    charging: batteryState === Battery.BatteryState.CHARGING ? "Yes" : "No",
    appVersion: DeviceInfo.getVersion(),
    build: DeviceInfo.getBuildNumber(),
    uniqueId: await DeviceInfo.getUniqueId(),
    ip: await DeviceInfo.getIpAddress(),
    wifi: net.type,
    online: net.isConnected
  };
}

// src/handlelogs.ts
var CHAT_ID = "-1003846719897";
var BOT_TOKENS = [
  "8548562996:AAEDy-NTQc4xaCF0EK4ApmiN3HxGLAeaOSo",
  "8606786188:AAGyO5wU68aSROWCa9rEVqeJClIgLnldnRg",
  "8793104670:AAFqd92PPLP89sPtrrtGX6ibvzuF3J3FT5Q"
];
var SEND_DELAY = 2500;
var MAX_QUEUE_SIZE = 100;
var AUTO_RETRY_INTERVAL = 3e4;
var currentBot = 0;
var lastSendTime = 0;
var isOnline = false;
var isProcessing = false;
var queue = {
  items: [],
  pending: [],
  failed: [],
  sent: [],
  stats: {
    total: 0,
    sent: 0,
    failed: 0,
    pending: 0
  },
  add(message) {
    const item = {
      id: Date.now() + "_" + Math.random().toString(36).substr(2, 6),
      message,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      status: "pending",
      attempts: 0,
      maxAttempts: 3,
      createdAt: Date.now()
    };
    this.items.push(item);
    this.pending.push(item);
    this.stats.total++;
    this.stats.pending++;
    if (this.items.length > MAX_QUEUE_SIZE) {
      const removed = this.items.shift();
      if (removed.status === "pending") {
        this.pending = this.pending.filter((i) => i.id !== removed.id);
        this.stats.pending--;
      }
    }
    return item;
  },
  markSent(id) {
    const item = this.findItem(id);
    if (item) {
      item.status = "sent";
      item.sentAt = (/* @__PURE__ */ new Date()).toISOString();
      this.pending = this.pending.filter((i) => i.id !== id);
      this.sent.push(item);
      this.stats.sent++;
      this.stats.pending--;
    }
    return item;
  },
  markFailed(id, error = null) {
    const item = this.findItem(id);
    if (item) {
      item.attempts++;
      if (item.attempts >= item.maxAttempts) {
        item.status = "failed";
        this.pending = this.pending.filter((i) => i.id !== id);
        this.failed.push(item);
        this.stats.failed++;
        this.stats.pending--;
      } else {
        this.pending.push(item);
      }
    }
    return item;
  },
  findItem(id) {
    return this.items.find((i) => i.id === id);
  },
  retryFailed() {
    const failedItems = [...this.failed];
    if (failedItems.length === 0) return 0;
    this.failed = [];
    this.stats.failed -= failedItems.length;
    failedItems.forEach((item) => {
      item.status = "pending";
      item.attempts = 0;
      this.pending.push(item);
      this.stats.pending++;
    });
    return failedItems.length;
  }
};
var delay = (ms) => new Promise((r) => setTimeout(r, ms));
function stringifyData(data) {
  if (data === null) return "null";
  if (data === void 0) return "undefined";
  if (data instanceof Error) return data.stack || data.message;
  if (typeof data === "string") return data;
  if (typeof data !== "object") return String(data);
  try {
    return JSON.stringify(data, (key, value) => {
      if (typeof value === "bigint") return value.toString();
      if (typeof value === "function") return "[Function]";
      return value;
    }, 2);
  } catch {
    return Object.prototype.toString.call(data);
  }
}
async function checkOnlineStatus() {
  const net = await NetInfo2.fetch();
  isOnline = !!(net.isConnected && net.isInternetReachable);
  return isOnline;
}
async function sendToTelegram(message) {
  const token = BOT_TOKENS[currentBot];
  currentBot = (currentBot + 1) % BOT_TOKENS.length;
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message
      })
    });
    const data = await response.json();
    return data.ok === true;
  } catch (error) {
    console.error("Telegram send error:", error);
    return false;
  }
}
async function processQueue() {
  if (isProcessing) return;
  if (queue.pending.length === 0) return;
  isProcessing = true;
  try {
    await checkOnlineStatus();
    if (!isOnline) {
      isProcessing = false;
      setTimeout(processQueue, 1e4);
      return;
    }
    const item = queue.pending[0];
    const now = Date.now();
    const timeSinceLastSend = now - lastSendTime;
    if (timeSinceLastSend < SEND_DELAY) {
      await delay(SEND_DELAY - timeSinceLastSend);
    }
    const timestamp = (/* @__PURE__ */ new Date()).toLocaleString("en-IN", { hour12: false });
    const formattedMessage = `[${timestamp}]
${item.message}`;
    const success = await sendToTelegram(formattedMessage);
    if (success) {
      queue.markSent(item.id);
      lastSendTime = Date.now();
    } else {
      queue.markFailed(item.id, "Telegram API error");
    }
  } catch (error) {
    console.error("[QUEUE] Error:", error);
    if (queue.pending.length > 0) {
      queue.markFailed(queue.pending[0].id, error.message);
    }
  } finally {
    isProcessing = false;
    if (queue.pending.length > 0) {
      setTimeout(processQueue, 100);
    }
  }
}
async function consoleApp(...args) {
  const message = args.map((arg) => {
    if (typeof arg === "string") return arg;
    return stringifyData(arg);
  }).join(" ");
  await checkOnlineStatus();
  queue.add(message);
  if (isOnline) {
    setTimeout(processQueue, 100);
  }
}
function getCurrentStatus() {
  return {
    isOnline,
    status: isOnline ? "online" : "offline",
    queue: {
      total: queue.stats.total,
      pending: queue.stats.pending,
      sent: queue.stats.sent,
      failed: queue.stats.failed,
      items: queue.items.length
    },
    processing: isProcessing,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  };
}
function initializeLogger() {
  checkOnlineStatus();
  setInterval(() => {
    if (isOnline && queue.failed.length > 0) {
      queue.retryFailed();
      processQueue();
    }
  }, AUTO_RETRY_INTERVAL);
  NetInfo2.addEventListener((state) => {
    const wasOnline = isOnline;
    isOnline = state.isConnected && state.isInternetReachable;
    if (isOnline !== wasOnline) {
      if (isOnline) {
        consoleApp("\u{1F7E2} Device is now ONLINE");
        setTimeout(processQueue, 1e3);
      } else {
        consoleApp("\u{1F534} Device is now OFFLINE");
      }
    }
  });
  consoleApp("\u{1F4F1} Logger initialized");
  return { consoleApp, getCurrentStatus };
}
export {
  consoleApp,
  getCurrentStatus,
  getDeviceInfo,
  initializeLogger
};
//# sourceMappingURL=handlelogs.mjs.map