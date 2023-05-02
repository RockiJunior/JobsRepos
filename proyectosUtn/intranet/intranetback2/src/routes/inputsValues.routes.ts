import { Router } from 'express';
import InputsValues from '../controllers/inputValues.controller';
import {
  validateTokenAmbos,
  validateTokenEmpleado,
  validateTokenUsuario
} from '../utils/jwt';
import { upload } from '../utils/multer';

const router = Router();

router.post('/upsert_many', validateTokenUsuario, InputsValues.upsertMany);

router.post('/upsert_many_externos', InputsValues.upsertManyExternos);

router.post(
  '/upsert_many_empleados',
  validateTokenEmpleado,
  InputsValues.upsertManyEmpleados
);

router.post(
  '/upsert_many_empleados_no_notification',
  validateTokenEmpleado,
  InputsValues.upsertManyEmpleadosNoNotification
);

router.post(
  '/upload_file',
  validateTokenAmbos,
  upload.single('file'),
  InputsValues.archivo
);

router.post(
  '/upload_file_externo',
  upload.single('file'),
  InputsValues.archivoExterno
);

export default router;
