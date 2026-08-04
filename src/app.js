import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', mensaje: 'API de numerología funcionando' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});