import { Router } from 'express';
import DictamenController from '../controllers/dictamen.controllers';
import { validateTokenEmpleado } from '../utils/jwt';
import { upload } from '../utils/multer';

const router = Router();

router.post('/create', validateTokenEmpleado, DictamenController.create);
router.get('/by_id/:id', validateTokenEmpleado, DictamenController.findById);
router.put('/update/:id', validateTokenEmpleado, DictamenController.update);
router.delete('/delete/:id', validateTokenEmpleado, DictamenController.delete);
router.post(
  '/upload_file',
  upload.single('file'),
  DictamenController.documento
);
export default router;
