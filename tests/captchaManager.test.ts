import {CaptchaManager, SecretKeyInvalidException, VerificationNotFoundException, VerificationNotFinishedException, VerificationTokenInvalidException} from '../src';

describe('CaptchaManager Integration Tests', () => {

    const validToken = 'eyJhcGlFbmRwb2ludCI6Imh0dHBzOi8vYXBpLnRydXN0Y29tcG9uZW50LmNvbSIsInZlcmlmaWNhdGlvbklkIjoiMDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDAwIiwiZW5jcnlwdGVkQWNjZXNzVG9rZW4iOiJ0b2tlbiJ9';
    const notFoundToken = 'eyJhcGlFbmRwb2ludCI6Imh0dHBzOi8vYXBpLnRydXN0Y29tcG9uZW50LmNvbSIsInZlcmlmaWNhdGlvbklkIjoiMDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDAxIiwiZW5jcnlwdGVkQWNjZXNzVG9rZW4iOiJ0b2tlbiJ9';
    const lockedToken = 'eyJhcGlFbmRwb2ludCI6Imh0dHBzOi8vYXBpLnRydXN0Y29tcG9uZW50LmNvbSIsInZlcmlmaWNhdGlvbklkIjoiMDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDAyIiwiZW5jcnlwdGVkQWNjZXNzVG9rZW4iOiJ0b2tlbiJ9';

    test('Successful verification', async () => {
        const result = await CaptchaManager.getVerificationResult('secret-key', validToken);
        expect(result.verificationId).toBe('00000000-0000-0000-0000-000000000000');
    });

    test('Throws VerificationTokenInvalidException for invalid token', async () => {
        await expect(CaptchaManager.getVerificationResult('', '')).rejects.toThrow(VerificationTokenInvalidException);
    });

    test('Throws VerificationNotFoundException on 404', async () => {
        await expect(CaptchaManager.getVerificationResult('secret-key', notFoundToken)).rejects.toThrow(VerificationNotFoundException);
    });

    test('Throws SecretKeyInvalidException on 403', async () => {
        await expect(CaptchaManager.getVerificationResult('invalid-key', validToken)).rejects.toThrow(SecretKeyInvalidException);
    });

    test('Throws VerificationNotFinishedException on 423', async () => {
        await expect(CaptchaManager.getVerificationResult('secret-key', lockedToken)).rejects.toThrow(VerificationNotFinishedException);
    });
});

