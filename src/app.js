import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import numerologyRoutes from './routes/numerology.routes.js';
import readingRoutes from './routes/reading.routes.js';
import compatibilityRoutes from './routes/compatibility.routes.js';

import { auditLogger } from './middlewares/audit.middleware.js';
import { notFound, errorHandler } from './middlewares/error.middleware.js';

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(auditLogger); 

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', mensaje: 'API de numerología funcionando' });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/numerology', numerologyRoutes);
app.use('/api/v1/readings', readingRoutes);
app.use('/api/v1/compatibility', compatibilityRoutes);

app.use(notFound);
app.use(errorHandler); // siempre al final

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});