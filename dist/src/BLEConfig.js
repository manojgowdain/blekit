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

// src/BLEConfig.ts
var BLEConfig_exports = {};
__export(BLEConfig_exports, {
  CHARACTERISTICS: () => CHARACTERISTICS,
  SERVICE_UUID: () => SERVICE_UUID
});
module.exports = __toCommonJS(BLEConfig_exports);
var SERVICE_UUID = "19b10000-e8f2-537e-4f6c-d104768a1214";
var CHARACTERISTICS = {
  data: "19b10001-e8f2-537e-4f6c-d104768a1214",
  reset: "19b10002-e8f2-537e-4f6c-d104768a1214",
  "time": "19b10003-e8f2-537e-4f6c-d104768a1214"
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CHARACTERISTICS,
  SERVICE_UUID
});
//# sourceMappingURL=BLEConfig.js.map