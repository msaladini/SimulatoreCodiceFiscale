/**
 * Estrae 3 caratteri da una stringa basato sulle regole del codice fiscale
 * @param {string} str - La stringa da elaborare
 * @returns {string} I tre caratteri estratti
 */
function extractThreeChars(str) {
  str = str.toUpperCase().replace(/[^A-Z]/g, '');
  const consonants = str.replace(/[AEIOU]/g, '');
  const vowels = str.replace(/[^AEIOU]/g, '');

  if (consonants.length >= 3) {
    return consonants.substring(0, 3);
  } else if (consonants.length === 2) {
    return consonants + vowels.substring(0, 1);
  } else if (consonants.length === 1) {
    return consonants + vowels.substring(0, 2);
  } else if (vowels.length >= 2) {
    return vowels.substring(0, 2) + 'X';
  } else if (vowels.length === 1) {
    return vowels + 'XX';
  } else {
    return 'XXX';
  }
}

/**
 * Estrae il codice per il cognome (primi 3 caratteri)
 * @param {string} cognome - Il cognome
 * @returns {string} Codice del cognome
 */
function getCognomeCode(cognome) {
  return extractThreeChars(cognome);
}

/**
 * Estrae il codice per il nome (3 caratteri con regola speciale)
 * @param {string} nome - Il nome
 * @returns {string} Codice del nome
 */
function getNomeCode(nome) {
  nome = nome.toUpperCase().replace(/[^A-Z]/g, '');
  const consonants = nome.replace(/[AEIOU]/g, '');
  const vowels = nome.replace(/[^AEIOU]/g, '');

  if (consonants.length >= 4) {
    // Se 4+ consonanti: 1°, 3°, 4°
    return consonants.substring(0, 1) + consonants.substring(2, 4);
  } else if (consonants.length === 3) {
    return consonants.substring(0, 3);
  } else if (consonants.length === 2) {
    return consonants + vowels.substring(0, 1);
  } else if (consonants.length === 1) {
    return consonants + vowels.substring(0, 2);
  } else if (vowels.length >= 2) {
    return vowels.substring(0, 2) + 'X';
  } else if (vowels.length === 1) {
    return vowels + 'XX';
  } else {
    return 'XXX';
  }
}

/**
 * Mappa mesi a caratteri
 */
const monthMap = {
  1: 'A',
  2: 'B',
  3: 'C',
  4: 'D',
  5: 'E',
  6: 'H',
  7: 'L',
  8: 'M',
  9: 'P',
  10: 'R',
  11: 'S',
  12: 'T'
};

/**
 * Calcola il codice data e sesso
 * @param {Date} dataNascita - Data di nascita
 * @param {string} sesso - 'M' per maschio, 'F' per femmina
 * @returns {string} Codice data e sesso (5 caratteri)
 */
function getDataSessoCode(dataNascita, sesso) {
  const year = dataNascita.getFullYear().toString().slice(-2);
  const month = monthMap[dataNascita.getMonth() + 1];
  let day = dataNascita.getDate();

  if (sesso.toUpperCase() === 'F') {
    day += 40;
  }

  const dayStr = day.toString().padStart(2, '0');
  return year + month + dayStr;
}

/**
 * Tabella di conversione per i caratteri in posizione pari
 */
const charToPairValue = {
  'A': 0, '0': 0, 'B': 1, '1': 1, 'C': 2, '2': 2, 'D': 3, '3': 3,
  'E': 4, '4': 4, 'F': 5, '5': 5, 'G': 6, '6': 6, 'H': 7, '7': 7,
  'I': 8, '8': 8, 'J': 9, '9': 9, 'K': 10, 'L': 11, 'M': 12, 'N': 13,
  'O': 14, 'P': 15, 'Q': 16, 'R': 17, 'S': 18, 'T': 19, 'U': 20,
  'V': 21, 'W': 22, 'X': 23, 'Y': 24, 'Z': 25
};

/**
 * Tabella di conversione per i caratteri in posizione dispari
 */
const charToOddValue = {
  'A': 1, '0': 1, 'B': 0, '1': 0, 'C': 5, '2': 5, 'D': 7, '3': 7,
  'E': 9, '4': 9, 'F': 13, '5': 13, 'G': 15, '6': 15, 'H': 17, '7': 17,
  'I': 19, '8': 19, 'J': 21, '9': 21, 'K': 2, 'L': 4, 'M': 18, 'N': 20,
  'O': 11, 'P': 3, 'Q': 6, 'R': 8, 'S': 12, 'T': 14, 'U': 16,
  'V': 10, 'W': 22, 'X': 25, 'Y': 24, 'Z': 23
};

/**
 * Tabella di conversione dal resto al carattere di controllo
 */
const remainderToChar = {
  0: 'A', 1: 'B', 2: 'C', 3: 'D', 4: 'E', 5: 'F', 6: 'G', 7: 'H',
  8: 'I', 9: 'J', 10: 'K', 11: 'L', 12: 'M', 13: 'N', 14: 'O', 15: 'P',
  16: 'Q', 17: 'R', 18: 'S', 19: 'T', 20: 'U', 21: 'V', 22: 'W', 23: 'X',
  24: 'Y', 25: 'Z'
};

/**
 * Calcola il carattere di controllo
 * @param {string} first15chars - I primi 15 caratteri del codice fiscale
 * @returns {string} Il carattere di controllo
 */
function getCheckChar(first15chars) {
  let sum = 0;

  for (let i = 0; i < 15; i++) {
    const char = first15chars[i];
    const position = i + 1; // 1-indexed

    if (position % 2 === 0) {
      // Posizione pari
      sum += charToPairValue[char];
    } else {
      // Posizione dispari
      sum += charToOddValue[char];
    }
  }

  const remainder = sum % 26;
  return remainderToChar[remainder];
}

/**
 * Calcola il codice fiscale
 * @param {Object} data - Oggetto con i dati della persona
 * @param {string} data.cognome - Cognome
 * @param {string} data.nome - Nome
 * @param {Date} data.dataNascita - Data di nascita
 * @param {string} data.sesso - Sesso ('M' o 'F')
 * @param {string} data.codicePaese - Codice paese/comune (es. 'H501' per Roma)
 * @returns {string} Il codice fiscale
 */
export function calcolaCodiceFiscale(data) {
  const { cognome, nome, dataNascita, sesso, codicePaese } = data;

  // Validazione
  if (!cognome || !nome || !dataNascita || !sesso || !codicePaese) {
    throw new Error('Tutti i campi sono obbligatori');
  }

  if (!/^[MF]$/i.test(sesso)) {
    throw new Error('Il sesso deve essere M o F');
  }

  if (!/^[A-Z]\d{3}$/i.test(codicePaese)) {
    throw new Error('Il codice paese deve essere nel formato: 1 lettera + 3 numeri');
  }

  // Calcolo dei singoli componenti
  const cognomeCode = getCognomeCode(cognome);
  const nomeCode = getNomeCode(nome);
  const dataSessoCode = getDataSessoCode(dataNascita, sesso);
  const paeseCodiceUpperCase = codicePaese.toUpperCase();

  // Primi 15 caratteri
  const first15 = cognomeCode + nomeCode + dataSessoCode + paeseCodiceUpperCase;

  // Carattere di controllo
  const checkChar = getCheckChar(first15);

  // Codice fiscale completo
  return first15 + checkChar;
}

/**
 * Valida un codice fiscale
 * @param {string} codiceFiscale - Il codice fiscale da validare
 * @returns {boolean} True se valido, false altrimenti
 */
export function validaCodiceFiscale(codiceFiscale) {
  if (!codiceFiscale || codiceFiscale.length !== 16) {
    return false;
  }

  const first15 = codiceFiscale.substring(0, 15);
  const checkChar = codiceFiscale.substring(15, 16);
  const calculatedCheck = getCheckChar(first15);

  return checkChar === calculatedCheck;
}
