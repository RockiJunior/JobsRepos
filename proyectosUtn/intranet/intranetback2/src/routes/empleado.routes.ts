import { Router } from 'express';
import empleadoController from '../controllers/empleado.controller';
import { validateTokenEmpleado } from '../utils/jwt';

const router = Router();

router.get(
  '/by_user_area',
  validateTokenEmpleado,
  empleadoController.getByUserArea
);

router.get('/get_all', validateTokenEmpleado, empleadoController.getAll);

router.post('/create', validateTokenEmpleado, empleadoController.crearEmpleado);

router.put('/update', validateTokenEmpleado, empleadoController.updateEmpleado);

router.delete(
  '/delete/:empleadoId',
  validateTokenEmpleado,
  empleadoController.deleteEmpleado
);

export default router;
