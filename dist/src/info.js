var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/info.ts
var info_exports = {};
__export(info_exports, {
  default: () => getEnhancedDeviceInfo
});
module.exports = __toCommonJS(info_exports);
var Device = __toESM(require("expo-device"));
var Battery = __toESM(require("expo-battery"));
var Location = __toESM(require("expo-location"));
var import_netinfo = __toESM(require("@react-native-community/netinfo"));
var import_react_native_device_info = __toESM(require("react-native-device-info"));
var legacyDeviceInfo = import_react_native_device_info.default;
async function getEnhancedDeviceInfo() {
  const batteryLevel = await Battery.getBatteryLevelAsync();
  const batteryState = await Battery.getBatteryStateAsync();
  const net = await import_netinfo.default.fetch();
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
  const isEmulator = await import_react_native_device_info.default.isEmulator();
  const isRooted = await import_react_native_device_info.default.isPinOrFingerprintSet !== void 0 ? await legacyDeviceInfo.isDeviceRooted?.() ?? false : false;
  const hasScreenLock = await import_react_native_device_info.default.isPinOrFingerprintSet();
  const isMockLocation = hasLocationPermission ? await import_react_native_device_info.default.isLocationEnabled?.().catch(() => false) ?? false : false;
  const freeStorage = await import_react_native_device_info.default.getFreeDiskStorage();
  const totalStorage = await import_react_native_device_info.default.getTotalDiskCapacity();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const locale = Device.osName === "iOS" ? Intl.DateTimeFormat().resolvedOptions().locale : legacyDeviceInfo.getDeviceLocale?.() ?? "en-US";
  return {
    device: {
      brand: Device.brand,
      manufacturer: Device.manufacturer,
      model: Device.modelName,
      deviceName: await import_react_native_device_info.default.getDeviceName(),
      os: `${Device.osName} ${Device.osVersion}`,
      appVersion: import_react_native_device_info.default.getVersion(),
      build: import_react_native_device_info.default.getBuildNumber(),
      uniqueId: await import_react_native_device_info.default.getUniqueId()
    },
    network: {
      type: net.type,
      online: net.isConnected,
      ip: await import_react_native_device_info.default.getIpAddress(),
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
//# sourceMappingURL=info.js.map