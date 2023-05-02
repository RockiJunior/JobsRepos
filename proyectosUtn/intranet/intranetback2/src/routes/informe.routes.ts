import { Router } from 'express';
import informeController from '../controllers/informe.controller';
import { validateTokenEmpleado } from '../utils/jwt';
import { upload } from '../utils/multer';

const router = Router();

router.post(
  '/crear_informe',
  validateTokenEmpleado,
  informeController.crearInforme
);
router.put(
  '/editar_informe',
  validateTokenEmpleado,
  informeController.editarInforme
);
router.delete('/eliminar_informe/:id', informeController.eliminarInforme);
router.post(
  '/upload_file',
  upload.single('file'),
  validateTokenEmpleado,
  informeController.documento
);

export default router;
