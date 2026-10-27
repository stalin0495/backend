import { Router } from 'express';
import { EmpleadoController } from '../controllers/empleados.controllers.js';
import { MongooseEmployeeRepository } from '../repositories/employee.repository.mongoose.js';
import { validateBody, validateParams } from '../middlewares/validate.middleware.js';
import {
  createEmployeeSchema,
  updateEmployeeSchema,
  idParamSchema,
} from '../dtos/employee.dto.js';

// Composition root: aquí (y solo aquí) se decide qué implementación concreta del repositorio se usa
const employeeRepository = new MongooseEmployeeRepository();
const empleadoController = new EmpleadoController(employeeRepository);

const router = Router();

router.get('/empleados', empleadoController.getEmpleados);
router.get('/empleados/:id', validateParams(idParamSchema), empleadoController.getEmpleadoById);
router.post('/empleados', validateBody(createEmployeeSchema), empleadoController.addEmpleado);
router.put(
  '/empleados/:id',
  validateParams(idParamSchema),
  validateBody(updateEmployeeSchema),
  empleadoController.updateEmpleado,
);
router.delete('/empleados/:id', validateParams(idParamSchema), empleadoController.deleteEmpleado);

export default router;