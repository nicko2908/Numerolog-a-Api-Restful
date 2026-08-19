import NumerologyProfile from '../models/numerologyProfile.model.js';
import CompatibilityMatch from '../models/compatibilityMatch.model.js';
import { generateContent, buildCompatibilityPrompt } from '../services/gemini.service.js';
import { calculateCompatibilityScore } from '../services/numerologia.service.js';
import { AppError } from '../middlewares/error.middleware.js';
import { isValidObjectId } from '../utils/validators.js';

export async function checkCompatibility(req, res, next) {
    try {
        const { otroUsuarioId } = req.body;

        if (!otroUsuarioId || !isValidObjectId(otroUsuarioId)) {
            throw new AppError('otroUsuarioId es obligatorio y debe ser un ID válido.', 400);
        }

        if (otroUsuarioId === req.user.id) {
            throw new AppError('No puedes calcular compatibilidad contigo mismo.', 400);
        }

        const [perfilPropio, perfilOtro] = await Promise.all([
            NumerologyProfile.findOne({ user: req.user.id }),
            NumerologyProfile.findOne({ user: otroUsuarioId }),
        ]);

        if (!perfilPropio) {
            throw new AppError(
                'Aún no tienes un perfil numerológico calculado. Usa POST /api/v1/numerology/calculate primero.',
                404
            );
        }

        if (!perfilOtro) {
            throw new AppError('El otro usuario no tiene un perfil numerológico calculado.', 404);
        }

        const puntaje = calculateCompatibilityScore(perfilPropio, perfilOtro);

        const prompt = buildCompatibilityPrompt(perfilPropio, perfilOtro, puntaje);
        const interpretacion = await generateContent(prompt);

        const match = await CompatibilityMatch.create({
            usuario_1: req.user.id,
            usuario_2: otroUsuarioId,
            puntaje,
            interpretacion,
        });

        return res.status(201).json({
            message: 'Análisis de compatibilidad generado exitosamente.',
            resultado: match,
        });
    } catch (error) {
        return next(error);
    }
}