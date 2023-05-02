import { Router } from 'express';
import despachoImputacionController from '../controllers/despachoImputacion.controller';
import { validateTokenEmpleado } from '../utils/jwt';

const router = Router();

router.post(
  '/create',
  validateTokenEmpleado,
  despachoImputacionController.create
);

router.get(
  '/by_id/:id',
  validateTokenEmpleado,
  despachoImputacionController.getById
);

router.get(
  '/by_proceso_legales/:id',
  validateTokenEmpleado,
  despachoImputacionController.getByProcesoLegales
);

router.put(
  '/update/:id',
  validateTokenEmpleado,
  despachoImputacionController.update
);

router.delete(
  '/delete/:id',
  validateTokenEmpleado,
  despachoImputacionController.delete
);

router.get(
  '/get_imputaciones',
  validateTokenEmpleado,
  despachoImputacionController.getImputaciones
);

export default router;
