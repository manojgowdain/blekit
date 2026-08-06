export { default as getDeviceInfo } from './info.mjs';
import '@react-native-community/netinfo';

declare function consoleApp(...args: any[]): Promise<void>;
declare function getCurrentStatus(): {
    isOnline: boolean;
    status: string;
    queue: {
        total: number;
        pending: number;
        sent: number;
        failed: number;
        items: number;
    };
    processing: boolean;
    timestamp: string;
};
declare function initializeLogger(): {
    consoleApp: typeof consoleApp;
    getCurrentStatus: typeof getCurrentStatus;
};

export { consoleApp, getCurrentStatus, initializeLogger };
