export const IBAN_COUNTRIES = [
    {
        code: 'IT',
        name: 'Italia',
        length: 27,
        structure: 'IT2!n1!a5!n5!n12!c',
        bban: {
            length: 23,
            structure: '1!a5!n5!n12!c',
            components: [
                { name: 'CIN', length: 1, type: 'a' },
                { name: 'ABI', length: 5, type: 'n' },
                { name: 'CAB', length: 5, type: 'n' },
                { name: 'Conto', length: 12, type: 'c' }
            ]
        }
    },
    {
        code: 'DE',
        name: 'Germania',
        length: 22,
        structure: 'DE2!n8!n10!n',
        bban: {
            length: 18,
            structure: '8!n10!n',
            components: [
                { name: 'Bankleitzahl', length: 8, type: 'n' },
                { name: 'Kontonummer', length: 10, type: 'n' }
            ]
        }
    },
    {
        code: 'FR',
        name: 'Francia',
        length: 27,
        structure: 'FR2!n5!n5!n11!c2!n',
        bban: {
            length: 23,
            structure: '5!n5!n11!c2!n',
            components: [
                { name: 'Code Banque', length: 5, type: 'n' },
                { name: 'Code Guichet', length: 5, type: 'n' },
                { name: 'N° de Compte', length: 11, type: 'c' },
                { name: 'Clé RIB', length: 2, type: 'n' }
            ]
        }
    },
    {
        code: 'ES',
        name: 'Spagna',
        length: 24,
        structure: 'ES2!n4!n4!n1!n1!n10!n',
        bban: {
            length: 20,
            structure: '4!n4!n1!n1!n10!n',
            components: [
                { name: 'Entidad', length: 4, type: 'n' },
                { name: 'Oficina', length: 4, type: 'n' },
                { name: 'Dígito de Control', length: 2, type: 'n' },
                { name: 'N° de Cuenta', length: 10, type: 'n' }
            ]
        }
    },
    {
        code: 'GB',
        name: 'Regno Unito',
        length: 22,
        structure: 'GB2!n4!a6!n8!n',
        bban: {
            length: 18,
            structure: '4!a6!n8!n',
            components: [
                { name: 'Bank Code', length: 4, type: 'a' },
                { name: 'Sort Code', length: 6, type: 'n' },
                { name: 'Account Number', length: 8, type: 'n' }
            ]
        }
    },
    {
        code: 'CH',
        name: 'Svizzera',
        length: 21,
        structure: 'CH2!n5!n12!c',
        bban: {
            length: 17,
            structure: '5!n12!c',
            components: [
                { name: 'Clearing-Nr', length: 5, type: 'n' },
                { name: 'Kontonummer', length: 12, type: 'c' }
            ]
        }
    },
    {
        code: 'BE',
        name: 'Belgio',
        length: 16,
        structure: 'BE2!n3!n7!n2!n',
        bban: {
            length: 12,
            structure: '3!n7!n2!n',
            components: [
                { name: 'Code Banque', length: 3, type: 'n' },
                { name: 'N° de Compte', length: 7, type: 'n' },
                { name: 'Clé', length: 2, type: 'n' }
            ]
        }
    },
    {
        code: 'NL',
        name: 'Paesi Bassi',
        length: 18,
        structure: 'NL2!n4!a10!n',
        bban: {
            length: 14,
            structure: '4!a10!n',
            components: [
                { name: 'Bank Identifier', length: 4, type: 'a' },
                { name: 'Account Number', length: 10, type: 'n' }
            ]
        }
    }
];
