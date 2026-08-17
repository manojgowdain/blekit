import { z } from 'zod';

declare const RawPayloadSchema: z.ZodString;
declare const HealthReadingSchema: z.ZodObject<{
    hr: z.ZodNumber;
    spo2: z.ZodNumber;
    tempC: z.ZodNumber;
    battery: z.ZodNumber;
    steps: z.ZodNumber;
    hrv: z.ZodNumber;
}, z.core.$strip>;
declare const HealthMetricsSchema: z.ZodObject<{
    heartRate: z.ZodObject<{
        value: z.ZodNumber;
        measuring: z.ZodBoolean;
    }, z.core.$strip>;
    spo2: z.ZodObject<{
        value: z.ZodNumber;
        measuring: z.ZodBoolean;
    }, z.core.$strip>;
    temperature: z.ZodObject<{
        celsius: z.ZodNumber;
        fahrenheit: z.ZodNumber;
        kelvin: z.ZodNumber;
        bodyTemperatureStatus: z.ZodUnion<readonly [z.ZodEnum<{
            Low: "Low";
            "Slightly Low": "Slightly Low";
            Normal: "Normal";
            Elevated: "Elevated";
            Fever: "Fever";
        }>, z.ZodLiteral<"N/A">]>;
        measuring: z.ZodBoolean;
    }, z.core.$strip>;
    battery: z.ZodNumber;
    measuring: z.ZodBoolean;
    ppg: z.ZodObject<{
        steps: z.ZodNumber;
        calories: z.ZodNumber;
        distance: z.ZodNumber;
        walkingSpeedKmh: z.ZodNumber;
        goal: z.ZodObject<{
            steps: z.ZodNumber;
            calories: z.ZodNumber;
            distance: z.ZodNumber;
            walkingSpeedKmh: z.ZodNumber;
        }, z.core.$strip>;
    }, z.core.$strip>;
    stress: z.ZodObject<{
        stressScore: z.ZodUnion<readonly [z.ZodNumber, z.ZodLiteral<"N/A">]>;
        stressLevel: z.ZodUnion<readonly [z.ZodEnum<{
            Normal: "Normal";
            Elevated: "Elevated";
            Relaxed: "Relaxed";
            High: "High";
        }>, z.ZodLiteral<"N/A">]>;
        readinessScore: z.ZodUnion<readonly [z.ZodNumber, z.ZodLiteral<"N/A">]>;
        productivityScore: z.ZodUnion<readonly [z.ZodNumber, z.ZodLiteral<"N/A">]>;
        overallHealthScore: z.ZodUnion<readonly [z.ZodNumber, z.ZodLiteral<"N/A">]>;
        energyScore: z.ZodUnion<readonly [z.ZodNumber, z.ZodLiteral<"N/A">]>;
    }, z.core.$strip>;
    bloodPressure: z.ZodObject<{
        systolic: z.ZodUnion<readonly [z.ZodNumber, z.ZodLiteral<"N/A">]>;
        diastolic: z.ZodUnion<readonly [z.ZodNumber, z.ZodLiteral<"N/A">]>;
        map: z.ZodUnion<readonly [z.ZodNumber, z.ZodLiteral<"N/A">]>;
        confidence: z.ZodUnion<readonly [z.ZodNumber, z.ZodLiteral<"N/A">]>;
        measuring: z.ZodBoolean;
    }, z.core.$strip>;
    hrv: z.ZodObject<{
        value: z.ZodUnion<readonly [z.ZodNumber, z.ZodLiteral<"N/A">]>;
        measuring: z.ZodBoolean;
    }, z.core.$strip>;
    vo2Max: z.ZodObject<{
        value: z.ZodUnion<readonly [z.ZodNumber, z.ZodLiteral<"N/A">]>;
        level: z.ZodUnion<readonly [z.ZodEnum<{
            Poor: "Poor";
            "Below Average": "Below Average";
            Average: "Average";
            "Above Average": "Above Average";
            Excellent: "Excellent";
        }>, z.ZodLiteral<"N/A">]>;
        measuring: z.ZodBoolean;
    }, z.core.$strip>;
    activityLevel: z.ZodNumber;
    hydrationReminder: z.ZodObject<{
        targetLiters: z.ZodNumber;
        baseGoalLiters: z.ZodNumber;
        activityExtraLiters: z.ZodNumber;
        waterIntakeLiters: z.ZodNumber;
        remainingLiters: z.ZodNumber;
        suggestedDrinkLiters: z.ZodNumber;
        shouldNotify: z.ZodBoolean;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const DeviceIdSchema: z.ZodString;
declare const DeviceObjectSchema: z.ZodObject<{
    connect: z.ZodFunction<z.core.$ZodFunctionArgs, z.core.$ZodFunctionOut>;
}, z.core.$loose>;
declare const Base64Schema: z.ZodString;
declare const CharacteristicUUIDSchema: z.ZodString;

export { Base64Schema, CharacteristicUUIDSchema, DeviceIdSchema, DeviceObjectSchema, HealthMetricsSchema, HealthReadingSchema, RawPayloadSchema };
