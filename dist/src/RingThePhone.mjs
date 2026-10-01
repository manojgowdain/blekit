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
var nativeSelect, Platform, Platform_default;
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
    Platform = {
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
    Platform_default = Platform;
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
import { useCallback, useEffect, useRef, useState } from "react";
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
import { useEffect as useEffect2, useMemo, useRef as useRef2 } from "react";
function useReleasingSharedObject(factory, dependencies) {
  const objectRef = useRef2(null);
  const objectRefToRelease = useRef2(null);
  const isFastRefresh = useRef2(false);
  const previousDependencies = useRef2(dependencies);
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
  useEffect2(() => {
    if (objectRefToRelease.current) {
      objectRefToRelease.current.release();
      objectRefToRelease.current = null;
    }
  }, [object]);
  useMemo(() => {
    isFastRefresh.current = true;
  }, []);
  useEffect2(() => {
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
import Constants from "expo-constants";

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
  return Constants.__unsafeNoWarnManifest2;
}
var manifestBaseUrl = Constants.experienceUrl ? getManifestBaseUrl(Constants.experienceUrl) : null;

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
import { useEffect as useEffect3, useMemo as useMemo2 } from "react";
import { Platform as Platform2 } from "react-native";

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
  if (Platform2.OS === "android") {
    return setPlaybackRate.call(this, rate);
  } else {
    return setPlaybackRate.call(this, rate, pitchCorrectionQuality);
  }
};
if (!Platform2.isTV || Platform2.OS !== "ios") {
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
  useEffect3(() => {
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
  usePhoneRingtone
};
//# sourceMappingURL=RingThePhone.mjs.map