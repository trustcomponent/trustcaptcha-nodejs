import {TrustCaptcha, ApiKeyInvalidException, VerificationNotFoundException, VerificationNotFinishedException, VerificationTokenInvalidException, VerificationResultExpiredException, VerificationResultRetrievalLimitReachedException, ServerUnreachableException} from '../src';

describe('TrustCaptcha Integration Tests', () => {

    const validToken = 'eyJ2ZXJpZmljYXRpb25JZCI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCJ9';
    const notFoundToken = 'eyJ2ZXJpZmljYXRpb25JZCI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMSJ9';
    const lockedToken = 'eyJ2ZXJpZmljYXRpb25JZCI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMiJ9';
    const expiredToken = 'eyJ2ZXJpZmljYXRpb25JZCI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMyJ9';
    const limitReachedToken = 'eyJ2ZXJpZmljYXRpb25JZCI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwNCJ9';
    const tokenWithUnknownFields = 'eyJ2ZXJpZmljYXRpb25JZCI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCIsInVua25vd25GaWVsZCI6ImZvbyIsImFub3RoZXJKdW5rIjo0MiwibmVzdGVkIjp7IngiOjF9fQ==';

    test('Successful verification', async () => {
        const result = await TrustCaptcha.getVerificationResult('ak_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', validToken);
        expect(result.verificationId).toBe('00000000-0000-0000-0000-000000000000');
    });

    test('Successful verification via constructor', async () => {
        const tc = new TrustCaptcha({apiKey: 'ak_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'});
        const result = await tc.getVerificationResult(validToken);
        expect(result.verificationId).toBe('00000000-0000-0000-0000-000000000000');
    });

    test('Throws VerificationTokenInvalidException for invalid token', async () => {
        await expect(TrustCaptcha.getVerificationResult('ak_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'invalid-base64')).rejects.toThrow(VerificationTokenInvalidException);
    });

    test('Throws VerificationTokenInvalidException when base64 but not JSON', async () => {
        // base64("not-a-json")
        await expect(TrustCaptcha.getVerificationResult('ak_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'bm90LWEtanNvbg==')).rejects.toThrow(VerificationTokenInvalidException);
    });

    test('Throws VerificationTokenInvalidException when JSON missing verificationId', async () => {
        // base64('{"foo":"bar"}')
        await expect(TrustCaptcha.getVerificationResult('ak_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'eyJmb28iOiJiYXIifQ==')).rejects.toThrow(VerificationTokenInvalidException);
    });

    test('Throws VerificationNotFoundException on 404', async () => {
        await expect(TrustCaptcha.getVerificationResult('ak_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', notFoundToken)).rejects.toThrow(VerificationNotFoundException);
    });

    test('Throws ApiKeyInvalidException on 403', async () => {
        await expect(TrustCaptcha.getVerificationResult('invalid-key', validToken)).rejects.toThrow(ApiKeyInvalidException);
    });

    test('Throws VerificationNotFinishedException on 423', async () => {
        await expect(TrustCaptcha.getVerificationResult('ak_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', lockedToken)).rejects.toThrow(VerificationNotFinishedException);
    });

    test('Throws VerificationResultExpiredException on 410', async () => {
        await expect(TrustCaptcha.getVerificationResult('ak_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', expiredToken)).rejects.toThrow(VerificationResultExpiredException);
    });

    test('Throws VerificationResultRetrievalLimitReachedException on 429', async () => {
        await expect(TrustCaptcha.getVerificationResult('ak_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', limitReachedToken)).rejects.toThrow(VerificationResultRetrievalLimitReachedException);
    });

    test('Tolerates unknown fields in verification token', async () => {
        const result = await TrustCaptcha.getVerificationResult('ak_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', tokenWithUnknownFields);
        expect(result.verificationId).toBe('00000000-0000-0000-0000-000000000000');
    });

    test('Throws ServerUnreachableException when the api host is unreachable', async () => {
        const tc = new TrustCaptcha({apiKey: 'ak_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', apiHost: 'http://localhost:1', connectTimeoutMs: 500, readTimeoutMs: 500});
        await expect(tc.getVerificationResult(validToken)).rejects.toThrow(ServerUnreachableException);
    });
});

