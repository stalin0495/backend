import { EmpleadoModel, type IEmpleado } from '../models/empleado.model.js';
import type { CreateEmployeeDTO, UpdateEmployeeDTO } from '../dtos/employee.dto.js';
import type { EmployeeEntity, IEmployeeRepository } from './employee.repository.interface.js';

// Única pieza del sistema que conoce Mongoose/MongoDB: el resto del backend depende de IEmployeeRepository
const toEntity = (doc: IEmpleado): EmployeeEntity => {
  const entity: EmployeeEntity = {
    _id: doc._id.toString(),
    nombre: doc.nombre,
    cargo: doc.cargo,
    departamento: doc.departamento,
    sueldo: doc.sueldo,
  };
  if (doc.createdAt) entity.createdAt = doc.createdAt;
  if (doc.updatedAt) entity.updatedAt = doc.updatedAt;
  return entity;
};

export class MongooseEmployeeRepository implements IEmployeeRepository {
  async findAll(options?: { page?: number; limit?: number }): Promise<EmployeeEntity[]> {
    const query = EmpleadoModel.find().sort({ createdAt: -1 });

    if (options?.page && options?.limit) {
      query.skip((options.page - 1) * options.limit).limit(options.limit);
    }

    const empleados = await query.exec();
    return empleados.map(toEntity);
  }

  async findById(id: string): Promise<EmployeeEntity | null> {
    const empleado = await EmpleadoModel.findById(id);
    return empleado ? toEntity(empleado) : null;
  }

  async create(data: CreateEmployeeDTO): Promise<EmployeeEntity> {
    const empleado = await EmpleadoModel.create(data);
    return toEntity(empleado);
  }

  async update(id: string, data: UpdateEmployeeDTO): Promise<EmployeeEntity | null> {
    const empleado = await EmpleadoModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    return empleado ? toEntity(empleado) : null;
  }

  async delete(id: string): Promise<EmployeeEntity | null> {
    const empleado = await EmpleadoModel.findByIdAndDelete(id);
    return empleado ? toEntity(empleado) : null;
  }
}
