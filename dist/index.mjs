var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/@react-native/assets-registry/registry.js
var require_registry = __commonJS({
  "node_modules/@react-native/assets-registry/registry.js"(exports, module) {
    "use strict";
    var assets = [];
    function registerAsset(asset) {
      return assets.push(asset);
    }
    function getAssetByID3(assetId) {
      return assets[assetId - 1];
    }
    module.exports = { registerAsset, getAssetByID: getAssetByID3 };
  }
});

// node_modules/expo-modules-core/src/errors/CodedError.ts
var CodedError;
var init_CodedError = __esm({
  "node_modules/expo-modules-core/src/errors/CodedError.ts"() {
    CodedError = class extends Error {
      code;
      info;
      constructor(code, message) {
        super(message);
        this.code = code;
      }
    };
  }
});

// node_modules/expo-modules-core/src/NativeModulesProxy.ts
var NativeModulesProxy_default;
var init_NativeModulesProxy = __esm({
  "node_modules/expo-modules-core/src/NativeModulesProxy.ts"() {
    NativeModulesProxy_default = {};
  }
});

// node_modules/expo-modules-core/src/TurboModuleToExpoModuleProxy.ts
function createTurboModuleToExpoProxy(turboModule, name) {
  return null;
}
var init_TurboModuleToExpoModuleProxy = __esm({
  "node_modules/expo-modules-core/src/TurboModuleToExpoModuleProxy.ts"() {
  }
});

// node_modules/expo-modules-core/src/ensureNativeModulesAreInstalled.ts
function ensureNativeModulesAreInstalled() {
}
var init_ensureNativeModulesAreInstalled = __esm({
  "node_modules/expo-modules-core/src/ensureNativeModulesAreInstalled.ts"() {
  }
});

// node_modules/expo-modules-core/src/requireNativeModule.ts
import { TurboModuleRegistry } from "react-native";
function requireNativeModule(moduleName) {
  const nativeModule = requireOptionalNativeModule(moduleName);
  if (!nativeModule) {
    throw new Error(`Cannot find native module '${moduleName}'`);
  }
  return nativeModule;
}
function requireOptionalNativeModule(moduleName) {
  ensureNativeModulesAreInstalled();
  try {
    return globalThis.expo?.modules?.[moduleName] ?? NativeModulesProxy_default[moduleName] ?? createTurboModuleToExpoProxy(TurboModuleRegistry.get(moduleName), moduleName) ?? null;
  } catch (e) {
    const error = e;
    console.warn(`An error occurred while requiring the '${moduleName}' module: ${error.message}`);
    return null;
  }
}
var init_requireNativeModule = __esm({
  "node_modules/expo-modules-core/src/requireNativeModule.ts"() {
    init_NativeModulesProxy();
    init_TurboModuleToExpoModuleProxy();
    init_ensureNativeModulesAreInstalled();
  }
});

// node_modules/expo-modules-core/src/sweet/setUpJsLogger.fx.ts
var init_setUpJsLogger_fx = __esm({
  "node_modules/expo-modules-core/src/sweet/setUpJsLogger.fx.ts"() {
    init_CodedError();
    init_requireNativeModule();
    if (__DEV__ && typeof window !== "undefined" && (process.env.EXPO_OS === "android" || process.env.EXPO_OS === "ios")) {
      const NativeJSLogger = requireOptionalNativeModule("ExpoModulesCoreJSLogger");
      if (NativeJSLogger) {
        const onNewException = {
          eventName: "ExpoModulesCoreJSLogger.onNewError",
          action: console.error
        };
        const onNewWarning = {
          eventName: "ExpoModulesCoreJSLogger.onNewWarning",
          action: console.warn
        };
        const onNewDebug = {
          eventName: "ExpoModulesCoreJSLogger.onNewDebug",
          action: console.debug
        };
        const onNewInfo = {
          eventName: "ExpoModulesCoreJSLogger.onNewInfo",
          action: console.info
        };
        const onNewTrace = {
          eventName: "ExpoModulesCoreJSLogger.onNewTrace",
          action: console.trace
        };
        const listeners = [
          onNewException,
          onNewWarning,
          onNewDebug,
          onNewInfo,
          onNewTrace
        ];
        for (const listener of listeners) {
          NativeJSLogger.addListener(listener.eventName, ({ message }) => {
            listener.action(message);
          });
        }
      }
    }
    globalThis.ExpoModulesCore_CodedError = CodedError;
  }
});

// node_modules/expo-modules-core/src/environment/browser.ts
var isDOMAvailable, canUseEventListeners, canUseViewport, isAsyncDebugging;
var init_browser = __esm({
  "node_modules/expo-modules-core/src/environment/browser.ts"() {
    isDOMAvailable = false;
    canUseEventListeners = false;
    canUseViewport = false;
    isAsyncDebugging = false;
    if (__DEV__) {
      isAsyncDebugging = !global.nativeExtensions && !global.nativeCallSyncHook && !global.RN$Bridgeless;
    }
  }
});

// node_modules/expo-modules-core/src/Platform.ts
import { Platform as ReactNativePlatform } from "react-native";
var nativeSelect, Platform4, Platform_default;
var init_Platform = __esm({
  "node_modules/expo-modules-core/src/Platform.ts"() {
    init_browser();
    if (__DEV__ && typeof process.env.EXPO_OS === "undefined") {
      console.warn(
        `The global process.env.EXPO_OS is not defined. This should be inlined by babel-preset-expo during transformation.`
      );
    }
    nativeSelect = typeof window !== "undefined" ? ReactNativePlatform.select : (
      // process.env.EXPO_OS is injected by `babel-preset-expo` and available in both client and `react-server` environments.
      // Opt to use the env var when possible, and fallback to the React Native Platform module when it's not (arbitrary bundlers and transformers).
      function select(specifics) {
        if (!process.env.EXPO_OS) return void 0;
        if (specifics.hasOwnProperty(process.env.EXPO_OS)) {
          return specifics[process.env.EXPO_OS];
        } else if (process.env.EXPO_OS !== "web" && specifics.hasOwnProperty("native")) {
          return specifics.native;
        } else if (specifics.hasOwnProperty("default")) {
          return specifics.default;
        }
        return void 0;
      }
    );
    Platform4 = {
      /**
       * Denotes the currently running platform.
       * Can be one of ios, android, web.
       */
      OS: process.env.EXPO_OS || ReactNativePlatform.OS,
      /**
       * Returns the value with the matching platform.
       * Object keys can be any of ios, android, native, web, default.
       *
       * @ios ios, native, default
       * @android android, native, default
       * @web web, default
       */
      select: nativeSelect,
      /**
       * Denotes if the DOM API is available in the current environment.
       * The DOM is not available in native React runtimes and Node.js.
       */
      isDOMAvailable,
      /**
       * Denotes if the current environment can attach event listeners
       * to the window. This will return false in native React
       * runtimes and Node.js.
       */
      canUseEventListeners,
      /**
       * Denotes if the current environment can inspect properties of the
       * screen on which the current window is being rendered. This will
       * return false in native React runtimes and Node.js.
       */
      canUseViewport,
      /**
       * If the JavaScript is being executed in a remote JavaScript environment.
       * When `true`, synchronous native invocations cannot be executed.
       */
      isAsyncDebugging
    };
    Platform_default = Platform4;
  }
});

// node_modules/expo-modules-core/src/registerWebModule.ts
var init_registerWebModule = __esm({
  "node_modules/expo-modules-core/src/registerWebModule.ts"() {
  }
});

// node_modules/expo-modules-core/src/TypedArrays.types.ts
var init_TypedArrays_types = __esm({
  "node_modules/expo-modules-core/src/TypedArrays.types.ts"() {
  }
});

// node_modules/expo-modules-core/src/PermissionsInterface.ts
var init_PermissionsInterface = __esm({
  "node_modules/expo-modules-core/src/PermissionsInterface.ts"() {
  }
});

// node_modules/expo-modules-core/src/PermissionsHook.ts
import { useCallback as useCallback2, useEffect as useEffect2, useRef as useRef2, useState as useState2 } from "react";
var init_PermissionsHook = __esm({
  "node_modules/expo-modules-core/src/PermissionsHook.ts"() {
    "use client";
  }
});

// node_modules/expo-modules-core/src/Refs.ts
import { createRef } from "react";
var init_Refs = __esm({
  "node_modules/expo-modules-core/src/Refs.ts"() {
  }
});

// node_modules/expo-modules-core/src/hooks/useReleasingSharedObject.ts
import { useEffect as useEffect3, useMemo, useRef as useRef3 } from "react";
function useReleasingSharedObject(factory, dependencies) {
  const objectRef = useRef3(null);
  const objectRefToRelease = useRef3(null);
  const isFastRefresh = useRef3(false);
  const previousDependencies = useRef3(dependencies);
  if (objectRef.current == null) {
    objectRef.current = factory();
  }
  const object = useMemo(() => {
    let newObject = objectRef.current;
    const dependenciesAreEqual = previousDependencies.current?.length === dependencies.length && dependencies.every((value, index) => value === previousDependencies.current[index]);
    if (!newObject || !dependenciesAreEqual) {
      objectRefToRelease.current = objectRef.current;
      newObject = factory();
      objectRef.current = newObject;
      previousDependencies.current = dependencies;
    }
    return newObject;
  }, dependencies);
  useEffect3(() => {
    if (objectRefToRelease.current) {
      objectRefToRelease.current.release();
      objectRefToRelease.current = null;
    }
  }, [object]);
  useMemo(() => {
    isFastRefresh.current = true;
  }, []);
  useEffect3(() => {
    isFastRefresh.current = false;
    return () => {
      if (!isFastRefresh.current && objectRef.current) {
        objectRef.current.release();
      }
    };
  }, []);
  return object;
}
var init_useReleasingSharedObject = __esm({
  "node_modules/expo-modules-core/src/hooks/useReleasingSharedObject.ts"() {
    "use client";
  }
});

// node_modules/expo-modules-core/src/reload.ts
var init_reload = __esm({
  "node_modules/expo-modules-core/src/reload.ts"() {
  }
});

// node_modules/expo-modules-core/src/index.ts
var init_src = __esm({
  "node_modules/expo-modules-core/src/index.ts"() {
    init_setUpJsLogger_fx();
    init_Platform();
    init_requireNativeModule();
    init_registerWebModule();
    init_TypedArrays_types();
    init_PermissionsInterface();
    init_PermissionsHook();
    init_Refs();
    init_useReleasingSharedObject();
    init_reload();
  }
});

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
  time: "19b10003-e8f2-537e-4f6c-d104768a1214",
  hardware: "19b10004-e8f2-537e-4f6c-d104768a1214"
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
var RawPayloadSchema = z.string().trim().refine((val) => val.split(",").length === 6, {
  message: "Payload must contain exactly 6 comma-separated fields"
});
var HealthReadingSchema = z.object({
  hr: z.number().finite().min(0).max(300),
  spo2: z.number().finite().min(0).max(100),
  tempC: z.number().finite().min(-20).max(60),
  battery: z.number().finite().min(0).max(100),
  steps: z.number().finite().min(0),
  hrv: z.number().finite().min(0).max(200)
});
var HealthMetricsSchema = z.object({
  heartRate: z.object({
    value: z.number(),
    measuring: z.boolean()
    // true while hr is 0 / not yet available from the device
  }),
  spo2: z.object({
    value: z.number(),
    measuring: z.boolean()
  }),
  temperature: z.object({
    celsius: z.number(),
    fahrenheit: z.number(),
    kelvin: z.number(),
    bodyTemperatureStatus: z.union([
      z.enum(["Low", "Slightly Low", "Normal", "Elevated", "Fever"]),
      z.literal("N/A")
    ]),
    measuring: z.boolean()
  }),
  battery: z.number(),
  measuring: z.boolean(),
  // true if ANY of hr/spo2/temp is currently 0 / unavailable
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
    stressScore: z.union([z.number().min(0).max(100), z.literal("N/A")]),
    stressLevel: z.union([
      z.enum(["Relaxed", "Normal", "Elevated", "High"]),
      z.literal("N/A")
    ]),
    readinessScore: z.union([z.number().min(0).max(100), z.literal("N/A")]),
    productivityScore: z.union([z.number().min(0).max(100), z.literal("N/A")]),
    overallHealthScore: z.union([z.number().min(0).max(100), z.literal("N/A")]),
    energyScore: z.union([z.number().min(0).max(100), z.literal("N/A")])
  }),
  bloodPressure: z.object({
    systolic: z.union([z.number().min(80).max(200), z.literal("N/A")]),
    diastolic: z.union([z.number().min(40).max(130), z.literal("N/A")]),
    map: z.union([z.number().min(50).max(150), z.literal("N/A")]),
    confidence: z.union([z.number().min(0).max(100), z.literal("N/A")]),
    measuring: z.boolean()
  }),
  hrv: z.object({
    value: z.union([z.number().min(0).max(200), z.literal("N/A")]),
    measuring: z.boolean()
  }),
  vo2Max: z.object({
    value: z.union([z.number().min(0).max(100), z.literal("N/A")]),
    level: z.union([
      z.enum(["Poor", "Below Average", "Average", "Above Average", "Excellent"]),
      z.literal("N/A")
    ]),
    measuring: z.boolean()
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
function estimateBP({ hr, hrv, age, height, weight, sex, spo2, temperature }) {
  if (!Number.isFinite(hr) || !Number.isFinite(hrv) || !Number.isFinite(age) || !Number.isFinite(height) || !Number.isFinite(weight)) {
    throw new Error("Invalid BP input");
  }
  const heightM = height / 100;
  const bmi = weight / (heightM * heightM);
  const sexFactor = sex === "male" ? 2 : 0;
  let systolic = 95 + age * 0.35 + bmi * 0.45 + hr * 0.12 + sexFactor - hrv * 0.05;
  let diastolic = 58 + age * 0.2 + bmi * 0.25 + hr * 0.06 + sexFactor * 0.4 - hrv * 0.025;
  systolic = Math.round(Math.max(80, Math.min(200, systolic)));
  diastolic = Math.round(Math.max(40, Math.min(130, diastolic)));
  const map = Math.round(diastolic + (systolic - diastolic) / 3);
  let confidence = 50;
  if (spo2 >= 95) confidence += 10;
  if (hr >= 50 && hr <= 100) confidence += 10;
  if (hrv > 20) confidence += 10;
  if (temperature >= 36 && temperature <= 38) confidence += 5;
  confidence = Math.min(100, confidence);
  return {
    systolic,
    diastolic,
    map,
    confidence
  };
}
function calculateStress({ hr, hrv, spo2, temperature, activity = 0 }) {
  const hrStress = Math.min(100, Math.max(0, (hr - 60) / 60 * 100));
  const hrvStress = Math.min(100, Math.max(0, (60 - hrv) / 60 * 100));
  const spo2Stress = Math.min(100, Math.max(0, (95 - spo2) * 20));
  const temperatureStress = Math.min(100, Math.abs(temperature - 36.7) * 20);
  const activityFactor = Math.min(100, Math.max(0, activity));
  let stress = hrStress * 0.3 + hrvStress * 0.4 + spo2Stress * 0.05 + temperatureStress * 0.05 + activityFactor * 0.2;
  stress = Math.round(Math.max(0, Math.min(100, stress)));
  let level;
  if (stress < 25) {
    level = "Relaxed";
  } else if (stress < 50) {
    level = "Normal";
  } else if (stress < 75) {
    level = "Elevated";
  } else {
    level = "High";
  }
  return {
    score: stress,
    level
  };
}
function estimateVO2Max({ hr, hrv, age, sex, restingHr = 60, maxHr = 220 }) {
  if (!Number.isFinite(hr) || !Number.isFinite(hrv) || !Number.isFinite(age) || !Number.isFinite(restingHr) || !Number.isFinite(maxHr)) {
    throw new Error("Invalid VO2Max input");
  }
  const hrReserve = maxHr - restingHr;
  const hrRatio = (hr - restingHr) / hrReserve;
  let baseVO2Max = sex === "male" ? 60 - age * 0.5 : 48 - age * 0.4;
  const hrvFactor = Math.min(1.3, Math.max(0.7, hrv / 50));
  const hrFactor = Math.max(0.5, 1.5 - hrRatio);
  let vo2Max = baseVO2Max * hrvFactor * hrFactor;
  vo2Max = Math.round(Math.max(15, Math.min(85, vo2Max)));
  let level;
  if (sex === "male") {
    if (vo2Max < 35) level = "Poor";
    else if (vo2Max < 42) level = "Below Average";
    else if (vo2Max < 50) level = "Average";
    else if (vo2Max < 60) level = "Above Average";
    else level = "Excellent";
  } else {
    if (vo2Max < 30) level = "Poor";
    else if (vo2Max < 37) level = "Below Average";
    else if (vo2Max < 44) level = "Average";
    else if (vo2Max < 52) level = "Above Average";
    else level = "Excellent";
  }
  return {
    value: vo2Max,
    level
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
  hardwareSubscription;
  monitorRestartTimer;
  monitorStartedAt;
  connectionPromise;
  hrFilter;
  spo2Filter;
  tempFilter;
  hrvFilter;
  constructor() {
    this.manager = new BleManager({
      restoreStateIdentifier: "BleBackgroundRestoreId"
    });
    this.device = null;
    this.subscription = null;
    this.hardwareSubscription = null;
    this.monitorRestartTimer = null;
    this.monitorStartedAt = null;
    this.connectionPromise = null;
    this._resetFilters();
  }
  /* ============================================================
     RESET FILTERS
  ============================================================ */
  _resetFilters() {
    this.hrFilter = new KalmanFilter({
      R: 4,
      Q: 0.05
    });
    this.spo2Filter = new KalmanFilter({
      R: 2,
      Q: 0.02
    });
    this.tempFilter = new KalmanFilter({
      R: 0.5,
      Q: 0.01
    });
    this.hrvFilter = new KalmanFilter({
      R: 10,
      Q: 0.1
    });
  }
  /* ============================================================
     PERMISSIONS
  ============================================================ */
  async requestPermissions() {
    if (Platform.OS !== "android") {
      return true;
    }
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
  /* ============================================================
     BLUETOOTH STATE
  ============================================================ */
  onStateChange(callback, emitCurrentState = true) {
    return this.manager.onStateChange(callback, emitCurrentState);
  }
  /* ============================================================
     SCAN
  ============================================================ */
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
  /* ============================================================
     CONNECT
  ============================================================ */
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
  /* ============================================================
     AUTO CONNECT
  ============================================================ */
  async autoConnect(deviceId) {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      throw new Error("Bluetooth permission denied");
    }
    const parsed = DeviceIdSchema.safeParse(deviceId);
    if (!parsed.success) {
      throw new Error(
        `autoConnect() invalid deviceId: ${parsed.error.message}`
      );
    }
    if (this.connectionPromise) {
      return this.connectionPromise;
    }
    await this.rememberDeviceId(parsed.data);
    this.connectionPromise = (async () => {
      try {
        this.stopMonitoring();
        const currentDeviceIsConnected = this.device?.id === parsed.data && await this.isConnected();
        const connectedDevices = currentDeviceIsConnected ? [] : await this.manager.connectedDevices([SERVICE_UUID]);
        this.device = (currentDeviceIsConnected ? this.device : null) || connectedDevices.find((device) => device.id === parsed.data) || await this.manager.connectToDevice(parsed.data, {
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
        this.stopReceivingHardwareData();
        this.device = null;
        throw err;
      } finally {
        this.connectionPromise = null;
      }
    })();
    return this.connectionPromise;
  }
  /* ============================================================
     FORCE RECONNECT
  ============================================================ */
  async forceReconnect(deviceId) {
    console.log("Forcing hard reconnect due to stale GATT state");
    this.stopMonitoring();
    this.stopReceivingHardwareData();
    if (this.device) {
      try {
        await this.device.cancelConnection();
      } catch (err) {
        console.log(
          "cancelConnection during forceReconnect failed:",
          this.describeBleError(err)
        );
      }
    }
    this.device = null;
    this.connectionPromise = null;
    await new Promise((resolve) => setTimeout(resolve, 500));
    return this.autoConnect(deviceId);
  }
  /* ============================================================
     IS CONNECTED
  ============================================================ */
  async isConnected() {
    if (!this.device) return false;
    try {
      return await this.device.isConnected();
    } catch (err) {
      console.log("isConnected check failed:", err);
      return false;
    }
  }
  /* ============================================================
     DISCONNECT
  ============================================================ */
  async disconnect() {
    if (!this.device) return;
    this.stopMonitoring();
    this.stopReceivingHardwareData();
    await this.device.cancelConnection();
    this.device = null;
    await this.clearRememberedDeviceId();
  }
  /* ============================================================
     HEALTH METRICS
  ============================================================ */
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
      waterIntakeLiters = 0,
      age = 30,
      height = 170,
      weight = 70,
      sex = "male"
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
          if (this.isServiceNotFoundError(error)) {
            const staleDeviceId = this.device?.id;
            this.clearMonitorRestart();
            if (staleDeviceId) {
              this.monitorRestartTimer = setTimeout(() => {
                this.monitorRestartTimer = null;
                this.forceReconnect(staleDeviceId).then(() => {
                  this.monitorHealthMetrics(callback, {
                    ...options,
                    replaceExisting: false
                  });
                }).catch(
                  (err) => console.log(
                    "forceReconnect after service-not-found failed:",
                    this.describeBleError(err)
                  )
                );
              }, restartDelay);
            }
            callback(error, null);
            return;
          }
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
              new Error(
                `Invalid BLE payload "${raw}": ${rawResult.error.message}`
              ),
              null
            );
            return;
          }
          const parts = rawResult.data.split(",");
          const [hr, spo2, tempC, battery, steps, hrv] = parts.map(Number);
          const readingResult = HealthReadingSchema.safeParse({
            hr,
            spo2,
            tempC,
            battery,
            steps,
            hrv
          });
          if (!readingResult.success) {
            callback(
              new Error(
                `BLE payload out of range "${raw}": ${readingResult.error.message}`
              ),
              null
            );
            return;
          }
          const {
            hr: validHr,
            spo2: validSpo2,
            tempC: validTempC,
            battery: validBattery,
            steps: validSteps,
            hrv: validHrv
          } = readingResult.data;
          const hrHasReading = validHr > 0;
          const spo2HasReading = validSpo2 > 0;
          const tempHasReading = validTempC > 0;
          const hrvHasReading = validHrv > 0;
          if (hrHasReading) {
            this.hrFilter.filter(validHr);
          }
          if (spo2HasReading) {
            this.spo2Filter.filter(validSpo2);
          }
          if (tempHasReading) {
            this.tempFilter.filter(validTempC);
          }
          if (hrvHasReading) {
            this.hrvFilter.filter(validHrv);
          }
          const hrReady = this.hrFilter.value !== null;
          const spo2Ready = this.spo2Filter.value !== null;
          const tempReady = this.tempFilter.value !== null;
          const hrvReady = this.hrvFilter.value !== null;
          const allReady = hrReady && spo2Ready && tempReady && hrvReady;
          const hrMeasuring = !hrReady;
          const spo2Measuring = !spo2Ready;
          const tempMeasuring = !tempReady;
          const hrvMeasuring = !hrvReady;
          const smoothedHr = hrReady ? Math.round(this.hrFilter.value) : 0;
          const smoothedSpo2 = spo2Ready ? Math.round(this.spo2Filter.value) : 0;
          const smoothedTempC = tempReady ? Number(this.tempFilter.value.toFixed(2)) : 0;
          const smoothedHrv = hrvReady ? Math.round(this.hrvFilter.value) : 0;
          const tempF = Number((smoothedTempC * 9 / 5 + 32).toFixed(2));
          const tempK = Number((smoothedTempC + 273.15).toFixed(2));
          const calories = Number((validSteps * 0.04).toFixed(2));
          const distance = Number((validSteps * 0.75 / 1e3).toFixed(2));
          const rawStress = allReady ? calculateStress({
            hr: smoothedHr,
            hrv: smoothedHrv,
            spo2: smoothedSpo2,
            temperature: smoothedTempC,
            activity: 0
          }) : {
            score: 0,
            level: "Normal"
          };
          const bpEstimate = allReady ? estimateBP({
            hr: smoothedHr,
            hrv: smoothedHrv,
            age,
            height,
            weight,
            sex,
            spo2: smoothedSpo2,
            temperature: smoothedTempC
          }) : null;
          const bloodPressure = bpEstimate ? {
            ...bpEstimate,
            measuring: false
          } : {
            systolic: "N/A",
            diastolic: "N/A",
            map: "N/A",
            confidence: "N/A",
            measuring: true
          };
          const vo2MaxEstimate = allReady ? estimateVO2Max({
            hr: smoothedHr,
            hrv: smoothedHrv,
            age,
            sex
          }) : null;
          const vo2Max = vo2MaxEstimate ? {
            ...vo2MaxEstimate,
            measuring: false
          } : {
            value: "N/A",
            level: "N/A",
            measuring: true
          };
          const elapsedHours = this.monitorStartedAt ? (Date.now() - this.monitorStartedAt) / 36e5 : 0;
          const healthScores = calculateHealthScores({
            hr: smoothedHr,
            spo2: smoothedSpo2,
            tempC: smoothedTempC,
            steps: validSteps,
            calories,
            distance,
            stressScore: rawStress.score,
            elapsedHours,
            goalSteps,
            goalCalories,
            goalDistance,
            goalWalkingSpeedKmh,
            waterGoalLiters,
            waterIntakeLiters
          });
          const healthMetrics = {
            heartRate: {
              value: smoothedHr,
              measuring: hrMeasuring
            },
            spo2: {
              value: smoothedSpo2,
              measuring: spo2Measuring
            },
            temperature: {
              celsius: smoothedTempC,
              fahrenheit: tempF,
              kelvin: tempK,
              bodyTemperatureStatus: tempReady ? healthScores.bodyTemperatureStatus : "N/A",
              measuring: tempMeasuring
            },
            battery: validBattery,
            measuring: hrMeasuring || spo2Measuring || tempMeasuring || hrvMeasuring,
            ppg: {
              steps: validSteps,
              calories,
              distance,
              walkingSpeedKmh: healthScores.walkingSpeedKmh,
              goal: healthScores.goal
            },
            stress: {
              stressScore: allReady ? rawStress.score : "N/A",
              stressLevel: allReady ? rawStress.level : "N/A",
              readinessScore: allReady ? healthScores.readinessScore : "N/A",
              productivityScore: allReady ? healthScores.productivityScore : "N/A",
              overallHealthScore: allReady ? healthScores.overallHealthScore : "N/A",
              energyScore: allReady ? healthScores.energyScore : "N/A"
            },
            bloodPressure: {
              systolic: bloodPressure.systolic,
              diastolic: bloodPressure.diastolic,
              map: bloodPressure.map,
              confidence: bloodPressure.confidence,
              measuring: bloodPressure.measuring
            },
            hrv: {
              value: allReady ? smoothedHrv : "N/A",
              measuring: hrvMeasuring
            },
            vo2Max: {
              value: vo2Max.value,
              level: vo2Max.level,
              measuring: vo2Max.measuring
            },
            activityLevel: healthScores.activityLevel,
            hydrationReminder: healthScores.hydrationReminder
          };
          const outputResult = HealthMetricsSchema.safeParse(healthMetrics);
          if (!outputResult.success) {
            callback(
              new Error(
                `Failed to build healthMetrics object: ${outputResult.error.message}`
              ),
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
    return this.subscription;
  }
  /* ============================================================
     STOP HEALTH MONITOR
  ============================================================ */
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
  /* ============================================================
     HARDWARE DATA
  ============================================================ */
  async receiveHardwareData(callback) {
    if (!this.device) {
      callback(null, new Error("No Device Connected"));
      return null;
    }
    this.stopReceivingHardwareData();
    try {
      this.hardwareSubscription = this.device.monitorCharacteristicForService(
        SERVICE_UUID,
        CHARACTERISTICS.hardware,
        (error, characteristic) => {
          if (error) {
            this.hardwareSubscription = null;
            callback(null, error);
            return;
          }
          if (!characteristic?.value) {
            return;
          }
          try {
            const base64Data = characteristic.value;
            const decodedData = atob(base64Data);
            callback(decodedData);
          } catch (err) {
            callback(
              null,
              err instanceof Error ? err : new Error("Failed to decode hardware data")
            );
          }
        }
      );
      return this.hardwareSubscription;
    } catch (err) {
      callback(
        null,
        err instanceof Error ? err : new Error("Failed to monitor hardware characteristic")
      );
      return null;
    }
  }
  /* ============================================================
     STOP HARDWARE DATA
  ============================================================ */
  async stopReceivingHardwareData() {
    if (this.hardwareSubscription) {
      try {
        this.hardwareSubscription.remove();
      } catch (err) {
        console.log("Failed to remove hardware subscription:", err);
      }
      this.hardwareSubscription = null;
    }
  }
  /* ============================================================
     HARDWARE MONITOR STATUS
  ============================================================ */
  async hasActiveHardwareMonitor() {
    return Boolean(this.hardwareSubscription);
  }
  /* ============================================================
     MONITOR RESTART
  ============================================================ */
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
  isServiceNotFoundError(error) {
    const message = String(error?.message || error || "").toLowerCase();
    return error?.errorCode === 302 || message.includes("not found");
  }
  scheduleMonitorRestart(callback, options) {
    this.clearMonitorRestart();
    this.monitorRestartTimer = setTimeout(async () => {
      this.monitorRestartTimer = null;
      if (!await this.isConnected()) {
        return;
      }
      console.log("BLE monitor cancelled while connected, restarting monitor");
      this.monitorHealthMetrics(callback, options);
    }, options.restartDelay);
  }
  /* ============================================================
     BLE ERROR DESCRIPTION
  ============================================================ */
  describeBleError(error) {
    if (!error) {
      return "Unknown BLE error";
    }
    return JSON.stringify({
      message: error.message,
      reason: error.reason,
      errorCode: error.errorCode,
      attErrorCode: error.attErrorCode,
      iosErrorCode: error.iosErrorCode,
      androidErrorCode: error.androidErrorCode
    });
  }
  /* ============================================================
     SYNC DEVICE TIME
  ============================================================ */
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
  /* ============================================================
     WRITE COMMAND
  ============================================================ */
  async sendCommand(base64Command, characteristicUUID = CHARACTERISTICS.reset) {
    if (!this.device) {
      throw new Error("No Device Connected");
    }
    const commandResult = Base64Schema.safeParse(base64Command);
    if (!commandResult.success) {
      throw new Error(
        `sendCommand() invalid base64Command: ${commandResult.error.message}`
      );
    }
    const uuidResult = CharacteristicUUIDSchema.safeParse(characteristicUUID);
    if (!uuidResult.success) {
      throw new Error(
        `sendCommand() invalid characteristicUUID: ${uuidResult.error.message}`
      );
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
  /* ============================================================
     READ CHARACTERISTIC
  ============================================================ */
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
  /* ============================================================
     GET SERVICES
  ============================================================ */
  async getServices() {
    if (!this.device) return [];
    return await this.device.services();
  }
  /* ============================================================
     CURRENT DEVICE
  ============================================================ */
  getConnectedDevice() {
    return this.device;
  }
  /* ============================================================
     REMEMBER DEVICE
  ============================================================ */
  async rememberDeviceId(deviceId) {
    const parsed = DeviceIdSchema.safeParse(deviceId);
    if (!parsed.success) {
      return false;
    }
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
  /* ============================================================
     DESTROY
  ============================================================ */
  destroy() {
    this.stopMonitoring();
    this.stopReceivingHardwareData();
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
    const connectedDevice = BLEService_default.getConnectedDevice();
    const alreadyConnected = connectedDevice?.id === activeDeviceId && await BLEService_default.isConnected();
    if (!alreadyConnected) {
      BLEService_default.stopMonitoring();
      await BLEService_default.autoConnect(activeDeviceId);
      emitBleStatus({ connected: true, deviceId: activeDeviceId, reconnected: true });
    } else {
      if (!BLEService_default.hasActiveMonitor()) {
        await BLEService_default.autoConnect(activeDeviceId);
        emitBleStatus({
          connected: true,
          deviceId: activeDeviceId,
          reconnected: false,
          servicesRediscovered: true
        });
      } else {
        emitBleStatus({ connected: true, deviceId: activeDeviceId, reconnected: false });
      }
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
var receiveHardwareData = (callback) => BLEService_default.receiveHardwareData(callback);
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

// src/useOtaUpdate.ts
import { useState, useCallback, useEffect, useRef } from "react";
import { Alert } from "react-native";

// src/otaUpdate.ts
import { Platform as Platform3 } from "react-native";
import * as FileSystem from "expo-file-system/legacy";
import * as IntentLauncher from "expo-intent-launcher";
import Constants from "expo-constants";
import Application from "expo-application";
function isNewVersionAvailable(current, latest) {
  const c = String(current).split(".").map(Number);
  const l = String(latest).split(".").map(Number);
  const len = Math.max(c.length, l.length);
  for (let i = 0; i < len; i++) {
    const a = c[i] || 0;
    const b = l[i] || 0;
    if (b > a) return true;
    if (b < a) return false;
  }
  return false;
}
async function requestInstallPermission() {
  if (Platform3.OS !== "android") return true;
  try {
    const packageName = Application.applicationId || Constants.expoConfig?.android?.package;
    await IntentLauncher.startActivityAsync(
      "android.settings.MANAGE_UNKNOWN_APP_SOURCES",
      { data: `package:${packageName}` }
    );
    return true;
  } catch (err) {
    console.warn("requestInstallPermission failed:", err);
    return false;
  }
}
async function downloadAndInstallApk(url, onProgress) {
  const fileUri = FileSystem.documentDirectory + "app-update.apk";
  const downloadResumable = FileSystem.createDownloadResumable(
    url,
    fileUri,
    {},
    (downloadProgress) => {
      if (downloadProgress.totalBytesExpectedToWrite > 0) {
        const p = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
        onProgress?.(p);
      }
    }
  );
  const result = await downloadResumable.downloadAsync();
  if (!result?.uri) throw new Error("Download failed");
  const contentUri = await FileSystem.getContentUriAsync(result.uri);
  await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
    data: contentUri,
    flags: 1,
    type: "application/vnd.android.package-archive"
  });
  return result.uri;
}
async function runOtaUpdate({
  url,
  currentVersion,
  updatedVersion,
  onProgress
}) {
  if (!isNewVersionAvailable(currentVersion, updatedVersion)) {
    return { updated: false, reason: "up-to-date" };
  }
  await requestInstallPermission();
  const uri = await downloadAndInstallApk(url, onProgress);
  return { updated: true, uri };
}

// src/useOtaUpdate.ts
function useOtaUpdate({ url, currentVersion, updatedVersion }) {
  const isMountedRef = useRef(true);
  const [status, setStatus] = useState(
    isNewVersionAvailable(currentVersion, updatedVersion) ? "available" : "upToDate"
  );
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  const startUpdate = useCallback(async () => {
    if (status === "upToDate" || status === "downloading") return;
    setStatus("downloading");
    setProgress(0);
    try {
      const res = await runOtaUpdate({
        url,
        currentVersion,
        updatedVersion,
        onProgress: (p) => {
          if (isMountedRef.current) setProgress(p);
        }
      });
      if (!isMountedRef.current) return;
      if (!res.updated) {
        setStatus("upToDate");
      } else {
        setStatus("done");
      }
    } catch (err) {
      console.error("OTA update failed:", err);
      if (!isMountedRef.current) return;
      setStatus("error");
      Alert.alert("Update failed", err.message || "Something went wrong.");
    }
  }, [url, currentVersion, updatedVersion, status]);
  return { status, progress, startUpdate };
}

// node_modules/expo-asset/build/Asset.js
var import_registry2 = __toESM(require_registry());
init_src();

// node_modules/expo-asset/build/AssetSources.js
init_src();
import { PixelRatio as PixelRatio2, NativeModules } from "react-native";

// node_modules/expo-asset/build/AssetSourceResolver.js
init_src();
import { PixelRatio } from "react-native";
function getScaledAssetPath(asset) {
  const scale = AssetSourceResolver.pickScale(asset.scales, PixelRatio.get());
  const scaleSuffix = scale === 1 ? "" : "@" + scale + "x";
  const type = !asset.type ? "" : `.${asset.type}`;
  if (__DEV__) {
    return asset.httpServerLocation + "/" + asset.name + scaleSuffix + type;
  } else {
    return asset.httpServerLocation.replace(/\.\.\//g, "_") + "/" + asset.name + scaleSuffix + type;
  }
}
var AssetSourceResolver = class _AssetSourceResolver {
  serverUrl;
  // where the jsbundle is being run from
  // NOTE(EvanBacon): Never defined on web.
  // @ts-expect-error: Never read locally
  jsbundleUrl;
  // the asset to resolve
  asset;
  constructor(serverUrl, jsbundleUrl, asset) {
    this.serverUrl = serverUrl || "https://expo.dev";
    this.jsbundleUrl = null;
    this.asset = asset;
  }
  // Always true for web runtimes
  isLoadedFromServer() {
    return true;
  }
  // Always false for web runtimes
  isLoadedFromFileSystem() {
    return false;
  }
  defaultAsset() {
    return this.assetServerURL();
  }
  /**
   * @returns absolute remote URL for the hosted asset.
   */
  assetServerURL() {
    const fromUrl = new URL(getScaledAssetPath(this.asset), this.serverUrl);
    fromUrl.searchParams.set("platform", Platform_default.OS);
    fromUrl.searchParams.set("hash", this.asset.hash);
    return this.fromSource(
      // Relative on web
      fromUrl.toString().replace(fromUrl.origin, "")
    );
  }
  fromSource(source) {
    return {
      __packager_asset: true,
      width: this.asset.width ?? void 0,
      height: this.asset.height ?? void 0,
      uri: source,
      scale: _AssetSourceResolver.pickScale(this.asset.scales, PixelRatio.get())
    };
  }
  static pickScale(scales, deviceScale) {
    for (const scale of scales) {
      if (scale >= deviceScale) {
        return scale;
      }
    }
    return scales[scales.length - 1] || 1;
  }
};

// node_modules/expo-asset/build/PlatformUtils.js
init_src();
import Constants2 from "expo-constants";

// node_modules/expo-asset/build/AssetUris.js
function getFilename(url) {
  const { pathname, searchParams } = new URL(url, "https://e");
  if (__DEV__) {
    if (searchParams.has("unstable_path")) {
      const encodedFilePath = decodeURIComponent(searchParams.get("unstable_path"));
      return getBasename(encodedFilePath);
    }
  }
  return getBasename(pathname);
}
function getBasename(pathname) {
  return pathname.substring(pathname.lastIndexOf("/") + 1);
}
function getFileExtension(url) {
  const filename = getFilename(url);
  const dotIndex = filename.lastIndexOf(".");
  return dotIndex > 0 ? filename.substring(dotIndex) : "";
}
function getManifestBaseUrl(manifestUrl) {
  const urlObject = new URL(manifestUrl);
  let nextProtocol = urlObject.protocol;
  if (nextProtocol === "exp:") {
    nextProtocol = "http:";
  } else if (nextProtocol === "exps:") {
    nextProtocol = "https:";
  }
  urlObject.protocol = nextProtocol;
  const directory = urlObject.pathname.substring(0, urlObject.pathname.lastIndexOf("/") + 1);
  urlObject.pathname = directory;
  urlObject.search = "";
  urlObject.hash = "";
  return urlObject.protocol !== nextProtocol ? urlObject.href.replace(urlObject.protocol, nextProtocol) : urlObject.href;
}

// node_modules/expo-asset/build/PlatformUtils.js
var ExpoUpdates = requireOptionalNativeModule("ExpoUpdates");
var NativeExpoGoModule = (() => {
  try {
    return requireNativeModule("ExpoGo");
  } catch {
    return null;
  }
})();
function isRunningInExpoGo() {
  return NativeExpoGoModule != null;
}
var expoUpdatesIsInstalledAndEnabled = !!ExpoUpdates?.isEnabled;
var expoUpdatesIsUsingEmbeddedAssets = ExpoUpdates?.isUsingEmbeddedAssets;
var shouldUseUpdatesAssetResolution = expoUpdatesIsInstalledAndEnabled && !expoUpdatesIsUsingEmbeddedAssets;
var IS_ENV_WITH_LOCAL_ASSETS = isRunningInExpoGo() || shouldUseUpdatesAssetResolution;
function getLocalAssets() {
  return ExpoUpdates?.localAssets ?? {};
}
function getManifest2() {
  return Constants2.__unsafeNoWarnManifest2;
}
var manifestBaseUrl = Constants2.experienceUrl ? getManifestBaseUrl(Constants2.experienceUrl) : null;

// node_modules/expo-asset/build/AssetSources.js
function selectAssetSource(meta) {
  const scale = AssetSourceResolver.pickScale(meta.scales, PixelRatio2.get());
  const index = meta.scales.findIndex((s) => s === scale);
  const hash = meta.fileHashes?.[index] ?? meta.fileHashes?.[0] ?? meta.hash;
  const uri = meta.fileUris ? meta.fileUris[index] ?? meta.fileUris[0] : meta.uri;
  if (uri) {
    return { uri: resolveUri(uri), hash };
  }
  const fileScale = scale === 1 ? "" : `@${scale}x`;
  const fileExtension = meta.type ? `.${encodeURIComponent(meta.type)}` : "";
  const suffix = `/${encodeURIComponent(meta.name)}${fileScale}${fileExtension}`;
  const params = new URLSearchParams({
    platform: Platform_default.OS,
    hash: meta.hash
  });
  if (/^https?:\/\//.test(meta.httpServerLocation)) {
    const uri2 = meta.httpServerLocation + suffix + "?" + params;
    return { uri: uri2, hash };
  }
  const manifest2 = getManifest2();
  const scheme = manifestBaseUrl?.startsWith("https://") ? "https://" : "http://";
  const devServerUrl = manifest2?.extra?.expoGo?.developer ? scheme + manifest2.extra.expoGo.debuggerHost : null;
  if (devServerUrl) {
    const baseUrl = new URL(meta.httpServerLocation + suffix, devServerUrl);
    baseUrl.searchParams.set("platform", Platform_default.OS);
    baseUrl.searchParams.set("hash", meta.hash);
    return {
      uri: baseUrl.href,
      hash
    };
  }
  if (NativeModules["ExponentKernel"]) {
    return { uri: `https://classic-assets.eascdn.net/~assets/${encodeURIComponent(hash)}`, hash };
  }
  return { uri: "", hash };
}
function resolveUri(uri) {
  return manifestBaseUrl ? new URL(uri, manifestBaseUrl).href : uri;
}

// node_modules/expo-asset/build/ExpoAsset.js
init_src();
var AssetModule = requireNativeModule("ExpoAsset");
async function downloadAsync(url, md5Hash, type) {
  return AssetModule.downloadAsync(url, md5Hash, type);
}

// node_modules/expo-asset/build/ImageAssets.js
function isImageType(type) {
  return /^(jpeg|jpg|gif|png|bmp|webp|heic)$/i.test(type);
}
function getImageInfoAsync(url) {
  if (typeof window === "undefined") {
    return Promise.resolve({ name: getFilename(url), width: 0, height: 0 });
  }
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onerror = reject;
    img.onload = () => {
      resolve({
        name: getFilename(url),
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    };
    img.src = url;
  });
}

// node_modules/expo-asset/build/LocalAssets.js
var localAssets = getLocalAssets();
function getLocalAssetUri(hash, type) {
  const localAssetsKey = hash;
  const legacyLocalAssetsKey = `${hash}.${type ?? ""}`;
  switch (true) {
    case localAssetsKey in localAssets: {
      return localAssets[localAssetsKey] ?? null;
    }
    case legacyLocalAssetsKey in localAssets: {
      return localAssets[legacyLocalAssetsKey] ?? null;
    }
    default:
      return null;
  }
}

// node_modules/expo-asset/build/resolveAssetSource.js
var import_registry = __toESM(require_registry());
var _customSourceTransformer;
function setCustomSourceTransformer(transformer) {
  _customSourceTransformer = transformer;
}
function resolveAssetSource(source) {
  if (typeof source === "object") {
    return source;
  }
  const asset = (0, import_registry.getAssetByID)(source);
  if (!asset) {
    return null;
  }
  const resolver = new AssetSourceResolver(
    // Doesn't matter since this is removed on web
    "https://expo.dev",
    null,
    asset
  );
  if (_customSourceTransformer) {
    return _customSourceTransformer(resolver);
  }
  return resolver.defaultAsset();
}
Object.defineProperty(resolveAssetSource, "setCustomSourceTransformer", {
  get() {
    return setCustomSourceTransformer;
  }
});
var resolveAssetSource_default = resolveAssetSource;
var { pickScale } = AssetSourceResolver;

// node_modules/expo-asset/build/Asset.js
var ANDROID_EMBEDDED_URL_BASE_RESOURCE = "file:///android_res/";
var Asset = class _Asset {
  static byHash = {};
  static byUri = {};
  /**
   * The name of the asset file without the extension. Also without the part from `@` onward in the
   * filename (used to specify scale factor for images).
   */
  name;
  /**
   * The extension of the asset filename.
   */
  type;
  /**
   * The MD5 hash of the asset's data.
   */
  hash = null;
  /**
   * A URI that points to the asset's data on the remote server. When running the published version
   * of your app, this refers to the location on Expo's asset server where Expo has stored your
   * asset. When running the app from Expo CLI during development, this URI points to Expo CLI's
   * server running on your computer and the asset is served directly from your computer. If you
   * are not using Classic Updates (legacy), this field should be ignored as we ensure your assets
   * are on device before running your application logic.
   */
  uri;
  /**
   * If the asset has been downloaded (by calling [`downloadAsync()`](#downloadasync)), the
   * `file://` URI pointing to the local file on the device that contains the asset data.
   */
  localUri = null;
  /**
   * If the asset is an image, the width of the image data divided by the scale factor. The scale
   * factor is the number after `@` in the filename, or `1` if not present.
   */
  width = null;
  /**
   * If the asset is an image, the height of the image data divided by the scale factor. The scale factor is the number after `@` in the filename, or `1` if not present.
   */
  height = null;
  downloading = false;
  /**
   * Whether the asset has finished downloading from a call to [`downloadAsync()`](#downloadasync).
   */
  downloaded = false;
  _downloadCallbacks = [];
  constructor({ name, type, hash = null, uri, width, height }) {
    this.name = name;
    this.type = type;
    this.hash = hash;
    this.uri = uri;
    if (typeof width === "number") {
      this.width = width;
    }
    if (typeof height === "number") {
      this.height = height;
    }
    if (hash) {
      this.localUri = getLocalAssetUri(hash, type);
      if (this.localUri?.startsWith(ANDROID_EMBEDDED_URL_BASE_RESOURCE)) {
        this.uri = this.localUri;
        this.localUri = null;
      } else if (this.localUri) {
        this.downloaded = true;
      }
    }
    if (Platform_default.OS === "web") {
      if (!name) {
        this.name = getFilename(uri);
      }
      if (!type) {
        this.type = getFileExtension(uri);
      }
    }
  }
  // @needsAudit
  /**
   * A helper that wraps `Asset.fromModule(module).downloadAsync` for convenience.
   * @param moduleId An array of `require('path/to/file')` or external network URLs. Can also be
   * just one module or URL without an Array.
   * @return Returns a Promise that fulfills with an array of `Asset`s when the asset(s) has been
   * saved to disk.
   * @example
   * ```ts
   * const [{ localUri }] = await Asset.loadAsync(require('./assets/snack-icon.png'));
   * ```
   */
  static loadAsync(moduleId) {
    const moduleIds = Array.isArray(moduleId) ? moduleId : [moduleId];
    return Promise.all(moduleIds.map((moduleId2) => _Asset.fromModule(moduleId2).downloadAsync()));
  }
  // @needsAudit
  /**
   * Returns the [`Asset`](#asset) instance representing an asset given its module or URL.
   * @param virtualAssetModule The value of `require('path/to/file')` for the asset or external
   * network URL
   * @return The [`Asset`](#asset) instance for the asset.
   */
  static fromModule(virtualAssetModule) {
    if (typeof virtualAssetModule === "string") {
      return _Asset.fromURI(virtualAssetModule);
    }
    if (typeof virtualAssetModule === "object" && "uri" in virtualAssetModule && typeof virtualAssetModule.uri === "string") {
      const extension = getFileExtension(virtualAssetModule.uri);
      return new _Asset({
        name: "",
        type: extension.startsWith(".") ? extension.substring(1) : extension,
        hash: null,
        uri: virtualAssetModule.uri,
        width: virtualAssetModule.width,
        height: virtualAssetModule.height
      });
    }
    const meta = (0, import_registry2.getAssetByID)(virtualAssetModule);
    if (!meta) {
      throw new Error(`Module "${virtualAssetModule}" is missing from the asset registry`);
    }
    if (!IS_ENV_WITH_LOCAL_ASSETS) {
      const { uri } = resolveAssetSource_default(virtualAssetModule);
      const asset = new _Asset({
        name: meta.name,
        type: meta.type,
        hash: meta.hash,
        uri,
        width: meta.width,
        height: meta.height
      });
      if (Platform_default.OS === "android" && !uri.includes(":") && (meta.width || meta.height)) {
        asset.localUri = asset.uri;
        asset.downloaded = true;
      }
      _Asset.byHash[meta.hash] = asset;
      return asset;
    }
    return _Asset.fromMetadata(meta);
  }
  // @docsMissing
  static fromMetadata(meta) {
    const metaHash = meta.hash;
    const assetByHash = _Asset.byHash[metaHash];
    if (assetByHash) {
      return assetByHash;
    }
    const { uri, hash } = selectAssetSource(meta);
    const asset = new _Asset({
      name: meta.name,
      type: meta.type,
      hash,
      uri,
      width: meta.width,
      height: meta.height
    });
    _Asset.byHash[metaHash] = asset;
    return asset;
  }
  // @docsMissing
  static fromURI(uri) {
    if (_Asset.byUri[uri]) {
      return _Asset.byUri[uri];
    }
    let type = "";
    if (uri.indexOf(";base64") > -1) {
      type = uri.split(";")[0]?.split("/")[1] ?? "";
    } else {
      const extension = getFileExtension(uri);
      type = extension.startsWith(".") ? extension.substring(1) : extension;
    }
    const asset = new _Asset({
      name: "",
      type,
      hash: null,
      uri
    });
    _Asset.byUri[uri] = asset;
    return asset;
  }
  // @needsAudit
  /**
   * Downloads the asset data to a local file in the device's cache directory. Once the returned
   * promise is fulfilled without error, the [`localUri`](#localuri) field of this asset points
   * to a local file containing the asset data. The asset is only downloaded if an up-to-date local
   * file for the asset isn't already present due to an earlier download. The downloaded `Asset`
   * will be returned when the promise is resolved.
   *
   * > **Note:** There is no guarantee that files downloaded via `downloadAsync` persist between app sessions.
   * `downloadAsync` stores files in the caches directory, so it's up to the OS to clear this folder at its
   * own discretion or when the user manually purges the caches directory. Downloaded assets are stored as
   * `ExponentAsset-{cacheFileId}.{extension}` within the cache directory.
   * > To manually clear cached assets, you can use [`expo-file-system`](./filesystem/) to
   * delete the cache directory: `Paths.cache.delete()` or use the legacy API `deleteAsync(cacheDirectory)`.
   *
   * @return Returns a Promise which fulfills with an `Asset` instance.
   */
  async downloadAsync() {
    if (this.downloaded) {
      return this;
    }
    if (this.downloading) {
      await new Promise((resolve, reject) => {
        this._downloadCallbacks.push({ resolve, reject });
      });
      return this;
    }
    this.downloading = true;
    try {
      if (Platform_default.OS === "web") {
        if (isImageType(this.type)) {
          const { width, height, name } = await getImageInfoAsync(this.uri);
          this.width = width;
          this.height = height;
          this.name = name;
        } else {
          this.name = getFilename(this.uri);
        }
      }
      this.localUri = await downloadAsync(this.uri, this.hash, this.type);
      this.downloaded = true;
      this._downloadCallbacks.forEach(({ resolve }) => resolve());
    } catch (e) {
      this._downloadCallbacks.forEach(({ reject }) => reject(e));
      throw e;
    } finally {
      this.downloading = false;
      this._downloadCallbacks = [];
    }
    return this;
  }
};

// node_modules/expo-audio/build/ExpoAudio.js
init_src();
import { useEffect as useEffect4, useMemo as useMemo2 } from "react";
import { Platform as Platform5 } from "react-native";

// node_modules/expo-audio/build/AudioModule.js
init_src();
var AudioModule_default = requireNativeModule("ExpoAudio");

// node_modules/expo-audio/build/utils/options.js
init_src();
function createRecordingOptions(options) {
  const commonOptions = {
    extension: options.extension,
    sampleRate: options.sampleRate,
    numberOfChannels: options.numberOfChannels,
    bitRate: options.bitRate,
    isMeteringEnabled: options.isMeteringEnabled ?? false
  };
  if (Platform_default.OS === "ios") {
    return {
      ...commonOptions,
      directory: options.directory,
      ...options.ios
    };
  } else if (Platform_default.OS === "android") {
    return {
      ...commonOptions,
      directory: options.directory,
      ...options.android
    };
  } else {
    return {
      ...commonOptions,
      ...options.web
    };
  }
}

// node_modules/expo-audio/build/utils/resolveSource.js
function getAssetFromSource(source) {
  if (!source) {
    return null;
  }
  if (source instanceof Asset) {
    return source;
  }
  if (typeof source === "number") {
    return Asset.fromModule(source);
  }
  if (typeof source === "object") {
    if ("assetId" in source && typeof source.assetId === "number") {
      return Asset.fromModule(source.assetId);
    }
    if ("uri" in source && typeof source.uri === "string") {
      return Asset.fromURI(source.uri);
    }
  }
  if (typeof source === "string") {
    return Asset.fromURI(source);
  }
  return null;
}
function createSourceFromAsset(asset, extras = {}) {
  const uri = asset.localUri ?? asset.uri;
  const result = { uri };
  if (asset.name) {
    result.name = asset.name;
  }
  if (extras.assetId != null) {
    result.assetId = extras.assetId;
  }
  if (extras.headers) {
    result.headers = extras.headers;
  }
  return result;
}
function resolveSource(source) {
  if (source == null) {
    return null;
  }
  if (source instanceof Asset) {
    return createSourceFromAsset(source);
  }
  if (typeof source === "string") {
    return { uri: source };
  }
  if (typeof source === "number") {
    const asset = Asset.fromModule(source);
    return createSourceFromAsset(asset, { assetId: source });
  }
  if (typeof source === "object") {
    if ("assetId" in source && typeof source.assetId === "number") {
      const asset = Asset.fromModule(source.assetId);
      return {
        ...source,
        uri: asset.localUri ?? asset.uri
      };
    }
    if ("uri" in source && typeof source.uri === "string") {
      return source;
    }
  }
  return source ?? null;
}
async function resolveSourceWithDownload(source) {
  const asset = getAssetFromSource(source);
  const fallbackSource = resolveSource(source);
  if (asset) {
    let assetToDownload = asset;
    try {
      if (!assetToDownload.type) {
        assetToDownload = new Asset({
          name: asset.name,
          type: "mp3",
          uri: asset.uri
        });
      }
      await assetToDownload.downloadAsync();
      if (assetToDownload.localUri) {
        const finalUri = assetToDownload.localUri;
        if (fallbackSource && typeof fallbackSource === "object") {
          return {
            ...fallbackSource,
            uri: finalUri
          };
        }
        return { uri: finalUri };
      } else {
        console.warn("No localUri found, asset may not have downloaded properly, returning the original source");
      }
    } catch (error) {
      console.warn("expo-audio: Failed to download asset, falling back to original source:", error);
    }
  }
  return fallbackSource;
}

// node_modules/expo-audio/build/ExpoAudio.js
var replace = AudioModule_default.AudioPlayer.prototype.replace;
AudioModule_default.AudioPlayer.prototype.replace = function(source) {
  return replace.call(this, resolveSource(source));
};
var setPlaybackRate = AudioModule_default.AudioPlayer.prototype.setPlaybackRate;
AudioModule_default.AudioPlayer.prototype.setPlaybackRate = function(rate, pitchCorrectionQuality) {
  if (Platform5.OS === "android") {
    return setPlaybackRate.call(this, rate);
  } else {
    return setPlaybackRate.call(this, rate, pitchCorrectionQuality);
  }
};
if (!Platform5.isTV || Platform5.OS !== "ios") {
  const prepareToRecordAsync = AudioModule_default.AudioRecorder.prototype.prepareToRecordAsync;
  AudioModule_default.AudioRecorder.prototype.prepareToRecordAsync = function(options) {
    const processedOptions = options ? createRecordingOptions(options) : void 0;
    return prepareToRecordAsync.call(this, processedOptions);
  };
}
function useAudioPlayer(source = null, options = {}) {
  const { updateInterval = 500, downloadFirst = false, keepAudioSessionActive = false, preferredForwardBufferDuration = 0 } = options;
  const initialSource = useMemo2(() => {
    return downloadFirst ? null : resolveSource(source);
  }, [JSON.stringify(source), downloadFirst]);
  const player = useReleasingSharedObject(() => new AudioModule_default.AudioPlayer(initialSource, updateInterval, keepAudioSessionActive, preferredForwardBufferDuration), [
    JSON.stringify(initialSource),
    updateInterval,
    keepAudioSessionActive,
    preferredForwardBufferDuration
  ]);
  useEffect4(() => {
    if (!downloadFirst || source === null) {
      return;
    }
    let isCancelled = false;
    async function resolveAndReplaceSource() {
      try {
        const resolved = await resolveSourceWithDownload(source);
        if (!isCancelled && resolved && JSON.stringify(resolved) !== JSON.stringify(initialSource)) {
          player.replace(resolved);
        }
      } catch (error) {
        if (!isCancelled) {
          console.warn("expo-audio: Failed to download source, using original:", error);
        }
      }
    }
    resolveAndReplaceSource();
    return () => {
      isCancelled = true;
    };
  }, [player, JSON.stringify(source), downloadFirst]);
  return player;
}

// src/RingThePhone.ts
function usePhoneRingtone(audioSource) {
  const player = useAudioPlayer(audioSource);
  const startRingtone = () => {
    player.seekTo(0);
    player.play();
  };
  const stopRingtone = () => {
    player.pause();
    player.seekTo(0);
  };
  return {
    startRingtone,
    stopRingtone
  };
}
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
  downloadAndInstallApk,
  getConnectedDevice,
  getCurrentStatus,
  getEnhancedDeviceInfo as getDeviceInfo,
  getLastNotificationResponse,
  getServices,
  hasActiveMonitor,
  initializeLogger,
  isBackgroundServiceRunning,
  isConnected,
  isNewVersionAvailable,
  monitorData,
  monitorHealthMetrics,
  onStateChange,
  read,
  receiveHardwareData,
  requestBlePermission,
  requestInstallPermission,
  requestNotificationPermission,
  runOtaUpdate,
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
  useOtaUpdate,
  usePhoneRingtone,
  veryIntensiveTask
};
//# sourceMappingURL=index.mjs.map