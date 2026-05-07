import axios, { AxiosProxyConfig } from 'axios';
import { VerificationToken } from './model/verificationToken';
import { VerificationResult } from './model/verificationResult';

const LIBRARY_VERSION = '3.0.0';
const LIBRARY_LANGUAGE = 'nodejs';
const DEFAULT_API_HOST = 'https://api.trustcomponent.com';
const DEFAULT_CONNECT_TIMEOUT_MS = 3000;
const DEFAULT_READ_TIMEOUT_MS = 5000;

export interface TrustCaptchaOptions {
    apiKey: string;
    apiHost?: string;
    connectTimeoutMs?: number;
    readTimeoutMs?: number;
    proxy?: AxiosProxyConfig | false;
}

export class TrustCaptcha {

    private readonly apiKey: string;
    private readonly apiHost: string;
    private readonly connectTimeoutMs: number;
    private readonly readTimeoutMs: number;
    private readonly proxy: AxiosProxyConfig | false | undefined;

    constructor(options: TrustCaptchaOptions) {
        if (!options || !options.apiKey) {
            throw new Error('apiKey must not be null or empty');
        }
        this.apiKey = options.apiKey;
        this.apiHost = options.apiHost ?? DEFAULT_API_HOST;
        this.connectTimeoutMs = options.connectTimeoutMs ?? DEFAULT_CONNECT_TIMEOUT_MS;
        this.readTimeoutMs = options.readTimeoutMs ?? DEFAULT_READ_TIMEOUT_MS;
        this.proxy = options.proxy;
    }

    static getVerificationResult(apiKey: string, base64verificationToken: string): Promise<VerificationResult> {
        return new TrustCaptcha({ apiKey }).getVerificationResult(base64verificationToken);
    }

    async getVerificationResult(base64verificationToken: string): Promise<VerificationResult> {

        const verificationToken = VerificationToken.fromBase64(base64verificationToken);
        const params = verificationToken.clientFailover ? "?clientFailover=true" : "";
        const url = `${this.apiHost}/v2/verifications/${verificationToken.verificationId}/results${params}`;
        const headers: Record<string, string> = {
            "Authorization": `Bearer ${this.apiKey}`,
            "User-Agent": buildUserAgent(),
        };

        try {
            const response = await axios.get(url, {
                headers,
                timeout: this.readTimeoutMs,
                maxRedirects: 0,
                proxy: this.proxy,
            });
            return VerificationResult.fromObject(response.data);
        } catch (error: any) {
            if (error.response && error.response.status === 403) {
                throw new ApiKeyInvalidException();
            }
            if (error.response && error.response.status === 404) {
                throw new VerificationNotFoundException();
            }
            if (error.response && error.response.status === 423) {
                throw new VerificationNotFinishedException();
            }
            if (error.response && error.response.status === 410) {
                throw new VerificationResultExpiredException();
            }
            if (error.response && error.response.status === 412) {
                throw new ClientReportedServerUnreachableException();
            }
            if (error.response && error.response.status === 429) {
                throw new VerificationResultRetrievalLimitReachedException();
            }
            if (error.response) {
                throw new Error('Failed to retrieve verification result, response code: ' + error.response.status);
            }
            // No HTTP response at all → genuine network/connection failure on our side.
            throw new ServerUnreachableException();
        }
    }
}

function buildUserAgent(): string {
    const payload: Record<string, string> = {
        language: LIBRARY_LANGUAGE,
        version: LIBRARY_VERSION,
    };
    const encoded = Buffer.from(JSON.stringify(payload), 'utf-8').toString('base64');
    return `Trustcaptcha/${encoded}`;
}

export class ApiKeyInvalidException extends Error {
    constructor(message: string = 'The provided api key is invalid. Please verify the api key from your captcha settings.') {
        super(message);
        this.name = 'ApiKeyInvalidException';
        Object.setPrototypeOf(this, ApiKeyInvalidException.prototype);
    }
}

export class VerificationTokenInvalidException extends Error {
    constructor(message: string = 'The verification token is malformed or could not be parsed.') {
        super(message);
        this.name = 'VerificationTokenInvalidException';
        Object.setPrototypeOf(this, VerificationTokenInvalidException.prototype);
    }
}

export class VerificationNotFoundException extends Error {
    constructor(message: string = 'No verification could be found for the given verification token.') {
        super(message);
        this.name = 'VerificationNotFoundException';
        Object.setPrototypeOf(this, VerificationNotFoundException.prototype);
    }
}

export class VerificationNotFinishedException extends Error {
    constructor(message: string = 'The verification is not yet completed. Please wait until the user has finished solving the captcha before requesting the result.') {
        super(message);
        this.name = 'VerificationNotFinishedException';
        Object.setPrototypeOf(this, VerificationNotFinishedException.prototype);
    }
}

export class VerificationResultExpiredException extends Error {
    constructor(message: string = 'The verification result has expired and can no longer be retrieved.') {
        super(message);
        this.name = 'VerificationResultExpiredException';
        Object.setPrototypeOf(this, VerificationResultExpiredException.prototype);
    }
}

export class VerificationResultRetrievalLimitReachedException extends Error {
    constructor(message: string = 'The verification result has reached its maximum retrieval count and can no longer be retrieved.') {
        super(message);
        this.name = 'VerificationResultRetrievalLimitReachedException';
        Object.setPrototypeOf(this, VerificationResultRetrievalLimitReachedException.prototype);
    }
}

export abstract class FailoverException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'FailoverException';
        Object.setPrototypeOf(this, FailoverException.prototype);
    }
}

export class ServerUnreachableException extends FailoverException {
    constructor(message: string = 'Could not reach the TrustCaptcha server. This is a high-trust failover signal — your backend was unable to contact our servers.') {
        super(message);
        this.name = 'ServerUnreachableException';
        Object.setPrototypeOf(this, ServerUnreachableException.prototype);
    }
}

export class ClientReportedServerUnreachableException extends FailoverException {
    constructor(message: string = 'The client reported it could not reach the TrustCaptcha server, but the gateway has no record of a recent outage. Treat this with caution: a malicious client may be claiming a failover that did not happen.') {
        super(message);
        this.name = 'ClientReportedServerUnreachableException';
        Object.setPrototypeOf(this, ClientReportedServerUnreachableException.prototype);
    }
}
