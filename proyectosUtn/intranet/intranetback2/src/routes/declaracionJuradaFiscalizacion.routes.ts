import { Router } from 'express';
import declaracionJuradaController from '../controllers/declaracionJuradaFiscalizacion.controller';
import { validateTokenEmpleado } from '../utils/jwt';
import { upload } from '../utils/multer';

const router = Router();

router.get('/by_id/:id', validateTokenEmpleado, declaracionJuradaController.findById);

router.post(
  '/create',
  validateTokenEmpleado,
  upload.single('file'),
  declaracionJuradaController.create
);

router.put('/update/:id', validateTokenEmpleado, declaracionJuradaController.update);

router.delete('/delete/:id', validateTokenEmpleado, declaracionJuradaController.delete);

export default router;
