import { validate as uuidValidate } from 'uuid';

export class VerificationResult {
    captchaId: string;
    verificationId: string;
    verificationPassed: boolean;
    score: number;
    decisionType: string;
    decisionAction: string;
    gatewayFailoverActive: boolean;
    riskScoringEnabled: boolean;
    minimalDataModeEnabled: boolean;
    origin: string;
    ipAddress: string;
    countryCode: string;
    deviceFamily: string;
    operatingSystem: string;
    browser: string;
    verificationStartedAt: string;
    verificationFinishedAt: string;
    resultExpiresAt: string;
    resultFirstFetchedAt: string;
    resultLastFetchedAt: string;

    constructor(data: {
        captchaId: string;
        verificationId: string;
        verificationPassed: boolean;
        score: number;
        decisionType: string;
        decisionAction: string;
        gatewayFailoverActive: boolean;
        riskScoringEnabled: boolean;
        minimalDataModeEnabled: boolean;
        origin: string;
        ipAddress: string;
        countryCode: string;
        deviceFamily: string;
        operatingSystem: string;
        browser: string;
        verificationStartedAt: string;
        verificationFinishedAt: string;
        resultExpiresAt: string;
        resultFirstFetchedAt: string;
        resultLastFetchedAt: string;
    }) {
        if (!uuidValidate(data.captchaId) || !uuidValidate(data.verificationId)) {
            throw new Error('Invalid UUID');
        }
        this.captchaId = data.captchaId;
        this.verificationId = data.verificationId;
        this.verificationPassed = data.verificationPassed;
        this.score = data.score;
        this.decisionType = data.decisionType;
        this.decisionAction = data.decisionAction;
        this.gatewayFailoverActive = data.gatewayFailoverActive;
        this.riskScoringEnabled = data.riskScoringEnabled;
        this.minimalDataModeEnabled = data.minimalDataModeEnabled;
        this.origin = data.origin;
        this.ipAddress = data.ipAddress;
        this.countryCode = data.countryCode;
        this.deviceFamily = data.deviceFamily;
        this.operatingSystem = data.operatingSystem;
        this.browser = data.browser;
        this.verificationStartedAt = data.verificationStartedAt;
        this.verificationFinishedAt = data.verificationFinishedAt;
        this.resultExpiresAt = data.resultExpiresAt;
        this.resultFirstFetchedAt = data.resultFirstFetchedAt;
        this.resultLastFetchedAt = data.resultLastFetchedAt;
    }

    static fromObject(data: any): VerificationResult {
        return new VerificationResult(data);
    }
}
