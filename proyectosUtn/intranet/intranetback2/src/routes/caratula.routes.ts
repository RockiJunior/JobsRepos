import { Router } from 'express';
import caratulaController from '../controllers/caratula.Controller';
import { validateTokenEmpleado } from '../utils/jwt';

const router = Router();

router.get('/all', validateTokenEmpleado, caratulaController.getAll);

router.post('/create', validateTokenEmpleado, caratulaController.create);

router.get('/by_id/:id', validateTokenEmpleado, caratulaController.getById);

router.put('/update', validateTokenEmpleado, caratulaController.update);

router.delete('/delete/:id', validateTokenEmpleado, caratulaController.delete);

export default router;
