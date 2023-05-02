import { Router } from 'express';
import cobroFiscalizacionControllers from '../controllers/cobroFiscalizacion.controllers';
import { validateTokenEmpleado } from '../utils/jwt';

const router = Router();

router.post(
  '/create',
  validateTokenEmpleado,
  cobroFiscalizacionControllers.create
);
router.put(
  '/update/:id',
  validateTokenEmpleado,
  cobroFiscalizacionControllers.update
);
router.delete(
  '/delete/:id',
  validateTokenEmpleado,
  cobroFiscalizacionControllers.delete
);

export default router;
