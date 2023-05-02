import { Router } from 'express';
import resolucionController from '../controllers/resolucion.controller';
import { validateTokenEmpleado } from '../utils/jwt';
import { upload } from '../utils/multer';

const router = Router();

router.post(
  '/crear_resolucion',
  validateTokenEmpleado,
  resolucionController.crearResolucion
);
router.put(
  '/editar_resolucion',
  validateTokenEmpleado,
  resolucionController.editarResolucion
);
router.delete(
  '/eliminar_resolucion/:id',
  resolucionController.eliminarresolucion
);
router.post(
  '/upload_file',
  upload.single('file'),
  validateTokenEmpleado,
  resolucionController.documento
);

export default router;
