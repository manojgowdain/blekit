var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/BLEService.schema.ts
var BLEService_schema_exports = {};
__export(BLEService_schema_exports, {
  Base64Schema: () => Base64Schema,
  CharacteristicUUIDSchema: () => CharacteristicUUIDSchema,
  DeviceIdSchema: () => DeviceIdSchema,
  DeviceObjectSchema: () => DeviceObjectSchema,
  HealthMetricsSchema: () => HealthMetricsSchema,
  HealthReadingSchema: () => HealthReadingSchema,
  RawPayloadSchema: () => RawPayloadSchema
});
module.exports = __toCommonJS(BLEService_schema_exports);
var import_zod = require("zod");
var RawPayloadSchema = import_zod.z.string().trim().refine((val) => val.split(",").length === 5, {
  message: "Payload must contain exactly 5 comma-separated fields"
});
var HealthReadingSchema = import_zod.z.object({
  hr: import_zod.z.number().finite().min(0).max(300),
  spo2: import_zod.z.number().finite().min(0).max(100),
  tempC: import_zod.z.number().finite().min(-20).max(60),
  battery: import_zod.z.number().finite().min(0).max(100),
  steps: import_zod.z.number().finite().min(0)
});
var HealthMetricsSchema = import_zod.z.object({
  heartRate: import_zod.z.number(),
  spo2: import_zod.z.number(),
  temperature: import_zod.z.object({
    celsius: import_zod.z.number(),
    fahrenheit: import_zod.z.number(),
    kelvin: import_zod.z.number(),
    bodyTemperatureStatus: import_zod.z.enum(["Low", "Slightly Low", "Normal", "Elevated", "Fever"])
  }),
  battery: import_zod.z.number(),
  ppg: import_zod.z.object({
    steps: import_zod.z.number(),
    calories: import_zod.z.number(),
    distance: import_zod.z.number(),
    walkingSpeedKmh: import_zod.z.number().min(0),
    goal: import_zod.z.object({
      steps: import_zod.z.number().min(0).max(100),
      calories: import_zod.z.number().min(0).max(100),
      distance: import_zod.z.number().min(0).max(100),
      walkingSpeedKmh: import_zod.z.number().min(0).max(100)
    })
  }),
  stress: import_zod.z.object({
    stressScore: import_zod.z.number().min(0).max(100),
    stressLevel: import_zod.z.enum(["Relaxed", "Normal", "Elevated", "High", "Very High"]),
    readinessScore: import_zod.z.number().min(0).max(100),
    productivityScore: import_zod.z.number().min(0).max(100),
    overallHealthScore: import_zod.z.number().min(0).max(100),
    energyScore: import_zod.z.number().min(0).max(100)
  }),
  activityLevel: import_zod.z.number().min(0).max(100),
  hydrationReminder: import_zod.z.object({
    targetLiters: import_zod.z.number().min(0).max(5),
    baseGoalLiters: import_zod.z.number().min(0),
    activityExtraLiters: import_zod.z.number().min(0),
    waterIntakeLiters: import_zod.z.number().min(0),
    remainingLiters: import_zod.z.number().min(0).max(5),
    suggestedDrinkLiters: import_zod.z.number().min(0).max(5),
    shouldNotify: import_zod.z.boolean()
  })
  // raw: z.string(),
});
var DeviceIdSchema = import_zod.z.string().min(1, "deviceId must be a non-empty string");
var DeviceObjectSchema = import_zod.z.object({
  connect: import_zod.z.function()
}).passthrough();
var Base64Schema = import_zod.z.string().min(1, "Command must be a non-empty base64 string").regex(/^[A-Za-z0-9+/]+=*$/, "Command must be valid base64");
var CharacteristicUUIDSchema = import_zod.z.string().min(1, "characteristicUUID must be a non-empty string");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Base64Schema,
  CharacteristicUUIDSchema,
  DeviceIdSchema,
  DeviceObjectSchema,
  HealthMetricsSchema,
  HealthReadingSchema,
  RawPayloadSchema
});
//# sourceMappingURL=BLEService.schema.js.map