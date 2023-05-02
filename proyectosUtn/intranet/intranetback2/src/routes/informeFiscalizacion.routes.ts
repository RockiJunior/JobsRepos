import { Router } from 'express';
import informeFiscalizacionController from '../controllers/informeFiscalizacion.controller';
import { validateTokenEmpleado } from '../utils/jwt';
import { upload } from '../utils/multer';

const router = Router();

router.post(
  '/crear_informe_fiscalizacion',
  validateTokenEmpleado,
  informeFiscalizacionController.crearInformeFiscalizacion
);

router.put(
  '/editar_informe_fiscalizacion',
  validateTokenEmpleado,
  informeFiscalizacionController.editarInformeFiscalizacion
);

router.delete(
  '/eliminar_informe_fiscalizacion/:id',
  informeFiscalizacionController.eliminarInformeFiscalizacion
);

router.post(
  '/upload_file',
  upload.single('file'),
  validateTokenEmpleado,
  informeFiscalizacionController.documento
);

export default router;
