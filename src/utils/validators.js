import mongoose from 'mongoose';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const TIPOS_LECTURA_VALIDOS = ['diaria', 'general', 'anual'];

export function isValidEmail(email) {
    return typeof email === 'string' && EMAIL_REGEX.test(email);
}

export function isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

export function isValidDate(value) {
    return value !== undefined && value !== null && !Number.isNaN(new Date(value).getTime());
}

/**
 * Valida el body de POST /auth/register.
 * @returns {string[]} lista de errores (vacía si es válido)
 */
export function validateRegisterInput({ nombre_completo, email, password, fecha_nacimiento } = {}) {
    const errores = [];

    if (!nombre_completo || typeof nombre_completo !== 'string' || nombre_completo.trim().length < 3) {
        errores.push('nombre_completo es obligatorio y debe tener al menos 3 caracteres.');
    }
    if (!isValidEmail(email)) {
        errores.push('email es obligatorio y debe tener un formato válido.');
    }
    if (!password || typeof password !== 'string' || password.length < 8) {
        errores.push('password es obligatorio y debe tener al menos 8 caracteres.');
    }
    if (!isValidDate(fecha_nacimiento)) {
        errores.push('fecha_nacimiento es obligatoria y debe ser una fecha válida.');
    }

    return errores;
}

export function validateLoginInput({ email, password } = {}) {
    const errores = [];

    if (!isValidEmail(email)) {
        errores.push('email es obligatorio y debe tener un formato válido.');
    }
    if (!password) {
        errores.push('password es obligatorio.');
    }

    return errores;
}

export function validateTipoLectura(tipo) {
    return TIPOS_LECTURA_VALIDOS.includes(tipo);
}