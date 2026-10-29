import type { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { IAuthRepository } from '../repositories/auth.repository.interface.js';
import type { IApiResponse } from '../shared/interfaces/response.interface.js';
import type { LoginDTO, RegisterDTO } from '../dtos/auth.dto.js';

const SALT_ROUNDS = 10;

// Response Wrapper Pattern: éxito con JWT firmado o error semántico delegado al interceptor global
export class AuthController {
  constructor(private readonly authRepository: IAuthRepository) {}

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password, rol } = req.body as RegisterDTO;

      // 1. Evitar identidades duplicadas
      const existingUser = await this.authRepository.findByEmail(email);
      if (existingUser) {
        const errorResponse: IApiResponse = {
          success: false,
          error: {
            message: 'El correo electrónico ya se encuentra registrado',
            code: 'USER_ALREADY_EXISTS',
          },
          timestamp: new Date().toISOString(),
        };
        res.status(409).json(errorResponse);
        return;
      }

      // 2. Hash criptográfico de la contraseña (nunca se persiste en texto plano)
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      const newUserData: { email: string; password: string; rol?: string } = {
        email,
        password: hashedPassword,
      };
      if (rol) newUserData.rol = rol;

      const user = await this.authRepository.createUser(newUserData);

      // 3. Salida envoltura estándar unificada (nunca se expone el hash de la contraseña)
      const response: IApiResponse = {
        success: true,
        data: {
          user: { email: user.email, rol: user.rol },
        },
        timestamp: new Date().toISOString(),
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body as LoginDTO;
      const SECRET_KEY = process.env.JWT_SECRET || 'MIS_LLAVE_SECRETA_DE_MAESTRIA_2026';

      // 1. Verificar existencia de la identidad
      const user = await this.authRepository.findByEmail(email);
      if (!user) {
        const errorResponse: IApiResponse = {
          success: false,
          error: {
            message: 'Credenciales inválidas: El usuario no se encuentra registrado',
            code: 'AUTH_FAILED',
          },
          timestamp: new Date().toISOString(),
        };
        res.status(401).json(errorResponse);
        return;
      }

      // 2. Comparar Hash Criptográfico de la Contraseña
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        const errorResponse: IApiResponse = {
          success: false,
          error: {
            message: 'Credenciales inválidas: Contraseña incorrecta',
            code: 'AUTH_FAILED',
          },
          timestamp: new Date().toISOString(),
        };
        res.status(401).json(errorResponse);
        return;
      }

      // 3. Generación y Firma Contractual del JWT (Expira en 2 horas)
      const token = jwt.sign({ id: user._id, rol: user.rol }, SECRET_KEY, { expiresIn: '2h' });

      // 4. Salida envoltura estándar unificada
      const response: IApiResponse = {
        success: true,
        data: {
          token,
          user: { email: user.email, rol: user.rol },
        },
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
}
