import { Router } from 'express';
import homeInfoController from '../controllers/homeInfo.controller';
import { validateTokenEmpleado } from '../utils/jwt';

const router = Router();

router.get('/get', validateTokenEmpleado, homeInfoController.get);

export default router;
