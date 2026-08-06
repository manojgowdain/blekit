import * as react_native_ble_plx from 'react-native-ble-plx';

declare const requestBlePermission: () => Promise<boolean>;
declare const onStateChange: (callback: (state: string) => void, emitCurrentState?: boolean) => react_native_ble_plx.Subscription;
declare const scanDevices: () => Promise<any[]>;
declare const connect: (device: any) => Promise<boolean>;
declare const autoConnect: (deviceId: string) => Promise<boolean>;
declare const disconnect: () => Promise<void>;
declare const isConnected: () => Promise<boolean>;
declare const monitorHealthMetrics: (callback: (error: any, data: any) => void, options?: any) => any;
declare const monitorData: (callback: (error: any, data: any) => void, options?: any) => any;
declare const stopMonitoring: () => void;
declare const hasActiveMonitor: () => boolean;
declare const stopScan: () => void;
declare const sendCommand: (base64: string, characteristicUUID?: string) => Promise<boolean>;
declare const read: (uuid: string) => Promise<string>;
declare const getServices: () => any;
declare const getConnectedDevice: () => any;
declare const destroy: () => void;
declare const unpair: () => Promise<boolean>;

export { autoConnect, connect, destroy, disconnect, getConnectedDevice, getServices, hasActiveMonitor, isConnected, monitorData, monitorHealthMetrics, onStateChange, read, requestBlePermission, scanDevices, sendCommand, stopMonitoring, stopScan, unpair };
