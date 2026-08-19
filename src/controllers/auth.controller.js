import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import { AppError } from '../middlewares/error.middleware.js';
import { validateRegisterInput, validateLoginInput } from '../utils/validators.js';

export async function register(req, res, next) {
  try {
    const errores = validateRegisterInput(req.body);
    if (errores.length > 0) {
      throw new AppError(errores.join(' '), 400);
    }

    const { nombre_completo, email, password, fecha_nacimiento } = req.body;

    const existente = await User.findOne({ email });
    if (existente) {
      throw new AppError('Ya existe un usuario registrado con ese email.', 409);
    }

    const nuevoUsuario = await User.create({
      nombre_completo,
      email,
      password_hash: password, 
      fecha_nacimiento,
      fecha_registro: new Date(),
    });

    return res.status(201).json({
      message: 'Usuario registrado exitosamente.',
      usuario: {
        id: nuevoUsuario._id,
        nombre_completo: nuevoUsuario.nombre_completo,
        email: nuevoUsuario.email,
      },
    });
  } catch (error) {
    return next(error);
  }
}

export async function login(req, res, next) {
  try {
    const errores = validateLoginInput(req.body);
    if (errores.length > 0) {
      throw new AppError(errores.join(' '), 400);
    }

    const { email, password } = req.body;

    const usuario = await User.findOne({ email }).select('+password_hash');
    if (!usuario) {
      throw new AppError('Credenciales inválidas.', 401);
    }

    const passwordValido = await bcrypt.compare(password, usuario.password_hash);
    if (!passwordValido) {
      throw new AppError('Credenciales inválidas.', 401);
    }

    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

    return res.status(200).json({
      message: 'Login exitoso.',
      token,
      usuario: {
        id: usuario._id,
        nombre_completo: usuario.nombre_completo,
        email: usuario.email,
      },
    });
  } catch (error) {
    return next(error);
  }
}