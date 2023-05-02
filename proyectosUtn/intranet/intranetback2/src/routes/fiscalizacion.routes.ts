import { Router } from 'express';
import fiscalizacionController from '../controllers/fiscalizacion.controller';
import { validateTokenEmpleado } from '../utils/jwt';

const router = Router();

router.post(
  '/crear_fiscalizacion',
  validateTokenEmpleado,
  fiscalizacionController.createFiscalizacion
);

router.put(
  '/finalizar/:id',
  validateTokenEmpleado,
  fiscalizacionController.finalizarFiscalizacion
);

router.put(
  '/cancelar/:id',
  validateTokenEmpleado,
  fiscalizacionController.cancelarFiscalizacion
);

router.put(
  '/cambiar_estado_crear_transaccion/:id',
  validateTokenEmpleado,
  fiscalizacionController.cambiarEstadoYCrearTransaccion
);

export default router;
