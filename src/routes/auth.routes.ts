import { Router } from 'express';
import { MongooseAuthRepository } from '../repositories/auth.repository.mongoose.js';
import { AuthController } from '../controllers/auth.controller.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import { LoginSchema, RegisterSchema } from '../dtos/auth.dto.js';

// Composition root: aquí (y solo aquí) se decide qué implementación concreta del repositorio se usa
const authRepository = new MongooseAuthRepository();
const authController = new AuthController(authRepository);

const router = Router();

// Endpoint de registro de nuevas credenciales (hash de contraseña vía bcrypt)
router.post('/register', validateBody(RegisterSchema), authController.register);

// Endpoint de login blindado perimetralmente con el DTO de Zod
router.post('/login', validateBody(LoginSchema), authController.login);

export default router;
