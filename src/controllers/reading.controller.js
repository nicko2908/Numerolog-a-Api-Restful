import User from '../models/user.model.js';
import NumerologyProfile from '../models/numerologyProfile.model.js';
import Reading from '../models/reading.model.js';
import { generateContent, buildReadingPrompt } from '../services/gemini.service.js';
import { AppError } from '../middlewares/error.middleware.js';
import { validateTipoLectura, TIPOS_LECTURA_VALIDOS } from '../utils/validators.js';

export async function generateReading(req, res, next) {
    try {
        const { tipo = 'general' } = req.body;

        if (!validateTipoLectura(tipo)) {
            throw new AppError(`Tipo de lectura inválido. Debe ser uno de: ${TIPOS_LECTURA_VALIDOS.join(', ')}.`, 400);
        }

        const [usuario, perfil] = await Promise.all([
            User.findById(req.user.id),
            NumerologyProfile.findOne({ user: req.user.id }),
        ]);

        if (!usuario) {
            throw new AppError('Usuario no encontrado.', 404);
        }

        if (!perfil) {
            throw new AppError(
                'El usuario no tiene un perfil numerológico calculado. Usa POST /api/v1/numerology/calculate primero.',
                404
            );
        }

        const prompt = buildReadingPrompt({
            nombre: usuario.nombre_completo,
            tipo,
            numero_vida: perfil.numero_vida,
            numero_expresion: perfil.numero_expresion,
            numero_alma: perfil.numero_alma,
        });

        const respuestaIA = await generateContent(prompt);

        const lectura = await Reading.create({
            user: usuario._id,
            prompt,
            respuesta: respuestaIA,
            tipo_lectura: tipo,   
            fecha: new Date(),
        });

        return res.status(201).json({
            message: 'Lectura generada exitosamente.',
            lectura,
        });
    } catch (error) {
        return next(error);
    }
}

export async function getHistory(req, res, next) {
    try {
        const { tipo, page = 1, limit = 10 } = req.query;

        const filtro = { user: req.user.id };
        if (tipo) {
            if (!validateTipoLectura(tipo)) {
                throw new AppError(`Tipo de lectura inválido. Debe ser uno de: ${TIPOS_LECTURA_VALIDOS.join(', ')}.`, 400);
            }
            filtro.tipo_lectura = tipo;
        }

        const pageNum = Math.max(Number(page) || 1, 1);
        const limitNum = Math.max(Number(limit) || 10, 1);

        const [lecturas, total] = await Promise.all([
            Reading.find(filtro)
                .sort({ fecha: -1 })
                .skip((pageNum - 1) * limitNum)
                .limit(limitNum),
            Reading.countDocuments(filtro),
        ]);

        return res.status(200).json({
            total,
            page: pageNum,
            totalPages: Math.ceil(total / limitNum),
            lecturas,
        });
    } catch (error) {
        return next(error);
    }
}