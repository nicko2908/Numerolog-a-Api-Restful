import User from '../models/user.model.js';
import NumerologyProfile from '../models/numerologyProfile.model.js';
import { calculateCoreNumbers } from '../services/numerologia.service.js';
import { AppError } from '../middlewares/error.middleware.js';

export async function calculateProfile(req, res, next) {
  try {
    const usuario = await User.findById(req.user.id);
    if (!usuario) {
      throw new AppError('Usuario no encontrado.', 404);
    }

    const { numero_vida, numero_expresion, numero_alma } = calculateCoreNumbers({
      nombreCompleto: usuario.nombre_completo,
      fechaNacimiento: usuario.fecha_nacimiento,
    });

const perfil = await NumerologyProfile.findOneAndUpdate(
  { user: usuario._id },
  { user: usuario._id, numero_vida, numero_expresion, numero_alma },
  { new: true, upsert: true, setDefaultsOnInsert: true }
);

    return res.status(200).json({
      message: 'Perfil numerológico calculado exitosamente.',
      perfil,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getProfile(req, res, next) {
  try {
  const perfil = await NumerologyProfile.findOne({ user: req.user.id });

    if (!perfil) {
      throw new AppError(
        'Este usuario aún no tiene un perfil numerológico calculado. Usa POST /calculate primero.',
        404
      );
    }

    return res.status(200).json({ perfil });
  } catch (error) {
    return next(error);
  }
}