import { Router } from 'express';
import configController from '../controllers/config.controller';
import { validateTokenEmpleado } from '../utils/jwt';

const router = Router();

router.get('/', validateTokenEmpleado, configController.get);
router.put('/update', validateTokenEmpleado, configController.update);

export default router;
