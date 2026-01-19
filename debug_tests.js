import { calcolaCodiceFiscale, validaCodiceFiscale } from './src/utils/codiceFiscaleCalculator.js';

const calcolaCodiceFiscaleAdapted = (nome, cognome, sesso, giorno, mese, anno, codicePaese) => {
    return calcolaCodiceFiscale({
        nome,
        cognome,
        sesso,
        dataNascita: new Date(`${anno}-${String(mese).padStart(2, '0')}-${String(giorno).padStart(2, '0')}`),
        codicePaese
    });
};

const tests = [
    {
        name: 'Basic functionality: valid tax code', fn: () => {
            const result = calcolaCodiceFiscaleAdapted('Mario', 'Rossi', 'M', 15, 3, 1985, 'H501');
            if (result.length !== 16) throw new Error(`Length expected 16, got ${result.length}`);
            if (!validaCodiceFiscale(result)) throw new Error('Result failed validation');
        }
    },
    {
        name: 'Deterministic output', fn: () => {
            const r1 = calcolaCodiceFiscaleAdapted('Mario', 'Rossi', 'M', 15, 3, 1985, 'H501');
            const r2 = calcolaCodiceFiscaleAdapted('Mario', 'Rossi', 'M', 15, 3, 1985, 'H501');
            if (r1 !== r2) throw new Error(`Expected ${r1}, got ${r2}`);
        }
    },
    {
        name: 'Female gender (+40 day)', fn: () => {
            const male = calcolaCodiceFiscaleAdapted('Mario', 'Rossi', 'M', 15, 3, 1985, 'H501');
            const female = calcolaCodiceFiscaleAdapted('Maria', 'Rossi', 'F', 15, 3, 1985, 'H501');
            if (male.substring(9, 11) !== '15') throw new Error(`Male day expected 15, got ${male.substring(9, 11)}`);
            if (female.substring(9, 11) !== '55') throw new Error(`Female day expected 55, got ${female.substring(9, 11)}`);
        }
    },
    {
        name: 'Many consonants (surname)', fn: () => {
            const result = calcolaCodiceFiscaleAdapted('Mario', 'Strappari', 'M', 15, 3, 1985, 'H501');
            if (result.substring(0, 3) !== 'STR') throw new Error(`Expected STR, got ${result.substring(0, 3)}`);
        }
    },
    {
        name: 'Few consonants (surname)', fn: () => {
            const result = calcolaCodiceFiscaleAdapted('Mario', 'Ai', 'M', 15, 3, 1985, 'H501');
            if (result.substring(0, 3) !== 'AIX') throw new Error(`Expected AIX, got ${result.substring(0, 3)}`);
        }
    },
    {
        name: '2 consonants (surname)', fn: () => {
            const result = calcolaCodiceFiscaleAdapted('Mario', 'Da', 'M', 15, 3, 1985, 'H501');
            if (result.substring(0, 3) !== 'DAX') throw new Error(`Expected DAX, got ${result.substring(0, 3)}`);
        }
    },
    {
        name: '4+ consonants (name)', fn: () => {
            const result = calcolaCodiceFiscaleAdapted('Roberto', 'Rossi', 'M', 15, 3, 1985, 'H501');
            if (result.substring(3, 6) !== 'RRT') throw new Error(`Expected RRT, got ${result.substring(3, 6)}`);
        }
    },
    {
        name: '3 consonants (name)', fn: () => {
            const result = calcolaCodiceFiscaleAdapted('Bruno', 'Rossi', 'M', 15, 3, 1985, 'H501');
            if (result.substring(3, 6) !== 'BRN') throw new Error(`Expected BRN, got ${result.substring(3, 6)}`);
        }
    },
    {
        name: 'Valid codes validation', fn: () => {
            const validCodes = ['RSSMRA80A01H501U', 'SMTJHN90E15Z114A', 'DLCNMR75R60F205B'];
            validCodes.forEach(code => {
                if (!validaCodiceFiscale(code)) throw new Error(`Valid code ${code} rejected`);
            });
        }
    },
    {
        name: 'Case insensitivity in validation', fn: () => {
            if (!validaCodiceFiscale('rssmra80a01h501u')) throw new Error('Lowercase code rejected');
        }
    },
    {
        name: 'Invalid codes rejection', fn: () => {
            if (validaCodiceFiscale('RSSMRA80A01H501X')) throw new Error('Invalid code rejected (but might be valid check digit?)');
            if (validaCodiceFiscale('INVALID')) throw new Error('Short invalid code accepted');
        }
    }
];

tests.forEach(t => {
    try {
        t.fn();
        console.log(`PASS: ${t.name}`);
    } catch (err) {
        console.error(`FAIL: ${t.name} -> ${err.message}`);
    }
});
