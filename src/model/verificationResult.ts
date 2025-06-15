import { validate as uuidValidate } from 'uuid';

export class VerificationResult {
    captchaId: string;
    verificationId: string;
    score: number;
    reason: string;
    mode: string
    origin: string;
    ipAddress: string;
    deviceFamily: string;
    operatingSystem: string;
    browser: string;
    creationTimestamp: string;
    releaseTimestamp: string;
    retrievalTimestamp: string;
    verificationPassed: boolean;

    constructor(
        captchaId: string,
        verificationId: string,
        score: number,
        reason: string,
        mode: string,
        origin: string,
        ipAddress: string,
        deviceFamily: string,
        operatingSystem: string,
        browser: string,
        creationTimestamp: string,
        releaseTimestamp: string,
        retrievalTimestamp: string,
        verificationPassed: boolean
    ) {
        if (!uuidValidate(captchaId) || !uuidValidate(verificationId)) {
            throw new Error('Invalid UUID');
        }
        this.captchaId = captchaId;
        this.verificationId = verificationId;
        this.score = score;
        this.reason = reason;
        this.mode = mode;
        this.origin = origin;
        this.ipAddress = ipAddress;
        this.deviceFamily = deviceFamily;
        this.operatingSystem = operatingSystem;
        this.browser = browser;
        this.creationTimestamp = creationTimestamp;
        this.releaseTimestamp = releaseTimestamp;
        this.retrievalTimestamp = retrievalTimestamp;
        this.verificationPassed = verificationPassed;
    }

    static fromObject(data: any): VerificationResult {
        return new VerificationResult(
            data.captchaId,
            data.verificationId,
            data.score,
            data.reason,
            data.mode,
            data.origin,
            data.ipAddress,
            data.deviceFamily,
            data.operatingSystem,
            data.browser,
            data.creationTimestamp,
            data.releaseTimestamp,
            data.retrievalTimestamp,
            data.verificationPassed
        );
    }
}
