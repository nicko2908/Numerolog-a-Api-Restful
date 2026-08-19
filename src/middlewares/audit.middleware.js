import AuditLog from '../models/auditLog.model.js';
export function auditLogger(req, res, next) {
    const inicio = Date.now();

    res.on('finish', () => {
        const registro = {
            endpoint: req.originalUrl,
            metodo: req.method,
            status_code: res.statusCode,
            timestamp: new Date(),
            user_id: req.user?.id || null,
        };

        AuditLog.create(registro).catch((error) => {
            console.error('No se pudo registrar el log de auditoría:', error.message);
        });
    });

    next();
}