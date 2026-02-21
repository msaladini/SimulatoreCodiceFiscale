import * as fs from 'fs';

const text = fs.readFileSync('iban-registry-raw.txt', 'utf8');

const countries = [];

// Split by pages or just use regex to find each block.
// A block usually starts with "Name of country".
const countryBlocks = text.split(/Name of country\s+/).slice(1);

for (const block of countryBlocks) {
    const data = {};

    const extract = (regex) => {
        const match = block.match(regex);
        return match ? match[1].trim() : null;
    };

    // The block text starts right after "Name of country   ", so the first line is the country name.
    const firstLineEnd = block.indexOf('IBAN prefix');
    if (firstLineEnd !== -1) {
        data.name = block.substring(0, firstLineEnd).trim();
    } else {
        data.name = extract(/^([^\n]+)/);
    }

    data.code = extract(/IBAN prefix country code \(ISO 3166\)\s+([A-Z]{2})/);
    data.sepa = extract(/SEPA country\s+(Yes|No)/);
    data.ibanStructure = extract(/IBAN structure\s+([A-Z0-9!a-z]+)/);
    data.ibanLength = parseInt(extract(/IBAN length\s+(\d+)/), 10);

    // BBAN structure is tricky, might have spaces: e.g. "4!n20!c" or "4!n 20!c"
    // Let's grab until the next field, usually "BBAN length"
    const bbanStructMatch = block.match(/BBAN structure\s+(.*?)\s+BBAN length/);
    if (bbanStructMatch) {
        data.bbanStructure = bbanStructMatch[1].replace(/\s+/g, '').trim();
    }

    if (data.code && data.name && data.ibanStructure) {
        countries.push({
            code: data.code,
            name: data.name,
            sepa: data.sepa === 'Yes',
            structure: data.ibanStructure,
            length: data.ibanLength,
            bbanStructure: data.bbanStructure
        });
    }
}

// Move Italy to the top
const italyIndex = countries.findIndex(c => c.code === 'IT');
if (italyIndex > 0) {
    const italy = countries.splice(italyIndex, 1)[0];
    countries.unshift(italy);
}

fs.writeFileSync('iban-extracted.json', JSON.stringify(countries, null, 2));
console.log(`Extracted ${countries.length} countries.`);
