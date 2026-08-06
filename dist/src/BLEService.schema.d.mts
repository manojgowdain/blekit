import { z } from 'zod';

declare const RawPayloadSchema: z.ZodString;
declare const HealthReadingSchema: z.ZodObject<{
    hr: z.ZodNumber;
    spo2: z.ZodNumber;
    tempC: z.ZodNumber;
    battery: z.ZodNumber;
    steps: z.ZodNumber;
}, z.core.$strip>;
declare const HealthMetricsSchema: z.ZodObject<{
    heartRate: z.ZodNumber;
    spo2: z.ZodNumber;
    temperature: z.ZodObject<{
        celsius: z.ZodNumber;
        fahrenheit: z.ZodNumber;
        kelvin: z.ZodNumber;
        bodyTemperatureStatus: z.ZodEnum<{
            Low: "Low";
            "Slightly Low": "Slightly Low";
            Normal: "Normal";
            Elevated: "Elevated";
            Fever: "Fever";
        }>;
    }, z.core.$strip>;
    battery: z.ZodNumber;
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
        stressScore: z.ZodNumber;
        stressLevel: z.ZodEnum<{
            Normal: "Normal";
            Elevated: "Elevated";
            Relaxed: "Relaxed";
            High: "High";
            "Very High": "Very High";
        }>;
        readinessScore: z.ZodNumber;
        productivityScore: z.ZodNumber;
        overallHealthScore: z.ZodNumber;
        energyScore: z.ZodNumber;
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
