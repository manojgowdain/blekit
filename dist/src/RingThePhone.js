var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/RingThePhone.ts
var RingThePhone_exports = {};
__export(RingThePhone_exports, {
  usePhoneRingtone: () => usePhoneRingtone
});
module.exports = __toCommonJS(RingThePhone_exports);
var import_expo_audio = require("expo-audio");
function usePhoneRingtone(audioSource) {
  const player = (0, import_expo_audio.useAudioPlayer)(audioSource);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  usePhoneRingtone
});
//# sourceMappingURL=RingThePhone.js.map