import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Forzamos a cargar el archivo .env desde la raíz del proyecto
dotenv.config();

const connectDB = async () => {
  try {
    // Si la variable no carga desde .env, usará la URL local por defecto
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/biblioteca';
    
    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB Conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error al conectar: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;