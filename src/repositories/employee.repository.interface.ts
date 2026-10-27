import type { CreateEmployeeDTO, UpdateEmployeeDTO } from '../dtos/employee.dto.js';

// Contrato agnóstico al motor de persistencia: Express solo conoce esta interfaz
export interface EmployeeEntity {
  _id: string;
  nombre: string;
  cargo: string;
  departamento: string;
  sueldo: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IEmployeeRepository {
  findAll(options?: { page?: number; limit?: number }): Promise<EmployeeEntity[]>;
  findById(id: string): Promise<EmployeeEntity | null>;
  create(data: CreateEmployeeDTO): Promise<EmployeeEntity>;
  update(id: string, data: UpdateEmployeeDTO): Promise<EmployeeEntity | null>;
  delete(id: string): Promise<EmployeeEntity | null>;
}
