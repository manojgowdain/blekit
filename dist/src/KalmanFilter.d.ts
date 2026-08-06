declare class KalmanFilter {
    R: number;
    Q: number;
    value: number | null;
    covariance: number;
    constructor({ R, Q, initialValue }?: {
        R?: number;
        Q?: number;
        initialValue?: number | null;
    });
    filter(measurement: number): number;
    reset(initialValue?: number | null): void;
}

export { KalmanFilter };
