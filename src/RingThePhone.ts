import { useAudioPlayer } from "expo-audio";

export function usePhoneRingtone(audioSource: any) {
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
    stopRingtone,
  };
}