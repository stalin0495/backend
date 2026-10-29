// src/shared/interfaces/response.interface.ts

// Contrato único de respuesta para los endpoints que consumen el middleware de autenticación
export interface IApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
  };
  timestamp: string;
}
