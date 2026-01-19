import { calcolaCodiceFiscale } from './src/utils/codiceFiscaleCalculator.js';

const data = {
    cognome: 'Smith',
    nome: 'John',
    dataNascita: new Date('1990-05-15'),
    sesso: 'M',
    codicePaese: 'Z114'
};
console.log('Result for Smith John:', calcolaCodiceFiscale(data));
