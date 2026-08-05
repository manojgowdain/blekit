import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['index.ts', 'src/**/*.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react-native', '@react-native-community/netinfo', 'expo-notifications', 'react-native-background-actions', 'react-native-ble-plx', 'axios', 'base-64', 'expo-background-fetch', 'expo-battery', 'expo-device', 'expo-task-manager', 'expo-updates', 'react-native-device-info', 'react-native-get-random-values', 'zod', '@react-native-async-storage/async-storage'],
});
