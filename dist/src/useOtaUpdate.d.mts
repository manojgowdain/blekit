type UseOtaUpdateParams = {
    url: string;
    currentVersion: string;
    updatedVersion: string;
};
/**
 * status: 'idle' | 'available' | 'upToDate' | 'downloading' | 'done' | 'error'
 */
declare function useOtaUpdate({ url, currentVersion, updatedVersion }: UseOtaUpdateParams): {
    status: string;
    progress: number;
    startUpdate: () => Promise<void>;
};

export { useOtaUpdate as default, useOtaUpdate };
