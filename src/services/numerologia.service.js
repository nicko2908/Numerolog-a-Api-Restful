const MASTER_NUMBERS = [11, 22, 33];

const LETTER_MAP = {
    a: 1, j: 1, s: 1,
    b: 2, k: 2, t: 2,
    c: 3, l: 3, u: 3,
    d: 4, m: 4, v: 4,
    e: 5, n: 5, w: 5,
    f: 6, o: 6, x: 6,
    g: 7, p: 7, y: 7,
    h: 8, q: 8, z: 8,
    i: 9, r: 9,
};

const VOWELS = new Set(['a', 'e', 'i', 'o', 'u']);

export function reduceToSingleDigit(num) {
    let n = Math.abs(Math.trunc(num));

    while (n > 9 && !MASTER_NUMBERS.includes(n)) {
        n = String(n)
            .split('')
            .reduce((acc, digit) => acc + Number(digit), 0);
    }

    return n;
}


export function calculateLifePathNumber(fechaNacimiento) {
    const fecha = new Date(fechaNacimiento);

    if (Number.isNaN(fecha.getTime())) {
        throw new Error('Fecha de nacimiento inválida para el cálculo numerológico.');
    }

    const dia = reduceToSingleDigit(fecha.getUTCDate());
    const mes = reduceToSingleDigit(fecha.getUTCMonth() + 1);
    const anio = reduceToSingleDigit(fecha.getUTCFullYear());

    return reduceToSingleDigit(dia + mes + anio);
}

export function calculateExpressionNumber(nombreCompleto) {
    const suma = normalizeName(nombreCompleto)
        .split('')
        .reduce((acc, letra) => acc + (LETTER_MAP[letra] || 0), 0);

    return reduceToSingleDigit(suma);
}

export function calculateSoulUrgeNumber(nombreCompleto) {
    const suma = normalizeName(nombreCompleto)
        .split('')
        .filter((letra) => VOWELS.has(letra))
        .reduce((acc, letra) => acc + (LETTER_MAP[letra] || 0), 0);

    return reduceToSingleDigit(suma);
}

export function calculateCoreNumbers({ nombreCompleto, fechaNacimiento }) {
    return {
        numero_vida: calculateLifePathNumber(fechaNacimiento),
        numero_expresion: calculateExpressionNumber(nombreCompleto),
        numero_alma: calculateSoulUrgeNumber(nombreCompleto),
    };
}

export function calculateCompatibilityScore(perfilA, perfilB) {
    const pares = [
        { a: perfilA.numero_vida, b: perfilB.numero_vida },
        { a: perfilA.numero_expresion, b: perfilB.numero_expresion },
        { a: perfilA.numero_alma, b: perfilB.numero_alma },
    ];

    const puntajePorPar = 100 / pares.length;

    const total = pares.reduce((acc, { a, b }) => {
        const diferencia = Math.abs(a - b);
        const factor = Math.max(0, 1 - diferencia / 9);
        return acc + factor * puntajePorPar;
    }, 0);

    return Math.round(total);
}

function normalizeName(nombre) {
    return nombre
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z]/g, '');
}