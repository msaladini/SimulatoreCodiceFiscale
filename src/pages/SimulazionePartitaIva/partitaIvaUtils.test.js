import { describe, it, expect } from 'vitest';
import { calculateLuhnCheckDigit, validatePartitaIva, generatePartitaIva } from './partitaIvaUtils';

describe('Partita Iva Utils', () => {

    describe('calculateLuhnCheckDigit', () => {
        it('calculates the correct control digit', () => {
            // Known valid examples: Microsoft Italy is 08106710158
            expect(calculateLuhnCheckDigit('0810671015')).toBe('8');
            // Google Italy is 13669721006
            expect(calculateLuhnCheckDigit('1366972100')).toBe('6');
        });

        it('throws if input is not 10 digits', () => {
            expect(() => calculateLuhnCheckDigit('123')).toThrow('Input must be 10 digits');
        });
    });

    describe('validatePartitaIva', () => {
        it('returns valid for correct Partita Iva', () => {
            expect(validatePartitaIva('08106710158')).toEqual({ isValid: true, error: null });
            expect(validatePartitaIva('13669721006')).toEqual({ isValid: true, error: null });
        });

        it('returns invalid for wrong length', () => {
            expect(validatePartitaIva('12345')).toEqual({ isValid: false, error: 'La Partita IVA deve essere lunga esattamente 11 cifre' });
        });

        it('returns invalid for non-numeric characters', () => {
            expect(validatePartitaIva('0467467096A')).toEqual({ isValid: false, error: 'La Partita IVA deve contenere solo numeri' });
        });

        it('returns invalid for incorrect check digit', () => {
            expect(validatePartitaIva('08106710159')).toEqual({ isValid: false, error: 'Cifra di controllo non valida (Luhn check fallito)' });
        });
        
        it('handles empty input', () => {
            expect(validatePartitaIva('')).toEqual({ isValid: null, error: null });
        });
    });

    describe('generatePartitaIva', () => {
        it('generates a valid 11-digit Partita Iva', () => {
            const pi = generatePartitaIva();
            expect(pi).toHaveLength(11);
            expect(validatePartitaIva(pi).isValid).toBe(true);
        });

        it('generates structurally correct P.IVA', () => {
            const pi1 = generatePartitaIva();
            const pi2 = generatePartitaIva();
            expect(pi1).not.toBe(pi2); // Chances of matching are 1 in 10,000,000
        });
    });
});
