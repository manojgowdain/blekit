// src/otaUpdate.ts
import { Platform } from "react-native";
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
  if (Platform.OS !== "android") return true;
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
export {
  downloadAndInstallApk,
  isNewVersionAvailable,
  requestInstallPermission,
  runOtaUpdate
};
//# sourceMappingURL=otaUpdate.mjs.map