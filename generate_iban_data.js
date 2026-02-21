import * as fs from 'fs';

const data = JSON.parse(fs.readFileSync('iban-extracted.json', 'utf8'));

let content = `// This file is auto-generated from the official SWIFT IBAN Registry Release 101.\n\n`;
content += `export const IBAN_COUNTRIES = [\n`;

data.forEach((country, index) => {
    content += `    {
        code: '${country.code}',
        name: '${country.name.replace(/'/g, "\\'")}',
        sepa: ${country.sepa},
        length: ${country.length},
        structure: '${country.structure}',
        bbanStructure: '${country.bbanStructure}'
    }${index < data.length - 1 ? ',' : ''}\n`;
});

content += `];\n`;

fs.writeFileSync('src/pages/SimulazioneIban/ibanData.js', content);
console.log('Successfully written src/pages/SimulazioneIban/ibanData.js');
