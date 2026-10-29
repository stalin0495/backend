import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import empleadosRoutes from './routes/empleados.routes.js';
import authRoutes from './routes/auth.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { AppError } from './utils/app-error.js';

const app = express();
app.use(cors());
app.use(express.json());

//settings
app.set('puerto', process.env['PORT'] || 3000);
app.set('nombreApp', 'Gestión de empleados');
app.use(morgan('dev'));

// Registro ordenado de módulos independientes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1', empleadosRoutes);

// Ruta no encontrada y manejador global de errores (siempre al final)
app.use((req, _res, next) => {
  next(new AppError(`Ruta no encontrada: ${req.originalUrl}`, 404));
});
app.use(errorHandler);

export default app;
