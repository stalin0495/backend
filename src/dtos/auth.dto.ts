import { z } from 'zod';

// Blindaje perimetral: valida el cuerpo de la petición antes de tocar el controlador
export const LoginSchema = z.object({
  email: z
    .string({ message: 'El correo electrónico es obligatorio' })
    .email('El formato del correo electrónico proporcionado no es válido')
    .trim(),
  password: z
    .string({ message: 'La contraseña es obligatoria' })
    .min(6, 'La credencial de acceso debe poseer una longitud mínima de 6 caracteres'),
});

export const RegisterSchema = z.object({
  email: z
    .string({ message: 'El correo electrónico es obligatorio' })
    .email('El formato del correo electrónico proporcionado no es válido')
    .trim(),
  password: z
    .string({ message: 'La contraseña es obligatoria' })
    .min(6, 'La credencial de acceso debe poseer una longitud mínima de 6 caracteres'),
  rol: z.string().trim().optional(),
});

export type LoginDTO = z.infer<typeof LoginSchema>;
export type RegisterDTO = z.infer<typeof RegisterSchema>;

