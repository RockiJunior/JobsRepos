import { Router } from 'express';
import expedienteController from '../controllers/expediente.controller';

import { validateTokenEmpleado } from '../utils/jwt';

const router = Router();

router.post('/create', validateTokenEmpleado, expedienteController.create);

router.get('/get_all', validateTokenEmpleado, expedienteController.getAll);

router.get('/by_id/:id', validateTokenEmpleado, expedienteController.getById);

router.get('/by_area', validateTokenEmpleado, expedienteController.byArea);

router.get(
  '/by_admin_id/:id',
  validateTokenEmpleado,
  expedienteController.getByAdminId
);

router.get(
  '/sin_asignar_por_area',
  validateTokenEmpleado,
  expedienteController.getSinAsignarPorArea
);

router.get(
  '/buscar_familia/:id',
  validateTokenEmpleado,
  expedienteController.buscarFamilia
);

router.put(
  '/asignar_empleado',
  validateTokenEmpleado,
  expedienteController.asignarEmpleado
);

router.put(
  '/desasignar_empleado',
  validateTokenEmpleado,
  expedienteController.desasignarEmpleado
);

router.put(
  '/cambiar_area',
  validateTokenEmpleado,
  expedienteController.cambiarArea
);

router.put(
  '/finalizar',
  validateTokenEmpleado,
  expedienteController.finalizarExpediente
);

export default router;
