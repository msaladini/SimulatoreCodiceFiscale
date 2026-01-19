import { calcolaCodiceFiscale } from './src/utils/codiceFiscaleCalculator.js';

const data = {
    cognome: 'De Luca',
    nome: 'Anna Maria',
    dataNascita: new Date('1975-10-20'),
    sesso: 'F',
    codicePaese: 'F205'
};
console.log('Result for Anna Maria De Luca:', calcolaCodiceFiscale(data));
