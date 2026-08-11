declare function isNewVersionAvailable(current: any, latest: any): boolean;
/**
 * Opens Android's "Install unknown apps" settings screen scoped to this app's
 * package, so the user can grant the permission if it isn't already granted.
 * Safe to call even if permission is already granted (it's a no-op UX-wise).
 */
declare function requestInstallPermission(): Promise<boolean>;
/**
 * Downloads the APK from `url` with progress callback, then launches
 * the system installer intent.
 */
declare function downloadAndInstallApk(url: any, onProgress: any): Promise<string>;
/**
 * Single entry-point utility: checks version, requests permission,
 * downloads, and installs. Takes url + currentVersion + updatedVersion.
 */
declare function runOtaUpdate({ url, currentVersion, updatedVersion, onProgress, }: {
    url: any;
    currentVersion: any;
    updatedVersion: any;
    onProgress: any;
}): Promise<{
    updated: boolean;
    reason: string;
    uri?: undefined;
} | {
    updated: boolean;
    uri: string;
    reason?: undefined;
}>;

export { downloadAndInstallApk, isNewVersionAvailable, requestInstallPermission, runOtaUpdate };
