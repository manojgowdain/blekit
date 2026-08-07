import * as _react_native_community_netinfo from '@react-native-community/netinfo';

declare function getEnhancedDeviceInfo(): Promise<{
    device: {
        brand: string;
        manufacturer: string;
        model: string;
        deviceName: string;
        os: string;
        appVersion: string;
        build: string;
        uniqueId: string;
    };
    network: {
        type: _react_native_community_netinfo.NetInfoStateType;
        online: boolean;
        ip: string;
        vpn: boolean;
    };
    location: {
        latitude: any;
        longitude: any;
        accuracy: any;
        speed: any;
        googleMapsUrl: any;
    };
    battery: {
        level: number;
        charging: boolean;
    };
    security: {
        rooted: boolean;
        emulator: boolean;
        developerMode: boolean;
        mockLocation: boolean;
        screenLock: boolean;
    };
    storage: {
        free: number;
        total: number;
    };
    time: {
        timezone: string;
        locale: string;
    };
}>;

export { getEnhancedDeviceInfo as default };
