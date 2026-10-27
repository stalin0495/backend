import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/app-error.js';
import { ApiResponse } from '../utils/api-response.js';

// Interceptor global: ninguna excepción cruda del sistema llega al cliente
export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof AppError) {
    ApiResponse.error(res, err.message, err.statusCode, err.details);
    return;
  }

  if (err instanceof ZodError) {
    const errors = err.issues.map((issue) => ({ campo: issue.path.join('.'), mensaje: issue.message }));
    ApiResponse.error(res, 'Los datos enviados no son válidos', 400, errors);
    return;
  }

  console.error('❌ [Error no controlado]:', err);
  ApiResponse.error(res, 'Error interno del servidor', 500);
};
