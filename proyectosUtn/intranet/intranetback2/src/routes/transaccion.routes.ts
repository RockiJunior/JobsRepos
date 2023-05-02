import { Router } from 'express';
import TransaccionController from '../controllers/transaccion.controller';
import {
  validateTokenAmbos,
  validateTokenEmpleado,
  validateTokenUsuario
} from '../utils/jwt';
import { upload } from '../utils/multer';

const router = Router();

router.get('/by_id/:id', validateTokenAmbos, TransaccionController.getById);
router.get(
  '/by_empledado/:id',
  validateTokenEmpleado,
  TransaccionController.transaccionByEmpleado
);
router.get('/get_all', validateTokenEmpleado, TransaccionController.getAll);

router.delete(
  '/delete/:id',
  validateTokenEmpleado,
  TransaccionController.delete
);

router.put(
  '/aprobar_rechazar/:id',
  validateTokenEmpleado,
  TransaccionController.aprobarRechazarTransac
);

router.post(
  '/upload_file',
  upload.single('file'),
  TransaccionController.comprobante
);

router.post(
  '/elegir_cuotas',
  validateTokenUsuario,
  TransaccionController.elegirCuotas
);

router.get(
  '/get_conceptos_fiscalizacion',
  validateTokenEmpleado,
  TransaccionController.getConceptosFiscalizacion
);

router.get('/get_types', TransaccionController.getTypes);

router.post(
  '/crear_transaccion_fiscalizacion',
  validateTokenEmpleado,
  TransaccionController.crearTransaccionFiscalizacion
);

export default router;
