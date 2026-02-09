import axios from 'axios';
import { VerificationToken } from './model/verificationToken';
import { VerificationResult } from './model/verificationResult';

export class CaptchaManager {

    static async getVerificationResult(secretKey: string, base64verificationToken: string): Promise<VerificationResult> {

        const verificationToken = VerificationToken.fromBase64(base64verificationToken);
        const url = `https://api.trustcomponent.com/verifications/${verificationToken.verificationId}/assessments`;
        const headers = {
            "tc-authorization": secretKey,
            "tc-library-language": "nodejs",
            "tc-library-version": "2.0"
        };

        try {
            const response = await axios.get(url, {
                headers,
                timeout: 5000,
                maxRedirects: 0,
            });
            return VerificationResult.fromObject(response.data);
        } catch (error: any) {
            if (error.response && error.response.status === 403) {
                throw new SecretKeyInvalidException('Secret key invalid, response code: 403');
            }
            if (error.response && error.response.status === 404) {
                throw new VerificationNotFoundException('Verification not found, response code: 404');
            }
            if (error.response && error.response.status === 423) {
                throw new VerificationNotFinishedException('Verification not finished, response code: 423');
            }
            if (error.response) {
                throw new Error('Failed to retrieve verification result, response code: ' + error.response.status);
            }
            throw new Error('Failed to retrieve verification result');
        }
    }
}

export class SecretKeyInvalidException extends Error {
    constructor(message: string = 'Secret Key is invalid') {
        super(message);
        this.name = 'SecretKeyInvalidException';
        Object.setPrototypeOf(this, SecretKeyInvalidException.prototype);
    }
}

export class VerificationTokenInvalidException extends Error {
    constructor(message: string = 'Verification Token is invalid') {
        super(message);
        this.name = 'VerificationTokenInvalidException';
        Object.setPrototypeOf(this, VerificationTokenInvalidException.prototype);
    }
}

export class VerificationNotFoundException extends Error {
    constructor(message: string = 'Verification not found') {
        super(message);
        this.name = 'VerificationNotFoundException';
        Object.setPrototypeOf(this, VerificationNotFoundException.prototype);
    }
}

export class VerificationNotFinishedException extends Error {
    constructor(message: string = 'Verification not finished') {
        super(message);
        this.name = 'VerificationNotFinishedException';
        Object.setPrototypeOf(this, VerificationNotFinishedException.prototype);
    }
}
