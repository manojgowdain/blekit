import { z } from "zod";

// ==========================
// Zod Schemas for BLEService
// ==========================

// Raw BLE payload: "HR,SPO2,TEMP_C,BATTERY,STEPS"
// Validated as a comma-separated string of exactly 5 numeric fields,
// each within a physiologically/device-sane range, before any
// downstream math (unit conversion, calories, distance) runs on it.
export const RawPayloadSchema = z
  .string()
  .trim()
  .refine((val) => val.split(",").length === 5, {
    message: "Payload must contain exactly 5 comma-separated fields",
  });

export const HealthReadingSchema = z.object({
  hr: z.number().finite().min(0).max(300),
  spo2: z.number().finite().min(0).max(100),
  tempC: z.number().finite().min(-20).max(60),
  battery: z.number().finite().min(0).max(100),
  steps: z.number().finite().min(0),
});

export const HealthMetricsSchema = z.object({
  heartRate: z.object({
    value: z.number(),
    measuring: z.boolean(), // true while hr is 0 / not yet available from the device
  }),
  spo2: z.object({
    value: z.number(),
    measuring: z.boolean(),
  }),
  temperature: z.object({
    celsius: z.number(),
    fahrenheit: z.number(),
    kelvin: z.number(),
    bodyTemperatureStatus: z.union([
      z.enum(["Low", "Slightly Low", "Normal", "Elevated", "Fever"]),
      z.literal("N/A"),
    ]),
    measuring: z.boolean(),
  }),
  battery: z.number(),
  measuring: z.boolean(), // true if ANY of hr/spo2/temp is currently 0 / unavailable
  ppg: z.object({
    steps: z.number(),
    calories: z.number(),
    distance: z.number(),
    walkingSpeedKmh: z.number().min(0),
    goal: z.object({
      steps: z.number().min(0).max(100),
      calories: z.number().min(0).max(100),
      distance: z.number().min(0).max(100),
      walkingSpeedKmh: z.number().min(0).max(100),
    }),
  }),
  stress: z.object({
    stressScore: z.union([z.number().min(0).max(100), z.literal("N/A")]),
    stressLevel: z.union([
      z.enum(["Relaxed", "Normal", "Elevated", "High", "Very High"]),
      z.literal("N/A"),
    ]),
    readinessScore: z.union([z.number().min(0).max(100), z.literal("N/A")]),
    productivityScore: z.union([z.number().min(0).max(100), z.literal("N/A")]),
    overallHealthScore: z.union([z.number().min(0).max(100), z.literal("N/A")]),
    energyScore: z.union([z.number().min(0).max(100), z.literal("N/A")]),
  }),
  activityLevel: z.number().min(0).max(100),
  hydrationReminder: z.object({
    targetLiters: z.number().min(0).max(5),
    baseGoalLiters: z.number().min(0),
    activityExtraLiters: z.number().min(0),
    waterIntakeLiters: z.number().min(0),
    remainingLiters: z.number().min(0).max(5),
    suggestedDrinkLiters: z.number().min(0).max(5),
    shouldNotify: z.boolean(),
  }),
});
export const DeviceIdSchema = z.string().min(1, "deviceId must be a non-empty string");

export const DeviceObjectSchema = z
  .object({
    connect: z.function(),
  })
  .passthrough();

// react-native-ble-plx expects base64-encoded characteristic writes.
export const Base64Schema = z
  .string()
  .min(1, "Command must be a non-empty base64 string")
  .regex(/^[A-Za-z0-9+/]+=*$/, "Command must be valid base64");

export const CharacteristicUUIDSchema = z
  .string()
  .min(1, "characteristicUUID must be a non-empty string");
