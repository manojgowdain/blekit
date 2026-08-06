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

// src/KalmanFilter.ts
var KalmanFilter_exports = {};
__export(KalmanFilter_exports, {
  KalmanFilter: () => KalmanFilter
});
module.exports = __toCommonJS(KalmanFilter_exports);
var KalmanFilter = class {
  R;
  Q;
  value;
  covariance;
  constructor({ R = 2, Q = 0.01, initialValue = null } = {}) {
    this.R = R;
    this.Q = Q;
    this.value = initialValue;
    this.covariance = 1;
  }
  // Feed in a raw measurement, get back the filtered estimate.
  filter(measurement) {
    if (this.value === null) {
      this.value = measurement;
      return this.value;
    }
    const predictedCovariance = this.covariance + this.Q;
    const kalmanGain = predictedCovariance / (predictedCovariance + this.R);
    this.value = this.value + kalmanGain * (measurement - this.value);
    this.covariance = (1 - kalmanGain) * predictedCovariance;
    return this.value;
  }
  reset(initialValue = null) {
    this.value = initialValue;
    this.covariance = 1;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  KalmanFilter
});
//# sourceMappingURL=KalmanFilter.js.map