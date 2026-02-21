const fs = require('fs');
const pdf = require('pdf-parse');

const pdfPath = 'C:\\Users\\salad\\Downloads\\iban-registry-v101.pdf';
const outputPath = 'iban-registry.json';

const parsePdf = async () => {
    try {
        const dataBuffer = fs.readFileSync(pdfPath);
        const data = await pdf(dataBuffer);

        const text = data.text;

        fs.writeFileSync('iban-registry-raw.txt', text);
        console.log('Text extracted and saved to iban-registry-raw.txt');

    } catch (error) {
        console.error('Error parsing PDF:', error);
    }
};

parsePdf();
