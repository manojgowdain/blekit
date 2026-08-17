// src/BLEService.schema.ts
import { z } from "zod";
var RawPayloadSchema = z.string().trim().refine((val) => val.split(",").length === 6, {
  message: "Payload must contain exactly 6 comma-separated fields"
});
var HealthReadingSchema = z.object({
  hr: z.number().finite().min(0).max(300),
  spo2: z.number().finite().min(0).max(100),
  tempC: z.number().finite().min(-20).max(60),
  battery: z.number().finite().min(0).max(100),
  steps: z.number().finite().min(0),
  hrv: z.number().finite().min(0).max(200)
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
      z.enum(["Relaxed", "Normal", "Elevated", "High"]),
      z.literal("N/A")
    ]),
    readinessScore: z.union([z.number().min(0).max(100), z.literal("N/A")]),
    productivityScore: z.union([z.number().min(0).max(100), z.literal("N/A")]),
    overallHealthScore: z.union([z.number().min(0).max(100), z.literal("N/A")]),
    energyScore: z.union([z.number().min(0).max(100), z.literal("N/A")])
  }),
  bloodPressure: z.object({
    systolic: z.union([z.number().min(80).max(200), z.literal("N/A")]),
    diastolic: z.union([z.number().min(40).max(130), z.literal("N/A")]),
    map: z.union([z.number().min(50).max(150), z.literal("N/A")]),
    confidence: z.union([z.number().min(0).max(100), z.literal("N/A")]),
    measuring: z.boolean()
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
export {
  Base64Schema,
  CharacteristicUUIDSchema,
  DeviceIdSchema,
  DeviceObjectSchema,
  HealthMetricsSchema,
  HealthReadingSchema,
  RawPayloadSchema
};
//# sourceMappingURL=BLEService.schema.mjs.map