import { useState, useCallback, useEffect, useRef } from "react";
import { Alert } from "react-native";
import { isNewVersionAvailable, runOtaUpdate } from "./otaUpdate";

type UseOtaUpdateParams = {
  url: string;
  currentVersion: string;
  updatedVersion: string;
};

/**
 * status: 'idle' | 'available' | 'upToDate' | 'downloading' | 'done' | 'error'
 */
export function useOtaUpdate({ url, currentVersion, updatedVersion }: UseOtaUpdateParams) {
  const isMountedRef = useRef(true);
  const [status, setStatus] = useState(
    isNewVersionAvailable(currentVersion, updatedVersion) ? "available" : "upToDate"
  );
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const startUpdate = useCallback(async () => {
    if (status === "upToDate" || status === "downloading") return;

    setStatus("downloading");
    setProgress(0);

    try {
      const res = await runOtaUpdate({
        url,
        currentVersion,
        updatedVersion,
        onProgress: (p) => {
          if (isMountedRef.current) setProgress(p);
        },
      });

      if (!isMountedRef.current) return;

      if (!res.updated) {
        setStatus("upToDate");
      } else {
        setStatus("done");
      }
    } catch (err) {
      console.error("OTA update failed:", err);
      if (!isMountedRef.current) return;

      setStatus("error");
      Alert.alert("Update failed", err.message || "Something went wrong.");
    }
  }, [url, currentVersion, updatedVersion, status]);

  return { status, progress, startUpdate };
}

export default useOtaUpdate;
