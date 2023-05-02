import { Router } from 'express';
import CedulaController from '../controllers/cedula.controller';
import { validateTokenEmpleado } from '../utils/jwt';
import { upload } from '../utils/multer';

const router = Router();

router.get('/all', validateTokenEmpleado, CedulaController.getAll)

router.post('/create', validateTokenEmpleado, CedulaController.create);

router.get('/by_id/:id', validateTokenEmpleado, CedulaController.getById);

router.get('/by_area', validateTokenEmpleado, CedulaController.byArea);

router.get(
  '/sin_asignar',
  validateTokenEmpleado,
  CedulaController.getSinAsignar
);
router.get(
  '/by_empleado_id/:id',
  validateTokenEmpleado,
  CedulaController.getByEmpleadoId
);
router.put(
  '/asignar_empleado/:cedulaId',
  validateTokenEmpleado,
  CedulaController.asignarEmpleado
);
router.put(
  '/desasignar_empleado/:cedulaId',
  validateTokenEmpleado,
  CedulaController.desasignarEmpleado
);
router.put(
  '/actualizar_fecha_recepcion/:cedulaId',
  validateTokenEmpleado,
  CedulaController.actualizarFechaRecepcion
);
router.put(
  '/paso_siguiente/:cedulaId',
  validateTokenEmpleado,
  CedulaController.pasoSiguiente
);

router.get(
  '/buscar_familia/:id',
  validateTokenEmpleado,
  CedulaController.buscarFamilia
);

router.post(
  '/upload_file',
  upload.single('file'),
  validateTokenEmpleado,
  CedulaController.documento
);

export default router;
