import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

if (!GEMINI_API_KEY) {
    console.warn('⚠️  GEMINI_API_KEY no está configurada en las variables de entorno.');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export function getGeminiModel() {
    if (!GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY no está configurada en las variables de entorno.');
    }

    return genAI.getGenerativeModel({ model: GEMINI_MODEL });
}

export { GEMINI_MODEL };
export default genAI;