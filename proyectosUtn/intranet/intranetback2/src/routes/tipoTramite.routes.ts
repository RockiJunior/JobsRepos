import { Router } from 'express';
import TipoTramiteController from '../controllers/tipoTramite.controller';
import { validateTokenEmpleado, validateTokenUsuario } from '../utils/jwt';
const router = Router();

router.get('/get_by_id_externo/:id', TipoTramiteController.getByIdExterno);

router.get(
  '/get_all_usuario',
  validateTokenUsuario,
  TipoTramiteController.getAllUsuario
);

router.get(
  '/get_all_empleado',
  validateTokenEmpleado,
  TipoTramiteController.getAllEmpleado
);

export default router;
