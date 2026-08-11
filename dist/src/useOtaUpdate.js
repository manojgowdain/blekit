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

// src/useOtaUpdate.ts
var useOtaUpdate_exports = {};
__export(useOtaUpdate_exports, {
  default: () => useOtaUpdate_default,
  useOtaUpdate: () => useOtaUpdate
});
module.exports = __toCommonJS(useOtaUpdate_exports);
var import_react = require("react");
var import_react_native2 = require("react-native");

// src/otaUpdate.ts
var import_react_native = require("react-native");
var FileSystem = __toESM(require("expo-file-system/legacy"));
var IntentLauncher = __toESM(require("expo-intent-launcher"));
var import_expo_constants = __toESM(require("expo-constants"));
var import_expo_application = __toESM(require("expo-application"));
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
  if (import_react_native.Platform.OS !== "android") return true;
  try {
    const packageName = import_expo_application.default.applicationId || import_expo_constants.default.expoConfig?.android?.package;
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
  const isMountedRef = (0, import_react.useRef)(true);
  const [status, setStatus] = (0, import_react.useState)(
    isNewVersionAvailable(currentVersion, updatedVersion) ? "available" : "upToDate"
  );
  const [progress, setProgress] = (0, import_react.useState)(0);
  (0, import_react.useEffect)(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  const startUpdate = (0, import_react.useCallback)(async () => {
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
      import_react_native2.Alert.alert("Update failed", err.message || "Something went wrong.");
    }
  }, [url, currentVersion, updatedVersion, status]);
  return { status, progress, startUpdate };
}
var useOtaUpdate_default = useOtaUpdate;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useOtaUpdate
});
//# sourceMappingURL=useOtaUpdate.js.map