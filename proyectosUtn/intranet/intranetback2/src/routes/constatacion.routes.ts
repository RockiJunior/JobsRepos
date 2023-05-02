import { Router } from 'express';
import constatacionController from '../controllers/constatacion.controller';
import { validateTokenEmpleado } from '../utils/jwt';
import { upload } from '../utils/multer';

const router = Router();

router.post(
  '/crear_constatacion',
  validateTokenEmpleado,
  constatacionController.crearConstatacion
);
router.get(
  '/by_id/:id',
  validateTokenEmpleado,
  constatacionController.findById
);
router.put(
  '/editar_constatacion',
  validateTokenEmpleado,
  constatacionController.editarConstatacion
);
router.delete(
  '/eliminar_constatacion/:id',
  constatacionController.eliminarConstatacion
);
router.post(
  '/upload_file',
  upload.single('file'),
  validateTokenEmpleado,
  constatacionController.documento
);
export default router;
