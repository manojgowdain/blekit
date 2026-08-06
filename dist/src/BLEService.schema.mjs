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
  heartRate: z.number(),
  spo2: z.number(),
  temperature: z.object({
    celsius: z.number(),
    fahrenheit: z.number(),
    kelvin: z.number(),
    bodyTemperatureStatus: z.enum(["Low", "Slightly Low", "Normal", "Elevated", "Fever"])
  }),
  battery: z.number(),
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
    stressScore: z.number().min(0).max(100),
    stressLevel: z.enum(["Relaxed", "Normal", "Elevated", "High", "Very High"]),
    readinessScore: z.number().min(0).max(100),
    productivityScore: z.number().min(0).max(100),
    overallHealthScore: z.number().min(0).max(100),
    energyScore: z.number().min(0).max(100)
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
  // raw: z.string(),
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