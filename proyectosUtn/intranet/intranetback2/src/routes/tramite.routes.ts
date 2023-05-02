import { Router } from 'express';
import TramitesController from '../controllers/tramite.controller';

import {
  validateTokenAmbos,
  validateTokenEmpleado,
  validateTokenUsuario
} from '../utils/jwt';

const router = Router();

router.get('/by_id/:id', validateTokenUsuario, TramitesController.getById);

router.get(
  '/by_user_id/:id',
  validateTokenUsuario,
  TramitesController.getByUserId
);

router.get(
  '/empleado/by_id/:id',
  validateTokenEmpleado,
  TramitesController.getByIdParaEmpleado
);

router.get(
  '/by_admin_id/:id',
  validateTokenEmpleado,
  TramitesController.getByAdminId
);

router.get('/by_area', validateTokenEmpleado, TramitesController.byArea);
router.get(
  '/by_area_sa/:areaId',
  validateTokenEmpleado,
  TramitesController.byArea
);

router.get('/get_all', validateTokenEmpleado, TramitesController.getAll);

router.get(
  '/sin_asignar_por_area',
  validateTokenEmpleado,
  TramitesController.getSinAsignarPorArea
);

router.post(
  '/by_user_tipo',
  validateTokenUsuario,
  TramitesController.getUltimoTramiteByUserByTipo
);

router.post('/create', validateTokenAmbos, TramitesController.create);

router.put(
  '/asignar_empleado',
  validateTokenEmpleado,
  TramitesController.asignarMatriculador
);

router.put(
  '/desasignar_empleado',
  validateTokenEmpleado,
  TramitesController.desasignarMatriculador
);

router.put(
  '/paso_anterior',
  validateTokenEmpleado,
  TramitesController.pasoAnterior
);

router.put(
  '/paso_siguiente',
  validateTokenEmpleado,
  TramitesController.pasoSiguiente
);

router.put('/goto_paso', validateTokenEmpleado, TramitesController.gotoPaso);

router.put(
  '/aprobar_por_area',
  validateTokenEmpleado,
  TramitesController.aprobarPorArea
);

router.put(
  '/rechazar_por_area',
  validateTokenEmpleado,
  TramitesController.rechazarPorArea
);

router.put(
  '/solicitar_modificacion_por_area',
  validateTokenEmpleado,
  TramitesController.solicitarModificacionPorArea
);

router.put(
  '/rechazar_tramite',
  validateTokenEmpleado,
  TramitesController.rechazarTramite
);

router.put(
  '/cancelar_tramite',
  validateTokenAmbos,
  TramitesController.cancelarTramite
);

router.get(
  '/buscar_familia/:id',
  validateTokenEmpleado,
  TramitesController.buscarFamilia
);

router.post('/create_sin_usuario', TramitesController.createSinUsuario);

router.get('/sin_usuario', TramitesController.getSinUsuario);

router.post('/crear_externo', TramitesController.crearTramiteConInputsExterno);

router.get('/get_externo/:id', TramitesController.getTramiteExterno);

export default router;
