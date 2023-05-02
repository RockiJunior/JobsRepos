import { Router } from 'express';
import inputsValuesFiscalizacionController from '../controllers/inputValuesFiscalizacion.controller';
import { validateTokenEmpleado } from '../utils/jwt';
import { upload } from '../utils/multer';

const router = Router();

router.post(
  '/upsert_many',
  validateTokenEmpleado,
  inputsValuesFiscalizacionController.upsertMany
);

router.post(
  '/upload_file',
  validateTokenEmpleado,
  upload.single('file'),
  inputsValuesFiscalizacionController.archivo
);

export default router;
