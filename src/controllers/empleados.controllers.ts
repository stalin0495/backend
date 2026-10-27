import type { NextFunction, Request, Response } from 'express';
import { ApiResponse } from '../utils/api-response.js';
import { AppError } from '../utils/app-error.js';
import type { IEmployeeRepository } from '../repositories/employee.repository.interface.js';
import type { CreateEmployeeDTO, UpdateEmployeeDTO } from '../dtos/employee.dto.js';

// Agnóstico al ODM: solo depende de la interfaz IEmployeeRepository (Patrón Repository)
export class EmpleadoController {
  constructor(private readonly employeeRepository: IEmployeeRepository) {}

  getEmpleados = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const options: { page?: number; limit?: number } = {};
      if (req.query['page']) options.page = Number(req.query['page']);
      if (req.query['limit']) options.limit = Number(req.query['limit']);
      const empleados = await this.employeeRepository.findAll(options);
      ApiResponse.success(res, empleados, 'Empleados obtenidos correctamente');
    } catch (error) {
      next(error);
    }
  };

  getEmpleadoById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const empleado = await this.employeeRepository.findById(id);
      if (!empleado) {
        throw new AppError(`No se encontró un empleado con el id ${id}`, 404);
      }
      ApiResponse.success(res, empleado, 'Empleado obtenido correctamente');
    } catch (error) {
      next(error);
    }
  };

  addEmpleado = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = req.body as CreateEmployeeDTO;
      const empleado = await this.employeeRepository.create(data);
      ApiResponse.success(res, empleado, 'Empleado guardado correctamente', 201);
    } catch (error) {
      next(error);
    }
  };

  updateEmpleado = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const data = req.body as UpdateEmployeeDTO;
      const empleado = await this.employeeRepository.update(id, data);
      if (!empleado) {
        throw new AppError(`No se encontró un empleado con el id ${id}`, 404);
      }
      ApiResponse.success(res, empleado, 'Empleado actualizado correctamente');
    } catch (error) {
      next(error);
    }
  };

  deleteEmpleado = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const empleado = await this.employeeRepository.delete(id);
      if (!empleado) {
        throw new AppError(`No se encontró un empleado con el id ${id}`, 404);
      }
      ApiResponse.success(res, empleado, 'Empleado eliminado correctamente');
    } catch (error) {
      next(error);
    }
  };
}
