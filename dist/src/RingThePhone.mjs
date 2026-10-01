// src/RingThePhone.ts
import { useAudioPlayer } from "expo-audio";
function usePhoneRingtone(audioSource) {
  const player = useAudioPlayer(audioSource);
  const startRingtone = () => {
    player.seekTo(0);
    player.play();
  };
  const stopRingtone = () => {
    player.pause();
    player.seekTo(0);
  };
  return {
    startRingtone,
    stopRingtone
  };
}
export {
  usePhoneRingtone
};
//# sourceMappingURL=RingThePhone.mjs.map