import bcrypt from 'bcrypt';
import User from '../models/user.model.js';
import { AppError } from '../middlewares/error.middleware.js';
import { isValidEmail } from '../utils/validators.js';

export async function getMe(req, res, next) {
    try {
        const usuario = await User.findById(req.user.id).select('-password_hash');
        if (!usuario) {
            throw new AppError('Usuario no encontrado.', 404);
        }

        return res.status(200).json({ usuario });
    } catch (error) {
        return next(error);
    }
}

export async function updateMe(req, res, next) {
    try {
        const { nombre_completo, email, fecha_nacimiento } = req.body;
        const cambios = {};

        if (nombre_completo !== undefined) {
            if (typeof nombre_completo !== 'string' || nombre_completo.trim().length < 3) {
                throw new AppError('nombre_completo debe tener al menos 3 caracteres.', 400);
            }
            cambios.nombre_completo = nombre_completo;
        }

        if (email !== undefined) {
            if (!isValidEmail(email)) {
                throw new AppError('El email no tiene un formato válido.', 400);
            }
            const emailEnUso = await User.findOne({ email, _id: { $ne: req.user.id } });
            if (emailEnUso) {
                throw new AppError('Ese email ya está en uso por otra cuenta.', 409);
            }
            cambios.email = email;
        }

        if (fecha_nacimiento !== undefined) {
            if (Number.isNaN(new Date(fecha_nacimiento).getTime())) {
                throw new AppError('fecha_nacimiento no es una fecha válida.', 400);
            }
            cambios.fecha_nacimiento = fecha_nacimiento;
        }

        if (Object.keys(cambios).length === 0) {
            throw new AppError('No se enviaron campos para actualizar.', 400);
        }

        const usuario = await User.findByIdAndUpdate(req.user.id, cambios, {
            new: true,
            runValidators: true,
        }).select('-password_hash');

        return res.status(200).json({
            message: 'Usuario actualizado exitosamente.',
            usuario,
        });
    } catch (error) {
        return next(error);
    }
}

export async function updatePassword(req, res, next) {
    try {
        const { passwordActual, passwordNuevo } = req.body;

        if (!passwordActual || !passwordNuevo) {
            throw new AppError('passwordActual y passwordNuevo son obligatorios.', 400);
        }
        if (passwordNuevo.length < 8) {
            throw new AppError('passwordNuevo debe tener al menos 8 caracteres.', 400);
        }

        const usuario = await User.findById(req.user.id).select('+password_hash');
        if (!usuario) {
            throw new AppError('Usuario no encontrado.', 404);
        }

        const passwordValido = await bcrypt.compare(passwordActual, usuario.password_hash);
        if (!passwordValido) {
            throw new AppError('La contraseña actual es incorrecta.', 401);
        }

        usuario.password_hash = await bcrypt.hash(passwordNuevo, 10);
        await usuario.save();

        return res.status(200).json({ message: 'Contraseña actualizada exitosamente.' });
    } catch (error) {
        return next(error);
    }
}