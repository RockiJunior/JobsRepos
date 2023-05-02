import { Router } from 'express';
import notaInternaController from '../controllers/notaInterna.controller';
import { validateTokenEmpleado } from '../utils/jwt';

const router = Router();

router.get('/by_id/:id', validateTokenEmpleado, notaInternaController.getById);
router.post('/create', validateTokenEmpleado, notaInternaController.create);
router.put('/update/:id', validateTokenEmpleado, notaInternaController.update);
router.delete(
  '/delete/:id',
  validateTokenEmpleado,
  notaInternaController.delete
);

export default router;
