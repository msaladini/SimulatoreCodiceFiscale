import { describe, it, expect } from 'vitest';
import { calculateCheckDigits, validateIban, generateIban } from './ibanUtils';

describe('ibanUtils', () => {
    describe('calculateCheckDigits', () => {
        it('should correctly calculate check digits for Italy (IT)', () => {
            // Example from IBAN Registry v101: X0542811101000000123456 -> IT60
            const bban = 'X0542811101000000123456';
            const checkDigits = calculateCheckDigits('IT', bban);
            expect(checkDigits).toBe('60');
        });

        it('should correctly calculate check digits for Germany (DE)', () => {
            // Example from registry: 370400440532013000 -> DE89
            const bban = '370400440532013000';
            const checkDigits = calculateCheckDigits('DE', bban);
            expect(checkDigits).toBe('89');
        });
    });

    describe('validateIban', () => {
        it('should validate a correct Italian IBAN', () => {
            const validIban = 'IT60X0542811101000000123456';
            expect(validateIban(validIban).isValid).toBe(true);
        });

        it('should invalid an IBAN with wrong check digits', () => {
            const invalidIban = 'IT61X0542811101000000123456';
            expect(validateIban(invalidIban).isValid).toBe(false);
            expect(validateIban(invalidIban).error).toContain('checksum fallito');
        });

        it('should invalid an IBAN with wrong length', () => {
            const shortIban = 'IT60X0542811101000000123'; // Too short
            expect(validateIban(shortIban).isValid).toBe(false);
            expect(validateIban(shortIban).error).toContain('27 caratteri');
        });
    });

    describe('generateIban', () => {
        it('should generate a valid IBAN for supported countries', () => {
            const countries = ['IT', 'DE', 'FR', 'ES', 'GB', 'CH', 'BE', 'NL'];
            countries.forEach(code => {
                const iban = generateIban(code);
                const validation = validateIban(iban);
                expect(validation.isValid).toBe(true);
                expect(iban.substring(0, 2)).toBe(code);
            });
        });
    });
});
