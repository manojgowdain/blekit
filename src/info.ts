  import * as Device from "expo-device";
  import * as Battery from "expo-battery";
  import * as Location from "expo-location";
  import NetInfo from "@react-native-community/netinfo";
  import DeviceInfo from "react-native-device-info";

  type LegacyDeviceInfo = typeof DeviceInfo & {
    isDeviceRooted?: () => Promise<boolean>;
    getDeviceLocale?: () => string | undefined;
  };

  const legacyDeviceInfo = DeviceInfo as LegacyDeviceInfo;

  export default async function getEnhancedDeviceInfo() {
    // Core metrics
    const batteryLevel = await Battery.getBatteryLevelAsync();
    const batteryState = await Battery.getBatteryStateAsync();
    const net = await NetInfo.fetch();

    let latitude = null;
    let longitude = null;
    let accuracy = null;
    let speed = null;
    let googleMapsUrl = null;

    // Request location permission if needed
    const permission = await Location.getForegroundPermissionsAsync();

    const hasLocationPermission =
      permission.status === "granted" ||
      (permission.canAskAgain &&
        (await Location.requestForegroundPermissionsAsync()).status ===
          "granted");

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

    // Security / integrity checks
    const isEmulator = await DeviceInfo.isEmulator();
    const isRooted = await DeviceInfo.isPinOrFingerprintSet !== undefined
      ? await legacyDeviceInfo.isDeviceRooted?.() ?? false
      : false;
    const hasScreenLock = await DeviceInfo.isPinOrFingerprintSet();
    const isMockLocation = hasLocationPermission
      ? await DeviceInfo.isLocationEnabled?.().catch(() => false) ?? false
      : false;

    // Storage
    const freeStorage = await DeviceInfo.getFreeDiskStorage();
    const totalStorage = await DeviceInfo.getTotalDiskCapacity();

    // Timezone / locale
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const locale =
      Device.osName === "iOS"
        ? Intl.DateTimeFormat().resolvedOptions().locale
        : legacyDeviceInfo.getDeviceLocale?.() ?? "en-US";

    return {
      device: {
        brand: Device.brand,
        manufacturer: Device.manufacturer,
        model: Device.modelName,
        deviceName: await DeviceInfo.getDeviceName(),
        os: `${Device.osName} ${Device.osVersion}`,
        appVersion: DeviceInfo.getVersion(),
        build: DeviceInfo.getBuildNumber(),
        uniqueId: await DeviceInfo.getUniqueId(),
      },

      network: {
        type: net.type,
        online: net.isConnected,
        ip: await DeviceInfo.getIpAddress(),
        vpn: net.details?.isConnectionExpensive !== undefined
          ? net.type === "vpn"
          : false,
      },

      location: {
        latitude,
        longitude,
        accuracy,
        speed,
        googleMapsUrl,
      },

      battery: {
        level: Math.round(batteryLevel * 100),
        charging: batteryState === Battery.BatteryState.CHARGING,
      },

      security: {
        rooted: isRooted,
        emulator: isEmulator,
        developerMode: await legacyDeviceInfo.isDeviceRooted?.() ?? false, // see note below
        mockLocation: isMockLocation,
        screenLock: hasScreenLock,
      },

      storage: {
        free: freeStorage,
        total: totalStorage,
      },

      time: {
        timezone,
        locale,
      },
    };
  }