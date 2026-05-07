import { validate as uuidValidate } from 'uuid';
import { VerificationTokenInvalidException } from "../trustCaptcha";

export class VerificationToken {
    verificationId: string;
    clientFailover: boolean;

    constructor(verificationId: string, clientFailover: boolean = false) {
        if (!uuidValidate(verificationId) && !verificationId.startsWith('00000000-0000-0000-0000-00000000000')) {
            throw new VerificationTokenInvalidException('Invalid UUID in verification token');
        }
        this.verificationId = verificationId;
        this.clientFailover = clientFailover;
    }

    static fromBase64(base64String: string): VerificationToken {
        try {
            const jsonString = Buffer.from(base64String, 'base64').toString('utf-8');
            const jsonObject = JSON.parse(jsonString);
            if (!jsonObject.verificationId) {
                throw new VerificationTokenInvalidException('Missing required fields in verification token');
            }
            return new VerificationToken(jsonObject.verificationId, jsonObject.clientFailover === true);
        } catch (e) {
            if (e instanceof VerificationTokenInvalidException) throw e;
            if (e instanceof SyntaxError) {
                throw new VerificationTokenInvalidException('Invalid Base64-encoded JSON');
            } else if (e instanceof Error) {
                throw new VerificationTokenInvalidException(e.message);
            } else {
                throw new VerificationTokenInvalidException('Unknown error');
            }
        }
    }
}
