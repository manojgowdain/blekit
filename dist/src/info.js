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
  default: () => getDeviceInfo
});
module.exports = __toCommonJS(info_exports);
var Device = __toESM(require("expo-device"));
var Battery = __toESM(require("expo-battery"));
var import_netinfo = __toESM(require("@react-native-community/netinfo"));
var import_react_native_device_info = __toESM(require("react-native-device-info"));
async function getDeviceInfo() {
  const battery = await Battery.getBatteryLevelAsync();
  const batteryState = await Battery.getBatteryStateAsync();
  const net = await import_netinfo.default.fetch();
  return {
    brand: Device.brand,
    manufacturer: Device.manufacturer,
    model: Device.modelName,
    deviceName: await import_react_native_device_info.default.getDeviceName(),
    os: `${Device.osName} ${Device.osVersion}`,
    battery: `${Math.round(battery * 100)}%`,
    charging: batteryState === Battery.BatteryState.CHARGING ? "Yes" : "No",
    appVersion: import_react_native_device_info.default.getVersion(),
    build: import_react_native_device_info.default.getBuildNumber(),
    uniqueId: await import_react_native_device_info.default.getUniqueId(),
    ip: await import_react_native_device_info.default.getIpAddress(),
    wifi: net.type,
    online: net.isConnected
  };
}
//# sourceMappingURL=info.js.map