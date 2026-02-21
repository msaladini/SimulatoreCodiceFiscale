import { IBAN_COUNTRIES } from './ibanData';

/**
 * Calculates the IBAN check digits according to ISO 7064 MOD 97-10.
 * @param {string} countryCode The 2-letter country code.
 * @param {string} bban The Basic Bank Account Number.
 * @returns {string} The 2-digit check sum.
 */
export function calculateCheckDigits(countryCode, bban) {
    // 1. Move the first four characters of the IBAN to the end (Country code + placeholder check digits '00')
    // 2. Convert letters to numbers (A=10, B=11, ..., Z=35)
    // 3. Apply MOD 97-10

    const tempIban = bban + countryCode + '00';
    const numericIban = tempIban.split('').map(char => {
        const code = char.toUpperCase().charCodeAt(0);
        if (code >= 48 && code <= 57) return char; // 0-9
        return (code - 55).toString(); // A-Z -> 10-35
    }).join('');

    // Use BigInt for precision with very large numbers
    const remainder = BigInt(numericIban) % 97n;
    const checkSum = 98n - remainder;

    return checkSum.toString().padStart(2, '0');
}

/**
 * Validates an IBAN.
 * @param {string} iban The IBAN to validate.
 * @returns {Object} { isValid: boolean, error: string | null }
 */
export function validateIban(iban) {
    const cleanIban = iban.replace(/\s+/g, '').toUpperCase();

    if (cleanIban.length < 4) {
        return { isValid: false, error: 'IBAN troppo corto' };
    }

    const countryCode = cleanIban.substring(0, 2);
    const country = IBAN_COUNTRIES.find(c => c.code === countryCode);

    if (!country) {
        return { isValid: false, error: 'Codice paese non supportato o invalido' };
    }

    if (cleanIban.length !== country.length) {
        return { isValid: false, error: `L'IBAN per ${country.name} deve essere di ${country.length} caratteri` };
    }

    // Check digits validation
    const rearrangedIban = cleanIban.substring(4) + cleanIban.substring(0, 4);
    const numericIban = rearrangedIban.split('').map(char => {
        const code = char.charCodeAt(0);
        if (code >= 48 && code <= 57) return char;
        return (code - 55).toString();
    }).join('');

    const isValidChecksum = BigInt(numericIban) % 97n === 1n;

    if (!isValidChecksum) {
        return { isValid: false, error: 'Cifre di controllo non valide (checksum fallito)' };
    }

    return { isValid: true, error: null };
}

/**
 * Parses a BBAN structure string (e.g., '1!a5!n12!c') into components.
 * @param {string} bbanStructure The structure string.
 * @returns {Array<{length: number, type: string}>} Array of components.
 */
export function parseBbanStructure(bbanStructure) {
    const components = [];
    const regex = /(\d+)!?([a-zA-Z])/g;
    let match;
    while ((match = regex.exec(bbanStructure)) !== null) {
        components.push({
            length: parseInt(match[1], 10),
            type: match[2].toLowerCase()
        });
    }
    return components;
}

/**
 * Generates a random valid IBAN for a given country code.
 * @param {string} countryCode The country code (e.g., 'IT').
 * @returns {string} A valid IBAN.
 */
export function generateIban(countryCode) {
    const country = IBAN_COUNTRIES.find(c => c.code === countryCode);
    if (!country) throw new Error('Paese non supportato');

    let bban = '';
    const components = parseBbanStructure(country.bbanStructure || '');

    components.forEach(comp => {
        for (let i = 0; i < comp.length; i++) {
            if (comp.type === 'n') {
                bban += Math.floor(Math.random() * 10).toString();
            } else if (comp.type === 'a') {
                bban += String.fromCharCode(65 + Math.floor(Math.random() * 26));
            } else {
                // c = alphanumeric
                const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                bban += chars.charAt(Math.floor(Math.random() * chars.length));
            }
        }
    });

    const checkDigits = calculateCheckDigits(countryCode, bban);
    return countryCode + checkDigits + bban;
}

/**
 * Formats an IBAN with spaces every 4 characters.
 * @param {string} iban The clean IBAN string.
 * @returns {string} The formatted IBAN.
 */
export function formatIban(iban) {
    return iban.replace(/\s+/g, '').replace(/(.{4})/g, '$1 ').trim();
}

/**
 * Splits an IBAN into 4-character chunks for visual rendering.
 * @param {string} iban The clean IBAN string.
 * @returns {string[]} Array of 4-character strings.
 */
export function chunkIban(iban) {
    const clean = iban.replace(/\s+/g, '');
    const chunks = [];
    for (let i = 0; i < clean.length; i += 4) {
        chunks.push(clean.substring(i, i + 4));
    }
    return chunks;
}

/**
 * Breaks down a BBAN string into its structural components based on the registry rules.
 * @param {string} bban The BBAN string.
 * @param {string} bbanStructure The structure definition (e.g., '1!a5!n12!c').
 * @returns {Array<{label: string, value: string}>} The parts to display.
 */
export function breakdownBban(bban, bbanStructure) {
    if (!bbanStructure) return [];

    const components = parseBbanStructure(bbanStructure);
    const result = [];
    let currentIndex = 0;

    components.forEach((comp, i) => {
        const part = bban.substring(currentIndex, currentIndex + comp.length);
        if (part) {
            result.push({
                label: `Parte ${i + 1} (${comp.length}!${comp.type})`,
                value: part
            });
            currentIndex += comp.length;
        }
    });

    return result;
}
