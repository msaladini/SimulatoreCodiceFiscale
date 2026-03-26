/**
 * Calculates the Luhn check digit for an 11-digit Partita IVA.
 * The input is the first 10 digits as a string.
 * @param {string} base10Digits The first 10 digits of the Partita IVA.
 * @returns {string} The calculated control digit (0-9).
 */
export function calculateLuhnCheckDigit(base10Digits) {
    if (base10Digits.length !== 10) throw new Error('Input must be 10 digits');

    let evalSum = 0;

    for (let i = 0; i < 10; i++) {
        let val = parseInt(base10Digits.charAt(i), 10);
        // Odd positions in real world are 1-based, array is 0-based.
        // Positions 1, 3, 5, 7, 9 -> array indices 0, 2, 4, 6, 8 (X)
        // Positions 2, 4, 6, 8, 10 -> array indices 1, 3, 5, 7, 9 (Y)
        if (i % 2 !== 0) { // array index is odd -> position is even (2, 4, ...) -> multiply by 2
            val *= 2;
            if (val > 9) val -= 9; // Equivalent to adding the digits of the duplicated value
        }
        evalSum += val;
    }

    const remainder = evalSum % 10;
    const checkDigit = remainder === 0 ? 0 : 10 - remainder;

    return checkDigit.toString();
}

/**
 * Validates a Partita IVA.
 * @param {string} partitaIva The Partita IVA string.
 * @returns {Object} { isValid: boolean, error: string | null }
 */
export function validatePartitaIva(partitaIva) {
    const cleanPi = partitaIva.replace(/\s+/g, '');

    if (!cleanPi) {
        return { isValid: null, error: null };
    }

    if (!/^\d+$/.test(cleanPi)) {
        return { isValid: false, error: 'La Partita IVA deve contenere solo numeri' };
    }

    if (cleanPi.length !== 11) {
        return { isValid: false, error: 'La Partita IVA deve essere lunga esattamente 11 cifre' };
    }

    const base10 = cleanPi.substring(0, 10);
    const providedCheckDigit = cleanPi.charAt(10);
    const calculatedCheckDigit = calculateLuhnCheckDigit(base10);

    if (providedCheckDigit !== calculatedCheckDigit) {
        return { isValid: false, error: 'Cifra di controllo non valida (Luhn check fallito)' };
    }

    return { isValid: true, error: null };
}

/**
 * Generates a random valid Partita IVA.
 * @returns {string} A 11-digit valid Partita IVA.
 */
export function generatePartitaIva() {
    // 1. Generate 7 random digits for Matricola
    let matricola = '';
    for (let i = 0; i < 7; i++) {
        matricola += Math.floor(Math.random() * 10).toString();
    }

    // 2. Choose a valid office code (Ufficio): e.g. from 001 to 100 randomly
    // Let's use generic office codes: 001 to 100.
    const officeNumber = Math.floor(Math.random() * 100) + 1;
    const ufficio = officeNumber.toString().padStart(3, '0');

    const base10 = matricola + ufficio;

    // 3. Calculate Check Digit
    const checkDigit = calculateLuhnCheckDigit(base10);

    return base10 + checkDigit;
}
