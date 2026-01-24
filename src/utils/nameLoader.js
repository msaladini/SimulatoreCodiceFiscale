import flowers from '../data/names/flowers.json';
import wines from '../data/names/wines.json';
import standard from '../data/names/standard.json';

const categories = {
    flowers,
    wines,
    standard
};

// Seleziona una categoria casuale all'avvio
const categoryKeys = Object.keys(categories);
const selectedCategoryKey = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
const currentList = categories[selectedCategoryKey];

console.log(`[NameLoader] Loaded category: ${selectedCategoryKey}`);

/**
 * Ritorna un nome casuale e il suo sesso
 * Se sesso non specificato, sceglie casualmente tra M e F
 * @param {string} [sesso] - 'M' o 'F' (opzionale)
 * @returns {Object} { name: string, gender: string }
 */
export function getRandomNameAndGender(sesso) {
    const gender = sesso || (Math.random() > 0.5 ? 'M' : 'F');
    const names = currentList[gender];

    if (!names || names.length === 0) {
        // Fallback or handle unexpected case
        return { name: "Non disponibile", gender };
    }

    const name = names[Math.floor(Math.random() * names.length)];
    return { name, gender };
}

/**
 * Ritorna la categoria correntemente caricata
 * @returns {string} Nome categoria
 */
export function getCurrentCategory() {
    return selectedCategoryKey;
}
