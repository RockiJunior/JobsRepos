import { Router } from 'express';
import alertaController from '../controllers/alerta.controller';
import { validateTokenEmpleado } from '../utils/jwt';

const router = Router();

router.post('/create', validateTokenEmpleado, alertaController.create);

export default router;
