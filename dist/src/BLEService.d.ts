import * as react_native_ble_plx from 'react-native-ble-plx';
import { BleManager } from 'react-native-ble-plx';
import { KalmanFilter } from './KalmanFilter.js';

declare class BLEService {
    manager: BleManager;
    device: any;
    subscription: any;
    monitorRestartTimer: any;
    monitorStartedAt: number | null;
    connectionPromise: Promise<any> | null;
    hrFilter: KalmanFilter;
    spo2Filter: KalmanFilter;
    tempFilter: KalmanFilter;
    constructor();
    _resetFilters(): void;
    requestPermissions(): Promise<boolean>;
    onStateChange(callback: any, emitCurrentState?: boolean): react_native_ble_plx.Subscription;
    scanDevices(onDevice: any, onFinish: any, timeout?: number): void;
    stopScan(): void;
    connect(device: any): Promise<any>;
    autoConnect(deviceId: any): Promise<any>;
    isConnected(): Promise<any>;
    disconnect(): Promise<void>;
    monitorHealthMetrics(callback: any, options?: any): any;
    stopMonitoring(): void;
    hasActiveMonitor(): boolean;
    clearMonitorRestart(): void;
    isMonitorCancellationError(error: any): boolean;
    scheduleMonitorRestart(callback: any, options: any): void;
    describeBleError(error: any): string;
    syncDeviceTime(): Promise<any>;
    sendCommand(base64Command: any, characteristicUUID?: string): Promise<any>;
    read(uuid: any): Promise<any>;
    getServices(): Promise<any>;
    getConnectedDevice(): any;
    rememberDeviceId(deviceId: any): Promise<boolean>;
    getRememberedDeviceId(): Promise<string>;
    clearRememberedDeviceId(): Promise<void>;
    destroy(): void;
}
declare const _default: BLEService;

export { _default as default };
