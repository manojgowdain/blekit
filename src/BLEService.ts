import "react-native-get-random-values";
import { BleManager } from "react-native-ble-plx";
import { Platform, PermissionsAndroid } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { decode as atob, encode as btoa } from "base-64";
import { SERVICE_UUID, CHARACTERISTICS } from "./BLEConfig.js";
import { KalmanFilter } from "./KalmanFilter.js";
import {
  RawPayloadSchema,
  HealthReadingSchema,
  HealthMetricsSchema,
  DeviceIdSchema,
  DeviceObjectSchema,
  Base64Schema,
  CharacteristicUUIDSchema,
} from "./BLEService.schema.js";

const LAST_DEVICE_ID_KEY = "haloband:lastBleDeviceId";
const DEFAULT_GOAL_STEPS = 10000;
const DEFAULT_GOAL_WALKING_SPEED_KMH = 5;
const DEFAULT_WATER_GOAL_LITERS = 3;

function clampScore(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function calculateGoalPercent(value, goal) {
  if (!Number.isFinite(goal) || goal <= 0) return 0;
  return clampScore(Math.min((value / goal) * 100, 100));
}

function estimateBP({
  hr,
  hrv,
  age,
  height,
  weight,
  sex,
  spo2,
  temperature
}) {
  if (
    !Number.isFinite(hr) ||
    !Number.isFinite(hrv) ||
    !Number.isFinite(age) ||
    !Number.isFinite(height) ||
    !Number.isFinite(weight)
  ) {
    throw new Error("Invalid BP input");
  }

  const heightM = height / 100;
  const bmi = weight / (heightM * heightM);

  const sexFactor = sex === "male" ? 2 : 0;

  let systolic =
    95 +
    age * 0.35 +
    bmi * 0.45 +
    hr * 0.12 +
    sexFactor -
    hrv * 0.05;

  let diastolic =
    58 +
    age * 0.20 +
    bmi * 0.25 +
    hr * 0.06 +
    sexFactor * 0.4 -
    hrv * 0.025;

  systolic = Math.round(Math.max(80, Math.min(200, systolic)));
  diastolic = Math.round(Math.max(40, Math.min(130, diastolic)));

  const map = Math.round(
    diastolic + (systolic - diastolic) / 3
  );

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

function calculateStress({
  hr,
  hrv,
  spo2,
  temperature,
  activity = 0
}) {
  // Normalize HR
  // Resting HR around 60–80 is treated as lower stress.
  const hrStress = Math.min(
    100,
    Math.max(0, ((hr - 60) / 60) * 100)
  );

  // Lower HRV generally corresponds to higher stress.
  const hrvStress = Math.min(
    100,
    Math.max(0, ((60 - hrv) / 60) * 100)
  );

  // SpO2 should have only a small influence on stress.
  const spo2Stress = Math.min(
    100,
    Math.max(0, (95 - spo2) * 20)
  );

  // Temperature deviation from approximately 36.5–37°C.
  const temperatureStress = Math.min(
    100,
    Math.abs(temperature - 36.7) * 20
  );

  // Activity should be used to avoid interpreting exercise HR as stress.
  const activityFactor = Math.min(
    100,
    Math.max(0, activity)
  );

  // Weighted stress score
  let stress =
    hrStress * 0.30 +
    hrvStress * 0.40 +
    spo2Stress * 0.05 +
    temperatureStress * 0.05 +
    activityFactor * 0.20;

  stress = Math.round(
    Math.max(0, Math.min(100, stress))
  );

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

function estimateVO2Max({
  hr,
  hrv,
  age,
  sex,
  restingHr = 60,
  maxHr = 220
}) {
  if (
    !Number.isFinite(hr) ||
    !Number.isFinite(hrv) ||
    !Number.isFinite(age) ||
    !Number.isFinite(restingHr) ||
    !Number.isFinite(maxHr)
  ) {
    throw new Error("Invalid VO2Max input");
  }

  // Estimate VO2Max using heart rate ratio method (heart rate reserve)
  // VO2Max ≈ 15.3 × (HRmax / HRrest) - this is a simplified version
  // More accurate: use HRV and submaximal HR
  const hrReserve = maxHr - restingHr;
  const hrRatio = (hr - restingHr) / hrReserve;

  // Base VO2Max estimation from age and sex
  let baseVO2Max = sex === "male"
    ? 60 - age * 0.5  // Male: ~60 at age 0, declines ~0.5/year
    : 48 - age * 0.4; // Female: ~48 at age 0, declines ~0.4/year

  // Adjust based on HRV (higher HRV = better fitness)
  const hrvFactor = Math.min(1.3, Math.max(0.7, hrv / 50));

  // Adjust based on submaximal HR (lower HR at same effort = better fitness)
  const hrFactor = Math.max(0.5, 1.5 - hrRatio);

  let vo2Max = baseVO2Max * hrvFactor * hrFactor;

  // Clamp to reasonable range
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
  waterIntakeLiters = 0,
}) {
  const activityExtraLiters = Number(
    (distance * 0.03 + (calories / 1000) * 0.5).toFixed(2),
  );
  const targetLiters = Number(
    Math.min(waterGoalLiters + activityExtraLiters, 5).toFixed(2),
  );
  const remainingLiters = Number(
    Math.max(targetLiters - waterIntakeLiters, 0).toFixed(2),
  );

  return {
    targetLiters,
    baseGoalLiters: waterGoalLiters,
    activityExtraLiters,
    waterIntakeLiters,
    remainingLiters,
    suggestedDrinkLiters: remainingLiters,
    shouldNotify: remainingLiters > 0,
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
  goalDistance = (goalSteps * 0.75) / 1000,
  goalWalkingSpeedKmh = DEFAULT_GOAL_WALKING_SPEED_KMH,
  waterGoalLiters = DEFAULT_WATER_GOAL_LITERS,
  waterIntakeLiters = 0,
}) {
  const hrScore = clampScore(100 - Math.abs(hr - 70) * 2);
  const stressScoreNorm = clampScore(100 - stressScore);
  const spo2Score = clampScore(spo2 >= 95 ? 100 : spo2 * 2);
  const tempScore = clampScore(100 - Math.abs(tempC - 36.6) * 25);
  const activityScore = clampScore(Math.min((steps / goalSteps) * 100, 100));
  const stressPenalty = stressScore;
  const hrPenalty = 100 - hrScore;
  const oxygenHealth = spo2Score;
  const wellness = clampScore(
    0.35 * hrScore + 0.35 * stressScoreNorm + 0.2 * spo2Score + 0.1 * tempScore,
  );

  const readinessScore = clampScore(
    0.35 * hrScore + 0.35 * stressScoreNorm + 0.2 * spo2Score + 0.1 * tempScore,
  );
  const activityLevel = activityScore;
  const energyScore = clampScore(
    100 - (0.3 * activityScore + 0.4 * stressPenalty + 0.3 * hrPenalty),
  );
  const hydrationReminder = calculateHydrationReminder({
    calories,
    distance,
    waterGoalLiters,
    waterIntakeLiters,
  });
  const walkingSpeedKmh =
    elapsedHours > 0 ? Number((distance / elapsedHours).toFixed(2)) : 0;
  const goal = {
    steps: calculateGoalPercent(steps, goalSteps),
    calories: calculateGoalPercent(calories, goalCalories),
    distance: calculateGoalPercent(distance, goalDistance),
    walkingSpeedKmh: calculateGoalPercent(walkingSpeedKmh, goalWalkingSpeedKmh),
  };
  const productivityScore = clampScore(
    0.4 * wellness + 0.3 * energyScore + 0.3 * readinessScore,
  );
  const overallHealthScore = clampScore(
    0.2 * hrScore +
      0.2 * oxygenHealth +
      0.15 * activityScore +
      0.15 * wellness +
      0.15 * readinessScore +
      0.15 * stressScoreNorm,
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
    overallHealthScore,
  };
}

class BLEService {
  manager: BleManager;
  device: any;
  subscription: any;
  monitorRestartTimer: any;
  monitorStartedAt: number | null;
  connectionPromise: Promise<any> | null;
  hrFilter!: KalmanFilter;
  spo2Filter!: KalmanFilter;
  tempFilter!: KalmanFilter;
  hrvFilter!: KalmanFilter;

  constructor() {
    this.manager = new BleManager({
      restoreStateIdentifier: "BleBackgroundRestoreId",
    });
    this.device = null;
    this.subscription = null;
    this.monitorRestartTimer = null;
    this.monitorStartedAt = null;
    this.connectionPromise = null;

    // Kalman filters smooth the noisy sensor channels (HR, SpO2,
    // temperature) so a single garbage/dropped-bit sample from the
    // wearable doesn't spike straight through to the UI. Battery and
    // steps are monotonic/discrete counters, not noisy analog
    // readings, so they're passed through unfiltered.
    this._resetFilters();
  }

  _resetFilters() {
    this.hrFilter = new KalmanFilter({ R: 4, Q: 0.05 });
    this.spo2Filter = new KalmanFilter({ R: 2, Q: 0.02 });
    this.tempFilter = new KalmanFilter({ R: 0.5, Q: 0.01 });
    this.hrvFilter = new KalmanFilter({ R: 10, Q: 0.1 });
  }

  // ==========================
  // Request Permissions
  // ==========================
  async requestPermissions() {
    if (Platform.OS !== "android") return true;

    if (Platform.Version >= 31) {
      const result = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);

      return (
        result["android.permission.BLUETOOTH_SCAN"] === "granted" &&
        result["android.permission.BLUETOOTH_CONNECT"] === "granted"
      );
    }

    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
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
  scanDevices(onDevice, onFinish, timeout = 5000) {
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
        `connect() expects a scanned device object with a connect() method: ${parsed.error.message}`,
      );
    }

    this.stopScan();

    this.device = await device.connect();

    await this.device.discoverAllServicesAndCharacteristics();
    await this.rememberDeviceId(this.device.id);

    // Fresh device, fresh sensor stream — don't let filters carry
    // stale estimates over from a previous connection.
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
        `autoConnect() invalid deviceId: ${parsed.error.message}`,
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
          SERVICE_UUID,
        ]);
        this.device =
          connectedDevices.find((device) => device.id === parsed.data) ||
          (await this.manager.connectToDevice(parsed.data, {
            autoConnect: false,
            timeout: 15000,
          }));

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

  monitorHealthMetrics(callback: any, options: any = {}) {
    const {
      replaceExisting = true,
      restartOnCancel = true,
      restartDelay = 1000,
      goalSteps = DEFAULT_GOAL_STEPS,
      goalCalories = goalSteps * 0.04,
      goalDistance = (goalSteps * 0.75) / 1000,
      goalWalkingSpeedKmh = DEFAULT_GOAL_WALKING_SPEED_KMH,
      waterGoalLiters = DEFAULT_WATER_GOAL_LITERS,
      waterIntakeLiters = 0,
      // User profile for BP estimation (with defaults)
      age = 30,
      height = 170,
      weight = 70,
      sex = "male",
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
              restartDelay,
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
                `Invalid BLE payload "${raw}": ${rawResult.error.message}`,
              ),
              null,
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
            hrv,
          });

          if (!readingResult.success) {
            callback(
              new Error(
                `BLE payload out of range "${raw}": ${readingResult.error.message}`,
              ),
              null,
            );
            return;
          }

          const {
            hr: validHr,
            spo2: validSpo2,
            tempC: validTempC,
            battery: validBattery,
            steps: validSteps,
            hrv: validHrv,
          } = readingResult.data;

          // The device sends 0 for hr/spo2/temp/hrv while that specific
          // sensor hasn't produced a real reading yet, or drops one
          // mid-stream. Treat 0 as "not measured this tick" — don't
          // feed it into the Kalman filter, and flag it so the UI can
          // show "measuring..." for that one parameter.
          const hrHasReading = validHr > 0;
          const spo2HasReading = validSpo2 > 0;
          const tempHasReading = validTempC > 0;
          const hrvHasReading = validHrv > 0;

          if (hrHasReading) this.hrFilter.filter(validHr);
          if (spo2HasReading) this.spo2Filter.filter(validSpo2);
          if (tempHasReading) this.tempFilter.filter(validTempC);
          if (hrvHasReading) this.hrvFilter.filter(validHrv);

          const hrReady = this.hrFilter.value !== null;
          const spo2Ready = this.spo2Filter.value !== null;
          const tempReady = this.tempFilter.value !== null;
          const hrvReady = this.hrvFilter.value !== null;
          const allReady = hrReady && spo2Ready && tempReady && hrvReady;

          // Per-parameter "still waiting on this sensor" flags.
          const hrMeasuring = !hrReady;
          const spo2Measuring = !spo2Ready;
          const tempMeasuring = !tempReady;
          const hrvMeasuring = !hrvReady;

          const smoothedHr = hrReady
            ? Math.round(this.hrFilter.value as number)
            : 0;
          const smoothedSpo2 = spo2Ready
            ? Math.round(this.spo2Filter.value as number)
            : 0;
          const smoothedTempC = tempReady
            ? Number((this.tempFilter.value as number).toFixed(2))
            : 0;
          const smoothedHrv = hrvReady
            ? Math.round(this.hrvFilter.value as number)
            : 0;

          const tempF = Number(((smoothedTempC * 9) / 5 + 32).toFixed(2));
          const tempK = Number((smoothedTempC + 273.15).toFixed(2));

          const calories = Number((validSteps * 0.04).toFixed(2));
          const distance = Number(((validSteps * 0.75) / 1000).toFixed(2));

          // Only trust stress once hr, spo2, temp, AND hrv have each given
          // us a real reading — one sensor lagging shouldn't poison it.
          const rawStress = allReady
            ? calculateStress({
                hr: smoothedHr,
                hrv: smoothedHrv,
                spo2: smoothedSpo2,
                temperature: smoothedTempC,
                activity: 0, // Default activity to 0
              })
            : { score: 0, level: "Normal" as const };

          // Estimate blood pressure when all sensors are ready
          const bpEstimate = allReady
            ? estimateBP({
                hr: smoothedHr,
                hrv: smoothedHrv,
                age,
                height,
                weight,
                sex,
                spo2: smoothedSpo2,
                temperature: smoothedTempC,
              })
            : null;
          const bloodPressure: {
            systolic: number | "N/A";
            diastolic: number | "N/A";
            map: number | "N/A";
            confidence: number | "N/A";
            measuring: boolean;
          } = bpEstimate
            ? { ...bpEstimate, measuring: false }
            : { systolic: "N/A", diastolic: "N/A", map: "N/A", confidence: "N/A", measuring: true };

          // Estimate VO2Max when all sensors are ready
          const vo2MaxEstimate = allReady
            ? estimateVO2Max({
                hr: smoothedHr,
                hrv: smoothedHrv,
                age,
                sex,
              })
            : null;
          const vo2Max: {
            value: number | "N/A";
            level: "Poor" | "Below Average" | "Average" | "Above Average" | "Excellent" | "N/A";
            measuring: boolean;
          } = vo2MaxEstimate
            ? { ...vo2MaxEstimate, measuring: false }
            : { value: "N/A", level: "N/A", measuring: true };

          const elapsedHours = this.monitorStartedAt
            ? (Date.now() - this.monitorStartedAt) / 3600000
            : 0;

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
            waterIntakeLiters,
          });

          const healthMetrics = {
            heartRate: { value: smoothedHr, measuring: hrMeasuring },
            spo2: { value: smoothedSpo2, measuring: spo2Measuring },
            temperature: {
              celsius: smoothedTempC,
              fahrenheit: tempF,
              kelvin: tempK,
              // Temp status only needs temp itself, not hr/spo2.
              bodyTemperatureStatus: tempReady
                ? healthScores.bodyTemperatureStatus
                : "N/A",
              measuring: tempMeasuring,
            },
            battery: validBattery,
            measuring: hrMeasuring || spo2Measuring || tempMeasuring || hrvMeasuring,
            ppg: {
              steps: validSteps,
              calories,
              distance,
              walkingSpeedKmh: healthScores.walkingSpeedKmh,
              goal: healthScores.goal,
            },
            stress: {
              stressScore: allReady ? rawStress.score : "N/A",
              stressLevel: allReady ? rawStress.level : "N/A",
              // These blend hr+spo2+temp+stress, so they wait on allReady too.
              readinessScore: allReady ? healthScores.readinessScore : "N/A",
              productivityScore: allReady
                ? healthScores.productivityScore
                : "N/A",
              overallHealthScore: allReady
                ? healthScores.overallHealthScore
                : "N/A",
              energyScore: allReady ? healthScores.energyScore : "N/A",
            },
            bloodPressure: {
              systolic: bloodPressure.systolic,
              diastolic: bloodPressure.diastolic,
              map: bloodPressure.map,
              confidence: bloodPressure.confidence,
              measuring: bloodPressure.measuring,
            },
            hrv: {
              value: allReady ? smoothedHrv : "N/A",
              measuring: hrvMeasuring,
            },
            vo2Max: {
              value: vo2Max.value,
              level: vo2Max.level,
              measuring: vo2Max.measuring,
            },
            activityLevel: healthScores.activityLevel,
            hydrationReminder: healthScores.hydrationReminder,
          };

          const outputResult = HealthMetricsSchema.safeParse(healthMetrics);
          if (!outputResult.success) {
            callback(
              new Error(
                `Failed to build healthMetrics object: ${outputResult.error.message}`,
              ),
              null,
            );
            return;
          }

          callback(null, outputResult.data);
        } catch (err) {
          callback(err, null);
        }
      },
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
    return (
      message.includes("operation was cancelled") ||
      message.includes("operation canceled")
    );
  }

  scheduleMonitorRestart(callback, options) {
    this.clearMonitorRestart();

    this.monitorRestartTimer = setTimeout(async () => {
      this.monitorRestartTimer = null;

      if (!(await this.isConnected())) return;

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
      androidErrorCode: error.androidErrorCode,
    });
  }

  async syncDeviceTime() {
    if (!this.device) {
      throw new Error("No Device Connected");
    }

    const now = new Date();

    const pad = (n) => String(n).padStart(2, "0");

    // Format: YYYY-MM-DD HH:mm:ss
    const timeString =
      `${now.getFullYear()}-` +
      `${pad(now.getMonth() + 1)}-` +
      `${pad(now.getDate())} ` +
      `${pad(now.getHours())}:` +
      `${pad(now.getMinutes())}:` +
      `${pad(now.getSeconds())}`;

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
        `sendCommand() invalid base64Command: ${commandResult.error.message}`,
      );
    }

    const uuidResult = CharacteristicUUIDSchema.safeParse(characteristicUUID);
    if (!uuidResult.success) {
      throw new Error(
        `sendCommand() invalid characteristicUUID: ${uuidResult.error.message}`,
      );
    }

    try {
      return await this.device.writeCharacteristicWithResponseForService(
        SERVICE_UUID,
        uuidResult.data,
        commandResult.data,
      );
    } catch {
      return await this.device.writeCharacteristicWithoutResponseForService(
        SERVICE_UUID,
        uuidResult.data,
        commandResult.data,
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
      uuidResult.data,
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
}

export default new BLEService();
