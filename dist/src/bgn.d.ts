import * as react_native from 'react-native';
import * as Notifications from 'expo-notifications';

/**
 * Configure notification channel (Android)
 */
declare const configureNotifications: () => Promise<void>;
/**
 * Request notification permission
 */
declare const requestNotificationPermission: () => Promise<boolean>;
/**
 * Background Service Options
 */
declare const backgroundServiceOptions: {
    taskName: string;
    taskTitle: string;
    taskDesc: string;
    taskIcon: {
        name: string;
        type: string;
    };
    color: string;
    linkingURI: string;
    foregroundServiceType: any;
    parameters: {
        delay: number;
    };
};
/**
 * Sleep helper
 */
declare const sleep: (time: any) => Promise<unknown>;
/**
 * Background Loop
 */
declare const veryIntensiveTask: (taskDataArguments?: any) => Promise<void>;
/**
 * Start Background Service
 */
declare const startBackgroundService: (options?: any) => Promise<boolean>;
/**
 * Stop Background Service
 */
declare const stopBackgroundService: () => Promise<boolean>;
/**
 * Check if Background Service is Running
 */
declare const isBackgroundServiceRunning: () => boolean;
/**
 * Subscribe to Background Tick Events
 */
declare const subscribeToBackgroundTicks: (listener: any) => react_native.EmitterSubscription;
/**
 * Subscribe to Background BLE Events
 */
declare const subscribeToBackgroundBle: (listener: any) => react_native.EmitterSubscription;
declare const getLastNotificationResponse: () => Promise<Notifications.NotificationResponse>;
declare const subscribeToNotificationTaps: (listener: any) => Notifications.EventSubscription;
/**
 * Send Local Notification
 */
declare const sendNormalNotification: (title: any, body: any, data?: {}) => Promise<void>;
/**
 * Update Foreground Notification
 */
declare const updatePersistentNotification: (options?: any) => Promise<void>;
/**
 * Cancel all notifications
 */
declare const cancelAllNotifications: () => Promise<void>;
/**
 * Cancel a scheduled notification
 */
declare const cancelNotification: (identifier: any) => Promise<void>;

export { backgroundServiceOptions, cancelAllNotifications, cancelNotification, configureNotifications, getLastNotificationResponse, isBackgroundServiceRunning, requestNotificationPermission, sendNormalNotification, sleep, startBackgroundService, stopBackgroundService, subscribeToBackgroundBle, subscribeToBackgroundTicks, subscribeToNotificationTaps, updatePersistentNotification, veryIntensiveTask };
