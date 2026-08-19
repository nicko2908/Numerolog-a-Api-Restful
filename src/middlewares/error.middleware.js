export class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
    }
}

export function notFound(req, res, next) {
    const error = new AppError(`Ruta no encontrada: ${req.method} ${req.originalUrl}`, 404);
    next(error);
}

export function errorHandler(err, req, res, next) {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Error interno del servidor.';

    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors)
            .map((e) => e.message)
            .join(' ');
    }
    if (err.name === 'CastError') {
        statusCode = 400;
        message = `Valor inválido para el campo "${err.path}".`;
    }
    if (err.code === 11000) {
        statusCode = 409;
        message = 'Ya existe un registro con ese valor único (duplicado).';
    }
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token inválido o expirado.';
    }

    if (process.env.NODE_ENV !== 'production') {
        console.error(err);
    }

    return res.status(statusCode).json({
        error: message,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    });
}