import { calcolaCodiceFiscale } from './src/utils/codiceFiscaleCalculator.js';

const cases = [
    { n: 'Mario Rossi', d: { cognome: 'Rossi', nome: 'Mario', sesso: 'M', dataNascita: new Date('1980-01-01'), codicePaese: 'H501' } },
    { n: 'John Smith', d: { cognome: 'Smith', nome: 'John', sesso: 'M', dataNascita: new Date('1990-05-15'), codicePaese: 'Z114' } },
    { n: 'Anna Maria De Luca', d: { cognome: 'De Luca', nome: 'Anna Maria', sesso: 'F', dataNascita: new Date('1975-10-20'), codicePaese: 'F205' } }
];

cases.forEach(c => {
    console.log(`${c.n}: ${calcolaCodiceFiscale(c.d)}`);
});
