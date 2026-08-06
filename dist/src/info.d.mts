import * as _react_native_community_netinfo from '@react-native-community/netinfo';

declare function getDeviceInfo(): Promise<{
    brand: string;
    manufacturer: string;
    model: string;
    deviceName: string;
    os: string;
    battery: string;
    charging: string;
    appVersion: string;
    build: string;
    uniqueId: string;
    ip: string;
    wifi: _react_native_community_netinfo.NetInfoStateType;
    online: boolean;
}>;

export { getDeviceInfo as default };
