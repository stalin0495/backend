// src/config/database.ts
import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
  // En producción se inyecta MONGO_URI vía variable de entorno (.env); en local cae al valor por defecto
  const MONGO_URI = process.env['MONGO_URI'] || 'mongodb://127.0.0.1/usuarios_db';
  try {
    await mongoose.connect(MONGO_URI);
    console.log('🔄 [Database]: Conexión exitosa a MongoDB');
  } catch (error) {
    console.error('❌ Error crítico al conectar a la base de datos:', error);
    process.exit(1);
  }
};
    