// ==========================
// KalmanFilter
// Minimal 1D Kalman filter used to smooth noisy scalar sensor
// readings (heart rate, SpO2, temperature) coming off the BLE
// wearable, where a single garbage/dropped-bit sample can otherwise
// spike straight through to the UI.
//
// R = measurement noise (how noisy the sensor itself is — higher
//     means "trust new readings less").
// Q = process noise (how much the true value is expected to drift
//     between samples — higher means "adapt to changes faster").
// ==========================
export class KalmanFilter {
  R: number;
  Q: number;
  value: number | null;
  covariance: number;

  constructor({ R = 2, Q = 0.01, initialValue = null }: { R?: number; Q?: number; initialValue?: number | null } = {}) {
    this.R = R; // measurement noise
    this.Q = Q; // process noise
    this.value = initialValue; // current estimate
    this.covariance = 1; // estimate uncertainty
  }

  // Feed in a raw measurement, get back the filtered estimate.
  filter(measurement: number): number {
    if (this.value === null) {
      // First sample — nothing to fuse with yet, seed the estimate.
      this.value = measurement;
      return this.value;
    }

    // Prediction step (no explicit motion model — assume the value
    // stays put between samples, plus process noise).
    const predictedCovariance = this.covariance + this.Q;

    // Update step.
    const kalmanGain = predictedCovariance / (predictedCovariance + this.R);
    this.value = this.value + kalmanGain * (measurement - this.value);
    this.covariance = (1 - kalmanGain) * predictedCovariance;

    return this.value;
  }

  reset(initialValue: number | null = null): void {
    this.value = initialValue;
    this.covariance = 1;
  }
}