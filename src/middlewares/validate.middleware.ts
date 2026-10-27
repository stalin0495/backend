import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';
import { ZodError } from 'zod';
import { AppError } from '../utils/app-error.js';

const formatZodIssues = (error: ZodError) =>
  error.issues.map((issue) => ({ campo: issue.path.join('.'), mensaje: issue.message }));

// Middlewares genéricos que blindan req.body / req.params / req.query contra cualquier esquema Zod
export const validateBody =
  (schema: ZodType) => (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      next(new AppError('Los datos enviados no son válidos', 400, formatZodIssues(result.error)));
      return;
    }
    req.body = result.data;
    next();
  };

export const validateParams =
  (schema: ZodType) => (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      next(new AppError('Los parámetros enviados no son válidos', 400, formatZodIssues(result.error)));
      return;
    }
    req.params = result.data as typeof req.params;
    next();
  };

export const validateQuery =
  (schema: ZodType) => (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      next(new AppError('Los parámetros de consulta no son válidos', 400, formatZodIssues(result.error)));
      return;
    }
    (req as Request & { validatedQuery?: unknown }).validatedQuery = result.data;
    next();
  };
