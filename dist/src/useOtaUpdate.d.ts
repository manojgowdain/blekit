/**
 * status: 'idle' | 'available' | 'upToDate' | 'downloading' | 'done' | 'error'
 */
declare function useOtaUpdate({ url, currentVersion, updatedVersion }: {
    url: any;
    currentVersion: any;
    updatedVersion: any;
}): {
    status: string;
    progress: number;
    startUpdate: () => Promise<void>;
};

export { useOtaUpdate };
