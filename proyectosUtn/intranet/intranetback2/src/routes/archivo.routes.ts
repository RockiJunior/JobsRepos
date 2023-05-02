import { Router } from 'express';
import archivoController from '../controllers/archivo.controller';
import { validateTokenEmpleado } from '../utils/jwt';
import { upload } from '../utils/multer';

const router = Router();

router.get('/by_id/:id', validateTokenEmpleado, archivoController.findById);

router.post(
  '/create',
  validateTokenEmpleado,
  upload.single('file'),
  archivoController.create
);

router.put('/update/:id', validateTokenEmpleado, archivoController.update);

router.delete('/delete/:id', validateTokenEmpleado, archivoController.delete);

export default router;
