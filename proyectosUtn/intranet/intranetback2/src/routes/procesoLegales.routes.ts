import { Router } from 'express';
import ProcesoLegalesController from '../controllers/procesoLegales.controller';

import { validateTokenAmbos, validateTokenEmpleado } from '../utils/jwt';

const router = Router();

router.post('/create', validateTokenEmpleado, ProcesoLegalesController.create);
router.put(
  '/paso_anterior',
  validateTokenEmpleado,
  ProcesoLegalesController.pasoAnterior
);
router.put(
  '/paso_siguiente',
  validateTokenEmpleado,
  ProcesoLegalesController.pasoSiguiente
);

router.put(
  '/aprobar_por_area',
  validateTokenEmpleado,
  ProcesoLegalesController.aprobarPorArea
);

router.put(
  '/rechazar_por_area',
  validateTokenEmpleado,
  ProcesoLegalesController.rechazarPorArea
);

router.put(
  '/cancelar',
  validateTokenAmbos,
  ProcesoLegalesController.cancelarProcesoLegales
);

export default router;
