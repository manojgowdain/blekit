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
      z.enum(["Relaxed", "Normal", "Elevated", "High", "Very High"]),
      z.literal("N/A")
    ]),
    readinessScore: z.union([z.number().min(0).max(100), z.literal("N/A")]),
    productivityScore: z.union([z.number().min(0).max(100), z.literal("N/A")]),
    overallHealthScore: z.union([z.number().min(0).max(100), z.literal("N/A")]),
    energyScore: z.union([z.number().min(0).max(100), z.literal("N/A")])
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
        const connectedDevices = await this.manager.connectedDevices([
          SERVICE_UUID
        ]);
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
              new Error(
                `Invalid BLE payload "${raw}": ${rawResult.error.message}`
              ),
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
            steps: validSteps
          } = readingResult.data;
          const hrHasReading = validHr > 0;
          const spo2HasReading = validSpo2 > 0;
          const tempHasReading = validTempC > 0;
          if (hrHasReading) this.hrFilter.filter(validHr);
          if (spo2HasReading) this.spo2Filter.filter(validSpo2);
          if (tempHasReading) this.tempFilter.filter(validTempC);
          const hrReady = this.hrFilter.value !== null;
          const spo2Ready = this.spo2Filter.value !== null;
          const tempReady = this.tempFilter.value !== null;
          const allReady = hrReady && spo2Ready && tempReady;
          const hrMeasuring = !hrReady;
          const spo2Measuring = !spo2Ready;
          const tempMeasuring = !tempReady;
          const smoothedHr = hrReady ? Math.round(this.hrFilter.value) : 0;
          const smoothedSpo2 = spo2Ready ? Math.round(this.spo2Filter.value) : 0;
          const smoothedTempC = tempReady ? Number(this.tempFilter.value.toFixed(2)) : 0;
          const tempF = Number((smoothedTempC * 9 / 5 + 32).toFixed(2));
          const tempK = Number((smoothedTempC + 273.15).toFixed(2));
          const calories = Number((validSteps * 0.04).toFixed(2));
          const distance = Number((validSteps * 0.75 / 1e3).toFixed(2));
          const rawStress = allReady ? calculateStress(smoothedHr, smoothedSpo2, smoothedTempC) : { stressScore: 0, stressLevel: "Normal" };
          const elapsedHours = this.monitorStartedAt ? (Date.now() - this.monitorStartedAt) / 36e5 : 0;
          const healthScores = calculateHealthScores({
            hr: smoothedHr,
            spo2: smoothedSpo2,
            tempC: smoothedTempC,
            steps: validSteps,
            calories,
            distance,
            stressScore: rawStress.stressScore,
            elapsedHours,
            goalSteps,
            goalCalories,
            goalDistance,
            goalWalkingSpeedKmh,
            waterGoalLiters,
            waterIntakeLiters
          });
          const healthMetrics = {
            heartRate: { value: smoothedHr, measuring: hrMeasuring },
            spo2: { value: smoothedSpo2, measuring: spo2Measuring },
            temperature: {
              celsius: smoothedTempC,
              fahrenheit: tempF,
              kelvin: tempK,
              // Temp status only needs temp itself, not hr/spo2.
              bodyTemperatureStatus: tempReady ? healthScores.bodyTemperatureStatus : "N/A",
              measuring: tempMeasuring
            },
            battery: validBattery,
            measuring: hrMeasuring || spo2Measuring || tempMeasuring,
            ppg: {
              steps: validSteps,
              calories,
              distance,
              walkingSpeedKmh: healthScores.walkingSpeedKmh,
              goal: healthScores.goal
            },
            stress: {
              stressScore: allReady ? rawStress.stressScore : "N/A",
              stressLevel: allReady ? rawStress.stressLevel : "N/A",
              // These blend hr+spo2+temp+stress, so they wait on allReady too.
              readinessScore: allReady ? healthScores.readinessScore : "N/A",
              productivityScore: allReady ? healthScores.productivityScore : "N/A",
              overallHealthScore: allReady ? healthScores.overallHealthScore : "N/A",
              energyScore: allReady ? healthScores.energyScore : "N/A"
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
  connect,
  destroy,
  disconnect,
  getConnectedDevice,
  getServices,
  hasActiveMonitor,
  isConnected,
  monitorData,
  monitorHealthMetrics,
  onStateChange,
  read,
  requestBlePermission,
  scanDevices,
  sendCommand,
  stopMonitoring,
  stopScan,
  unpair
};
//# sourceMappingURL=ble.mjs.map