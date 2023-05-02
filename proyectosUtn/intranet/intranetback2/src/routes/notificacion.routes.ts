import { Router } from 'express';
import Notificacion from '../controllers/notificacion.controller';
import { validateTokenAmbos } from '../utils/jwt';

const router = Router();

router.get('/by_user_id/:id', validateTokenAmbos, Notificacion.getByUserId);
router.put(
  '/marcar_todas_leidas/:id',
  validateTokenAmbos,
  Notificacion.marcarTodasLeidas
);
router.put(
  '/marcar_todas_vistas/:id',
  validateTokenAmbos,
  Notificacion.marcarTodasVistas
);
router.put('/marcar_leida/:id', validateTokenAmbos, Notificacion.marcarLeida);

export default router;
