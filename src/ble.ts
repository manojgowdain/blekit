import BLE from "./BLEService";

export const requestBlePermission = (): Promise<boolean> => BLE.requestPermissions();

// Subscribe to Bluetooth adapter state changes (poweredOn/Off/etc).
// Returns a subscription object — call .remove() to unsubscribe.
export const onStateChange = (callback: (state: string) => void, emitCurrentState: boolean = true) =>
  BLE.onStateChange(callback, emitCurrentState);

export const scanDevices = (): Promise<any[]> =>
  new Promise((resolve, reject) => {
    const devices: any[] = [];

    BLE.scanDevices(
      (device: any) => {
        if (!devices.find((d) => d.id === device.id)) {
          devices.push(device);
        }
      },
      (error: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(devices);
        }
      },
    );
  });

// Expects the full device object from scanDevices() results.
export const connect = (device: any): Promise<boolean> => BLE.connect(device);

// Expects a raw deviceId string (e.g. persisted from a previous pairing).
export const autoConnect = (deviceId: string): Promise<boolean> => BLE.autoConnect(deviceId);

export const disconnect = (): Promise<void> => BLE.disconnect();

export const isConnected = (): Promise<boolean> => BLE.isConnected();

export const monitorHealthMetrics = (callback: (error: any, data: any) => void, options?: any) =>
  BLE.monitorHealthMetrics(callback, options);

export const monitorData = (callback: (error: any, data: any) => void, options?: any) =>
  BLE.monitorHealthMetrics(callback, options);

export const stopMonitoring = (): void => BLE.stopMonitoring();

export const hasActiveMonitor = (): boolean => BLE.hasActiveMonitor();

export const stopScan = (): void => BLE.stopScan();

// characteristicUUID defaults to undefined here so BLEService falls
// back to CHARACTERISTICS.reset for existing call sites.
export const sendCommand = (base64: string, characteristicUUID?: string): Promise<boolean> =>
  BLE.sendCommand(base64, characteristicUUID);

export const read = (uuid: string): Promise<string> => BLE.read(uuid);

export const getServices = (): any => BLE.getServices();

export const getConnectedDevice = (): any => BLE.getConnectedDevice();

export const destroy = (): void => BLE.destroy();

export const unpair = async (): Promise<boolean> => {
  const device = BLE.getConnectedDevice();

  if (!device) return false;

  await BLE.disconnect();
  return true;
};
