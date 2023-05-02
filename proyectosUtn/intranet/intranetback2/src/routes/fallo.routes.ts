import { Router } from 'express';
import falloController from '../controllers/fallo.controller';
import { validateTokenEmpleado } from '../utils/jwt';
import { upload } from '../utils/multer';

const router = Router();

router.post('/crear_fallo', validateTokenEmpleado, falloController.crearFallo);
router.get('/by_id/:id', validateTokenEmpleado, falloController.findById);
router.put('/editar_fallo', validateTokenEmpleado, falloController.editarFallo);
router.delete('/eliminar_fallo/:id', falloController.eliminarFallo);
router.post(
  '/upload_file',
  upload.single('file'),
  validateTokenEmpleado,
  falloController.documento
);
export default router;
