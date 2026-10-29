import { Router } from 'express';
import { EmpleadoController } from '../controllers/empleados.controllers.js';
import { MongooseEmployeeRepository } from '../repositories/employee.repository.mongoose.js';
import { validateBody, validateParams } from '../middlewares/validate.middleware.js';
import { authenticateJWT } from '../shared/middlewares/auth.middleware.js'; // Interceptor JWT
import {
  createEmployeeSchema,
  updateEmployeeSchema,
  idParamSchema,
} from '../dtos/employee.dto.js';

// Composition root: aquí (y solo aquí) se decide qué implementación concreta del repositorio se usa
const employeeRepository = new MongooseEmployeeRepository();
const empleadoController = new EmpleadoController(employeeRepository);

const router = Router();

router.get('/empleados', empleadoController.getEmpleados); // Abierto para lectura general de la rejilla
router.get('/empleados/:id', validateParams(idParamSchema), empleadoController.getEmpleadoById);
router.post(
  '/empleados',
  authenticateJWT, // Protegido con JWT
  validateBody(createEmployeeSchema),
  empleadoController.addEmpleado,
);
router.put(
  '/empleados/:id',
  validateParams(idParamSchema),
  validateBody(updateEmployeeSchema),
  empleadoController.updateEmpleado,
);
router.delete(
  '/empleados/:id',
  authenticateJWT, // Protegido con JWT
  validateParams(idParamSchema),
  empleadoController.deleteEmpleado,
);

export default router;