import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const MODEL_NAME = process.env.GEMINI_MODEL || 'gemini-3.6-flash';

/**
 * Envía un prompt a Gemini y devuelve el texto generado.
 * @param {string} prompt
 * @returns {Promise<string>}
 */
export async function generateContent(prompt) {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY no está configurada en las variables de entorno.');
    }

    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const result = await model.generateContent(prompt);
    const response = result.response;

    return response.text();
}

/**
 * Construye el prompt para una lectura numerológica individual.
 * @param {{ nombre: string, tipo: 'diaria'|'general'|'anual', numero_vida: number, numero_expresion: number, numero_alma: number }} datos
 */
export function buildReadingPrompt({ nombre, tipo, numero_vida, numero_expresion, numero_alma }) {
    return `Eres un experto numerólogo. Genera una lectura numerológica de tipo "${tipo}" para ${nombre}.
Datos numerológicos:
- Número de Camino de Vida: ${numero_vida}
- Número de Expresión: ${numero_expresion}
- Número del Alma: ${numero_alma}

La lectura debe ser cálida, personal, profesional y basada en el significado real de estos números en la numerología pitagórica. Responde en español, en 3-4 párrafos, sin usar markdown.`;
}


export function buildCompatibilityPrompt(perfilA, perfilB, puntaje) {
    return `Eres un experto numerólogo. Analiza la compatibilidad entre dos personas según sus números numerológicos.

Persona A -> Camino de Vida: ${perfilA.numero_vida}, Expresión: ${perfilA.numero_expresion}, Alma: ${perfilA.numero_alma}
Persona B -> Camino de Vida: ${perfilB.numero_vida}, Expresión: ${perfilB.numero_expresion}, Alma: ${perfilB.numero_alma}

El puntaje de compatibilidad calculado es ${puntaje}/100.

Genera una interpretación en español, cálida y profesional, explicando fortalezas y posibles fricciones de la relación según estos números. 3 párrafos, sin markdown.`;
}