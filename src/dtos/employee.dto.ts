import { z } from 'zod';

// Blindaje perimetral: reglas de negocio declaradas una sola vez y reutilizadas
export const createEmployeeSchema = z.object({
  nombre: z
    .string({ message: 'El nombre es obligatorio' })
    .trim()
    .min(3, 'El nombre debe tener al menos 3 caracteres'),
  cargo: z
    .string({ message: 'El cargo es obligatorio' })
    .trim()
    .min(2, 'El cargo debe tener al menos 2 caracteres'),
  departamento: z
    .string({ message: 'El departamento es obligatorio' })
    .trim()
    .min(2, 'El departamento debe tener al menos 2 caracteres'),
  sueldo: z
    .number({ message: 'El sueldo debe ser numérico' })
    .positive('El sueldo debe ser mayor a 0'),
});

export const updateEmployeeSchema = createEmployeeSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'Debe enviar al menos un campo para actualizar' },
);

export const idParamSchema = z.object({
  id: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'El identificador proporcionado no es válido'),
});

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});

export type CreateEmployeeDTO = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeDTO = z.infer<typeof updateEmployeeSchema>;
export type PaginationQueryDTO = z.infer<typeof paginationQuerySchema>;
