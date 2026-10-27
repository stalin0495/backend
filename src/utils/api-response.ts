import type { Response } from 'express';

// Response Wrapper Pattern: contrato único y simétrico para éxitos y errores
export interface ApiSuccessBody<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiErrorBody {
  success: false;
  message: string;
  errors?: unknown;
}

export class ApiResponse {
  static success<T>(res: Response, data: T, message = 'Operación exitosa', statusCode = 200): Response {
    const body: ApiSuccessBody<T> = { success: true, message, data };
    return res.status(statusCode).json(body);
  }

  static error(res: Response, message: string, statusCode = 500, errors?: unknown): Response {
    const body: ApiErrorBody = { success: false, message, errors };
    return res.status(statusCode).json(body);
  }
}
