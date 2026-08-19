import jwt from 'jsonwebtoken';
import { AppError } from './error.middleware.js';

export function protect(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError('No se proporcionó un token de autenticación.', 401);
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = { id: decoded.id };
        next();
    } catch (error) {
        next(error);
    }
}