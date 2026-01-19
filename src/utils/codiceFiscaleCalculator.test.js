import { describe, it, expect, test } from 'vitest';
import { calcolaCodiceFiscale, validaCodiceFiscale } from './codiceFiscaleCalculator';

// Helper to adapt old test signature (nome, cognome, sesso, giorno, mese, anno, codicePaese)
// to current signature { cognome, nome, dataNascita, sesso, codicePaese }
const calcolaCodiceFiscaleAdapted = (nome, cognome, sesso, giorno, mese, anno, codicePaese) => {
    return calcolaCodiceFiscale({
        nome,
        cognome,
        sesso,
        dataNascita: new Date(`${anno}-${String(mese).padStart(2, '0')}-${String(giorno).padStart(2, '0')}`),
        codicePaese
    });
};

describe('calcolaCodiceFiscale', () => {
    describe('Basic functionality', () => {
        test('should calculate a valid tax code', () => {
            const result = calcolaCodiceFiscaleAdapted('Mario', 'Rossi', 'M', 15, 3, 1985, 'H501');
            expect(result).toHaveLength(16);
            expect(validaCodiceFiscale(result)).toBe(true);
        });

        test('should be deterministic - same input produces same output', () => {
            const result1 = calcolaCodiceFiscaleAdapted('Mario', 'Rossi', 'M', 15, 3, 1985, 'H501');
            const result2 = calcolaCodiceFiscaleAdapted('Mario', 'Rossi', 'M', 15, 3, 1985, 'H501');
            expect(result1).toBe(result2);
        });
    });

    describe('Gender handling', () => {
        test('should add 40 to day for female birth date', () => {
            const male = calcolaCodiceFiscaleAdapted('Mario', 'Rossi', 'M', 15, 3, 1985, 'H501');
            const female = calcolaCodiceFiscaleAdapted('Maria', 'Rossi', 'F', 15, 3, 1985, 'H501');

            const maleDay = male.substring(9, 11);
            const femaleDay = female.substring(9, 11);

            expect(maleDay).toBe('15');
            expect(femaleDay).toBe('55'); // 15 + 40 = 55
        });

        test('should handle case-insensitive gender input', () => {
            const upperF = calcolaCodiceFiscaleAdapted('Maria', 'Rossi', 'F', 15, 3, 1985, 'H501');
            const lowerF = calcolaCodiceFiscaleAdapted('Maria', 'Rossi', 'f', 15, 3, 1985, 'H501');
            expect(upperF).toBe(lowerF);
        });
    });

    describe('Surname consonants cases', () => {
        test('should handle surname with many consonants (only use first 3)', () => {
            const result = calcolaCodiceFiscaleAdapted('Mario', 'Strappari', 'M', 15, 3, 1985, 'H501');
            expect(result.substring(0, 3)).toBe('STR');
        });

        test('should handle surname with few consonants (add vowels and padding)', () => {
            const result = calcolaCodiceFiscaleAdapted('Mario', 'Ai', 'M', 15, 3, 1985, 'H501');
            expect(result.substring(0, 3)).toBe('AIX');
        });

        test('should handle surname with 2 consonants', () => {
            const result = calcolaCodiceFiscaleAdapted('Mario', 'Da', 'M', 15, 3, 1985, 'H501');
            expect(result.substring(0, 3)).toBe('DAX');
        });
    });

    describe('Name consonants cases', () => {
        test('should use 1st, 3rd, 4th consonant when name has 4+ consonants', () => {
            const result = calcolaCodiceFiscaleAdapted('Roberto', 'Rossi', 'M', 15, 3, 1985, 'H501');
            expect(result.substring(3, 6)).toBe('RRT');
        });

        test('should use consonants + vowels + padding when name has <4 consonants', () => {
            const result = calcolaCodiceFiscaleAdapted('Mario', 'Rossi', 'M', 15, 3, 1985, 'H501');
            expect(result.substring(3, 6)).toBe('MRA');
        });

        test('should handle name with 3 consonants', () => {
            const result = calcolaCodiceFiscaleAdapted('Bruno', 'Rossi', 'M', 15, 3, 1985, 'H501');
            expect(result.substring(3, 6)).toBe('BRN');
        });
    });

    describe('Date handling', () => {
        test('should correctly format month code for each month', () => {
            const months = ['A', 'B', 'C', 'D', 'E', 'H', 'L', 'M', 'P', 'R', 'S', 'T'];
            months.forEach((expectedCode, monthIndex) => {
                const result = calcolaCodiceFiscaleAdapted('Mario', 'Rossi', 'M', 15, monthIndex + 1, 1985, 'H501');
                expect(result.charAt(8)).toBe(expectedCode);
            });
        });

        test('should handle day padding', () => {
            const result = calcolaCodiceFiscaleAdapted('Mario', 'Rossi', 'M', 5, 3, 1985, 'H501');
            expect(result.substring(9, 11)).toBe('05');
        });
    });

    describe('Error handling', () => {
        test('should throw error when fields are missing', () => {
            expect(() => calcolaCodiceFiscale({
                cognome: '',
                nome: 'Mario',
                dataNascita: new Date('1980-01-01'),
                sesso: 'M',
                codicePaese: 'H501'
            })).toThrow('Tutti i campi sono obbligatori');
        });
    });
});

describe('validaCodiceFiscale', () => {
    test('should accept valid tax codes', () => {
        const validCodes = [
            'RSSMRA80A01H501U',
            'SMTJHN90E15Z114A',
            'DLCNMR75R60F205B'
        ];
        validCodes.forEach(code => {
            expect(validaCodiceFiscale(code)).toBe(true);
        });
    });

    test('should be case insensitive', () => {
        expect(validaCodiceFiscale('rssmra80a01h501u')).toBe(true);
    });
    test('should reject invalid codes', () => {
        expect(validaCodiceFiscale('RSSMRA80A01H501X')).toBe(false);
        expect(validaCodiceFiscale('INVALID')).toBe(false);
    });
});
