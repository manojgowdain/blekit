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
export {
  getEnhancedDeviceInfo as default
};
//# sourceMappingURL=info.mjs.map