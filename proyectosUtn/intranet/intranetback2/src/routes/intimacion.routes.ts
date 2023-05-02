import { Router } from 'express';
import intimacionController from '../controllers/intimacion.controller';
import { upload } from '../utils/multer';
import { validateTokenEmpleado } from '../utils/jwt';
const router = Router();

router.post(
  '/crear',
  validateTokenEmpleado,
  intimacionController.crearIntimacion
);
router.put(
  '/editar',
  validateTokenEmpleado,
  intimacionController.editarIntimacion
);
router.delete(
  '/eliminar/:id',
  validateTokenEmpleado,
  intimacionController.eliminarIntimacion
);
router.post(
  '/upload_file',
  upload.single('file'),
  validateTokenEmpleado,
  intimacionController.documento
);

export default router;
