import * as fs from 'fs';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

const pdfPath = 'C:\\Users\\salad\\Downloads\\iban-registry-v101.pdf';

const parsePdf = async () => {
    try {
        const data = new Uint8Array(fs.readFileSync(pdfPath));
        const loadingTask = pdfjsLib.getDocument({ data });
        const pdf = await loadingTask.promise;

        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += `--- Page ${i} ---\n` + pageText + '\n\n';
        }

        fs.writeFileSync('iban-registry-raw.txt', fullText);
        console.log('Successfully extracted text from ', pdf.numPages, ' pages.');

    } catch (error) {
        console.error('Error parsing PDF:', error);
    }
};

parsePdf();
