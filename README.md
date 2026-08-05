# blekit

A robust, TypeScript-ready Bluetooth Low Energy (BLE) SDK for React Native. 
Built specifically for wearables and health devices to read and manage sensors like Heart Rate, SpO2, Temperature, Steps, and Battery.

## Features

- **Built for React Native**: Seamlessly connects to BLE devices.
- **Robust Health Metrics**: Includes built-in Kalman filters to smooth noisy scalar sensor readings (HR, SpO2, Temperature).
- **Background Tasks**: Fully supports background operations for continuous data collection.
- **TypeScript Ready**: Full type definitions included for a great developer experience.

## Installation

You can install `blekit` using your favorite package manager:

```bash
# Using npm
npm i blekit

# Using bun
bun install blekit

# Using yarn
yarn add blekit
```

### Peer Dependencies

Make sure your project includes the required peer dependencies for React Native BLE support (e.g. `react-native-ble-plx`, `react-native-background-actions`).

## Usage

Here's a quick example of how to scan and connect to a device:

```typescript
import BLE from 'blekit';

// Request necessary Bluetooth permissions
const hasPermission = await BLE.requestBlePermission();

if (hasPermission) {
  // Scan for nearby devices
  BLE.scanDevices()
    .then(devices => {
      console.log("Found devices:", devices);
    })
    .catch(error => {
      console.error("Scan error:", error);
    });
}
```

### Connecting & Monitoring Health Data

```typescript
// Connect to a specific device
await BLE.connect(myDevice);

// Monitor incoming health metrics
BLE.monitorHealthMetrics((error, data) => {
  if (error) {
    console.error("Monitoring Error:", error);
    return;
  }
  
  console.log("Heart Rate:", data.heartRate);
  console.log("SpO2:", data.spo2);
  console.log("Temperature:", data.temperature.celsius);
  console.log("Steps:", data.ppg.steps);
  console.log("Battery:", data.battery);
});
```

## Background Processing

`blekit` includes utilities for managing background connections and data syncing:

```typescript
import { startBackgroundService, stopBackgroundService } from 'blekit';

// Start a background service for persistent connection
await startBackgroundService({
  deviceId: "DEVICE_MAC_ADDRESS",
  onHealthMetrics: (metrics) => {
    console.log("Background reading:", metrics);
  }
});
```

## License

MIT
# blekit
