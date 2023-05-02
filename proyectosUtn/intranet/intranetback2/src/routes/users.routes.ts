import { Router } from 'express';
import UsersController from '../controllers/users.controller';
import { validateTokenAmbos, validateTokenEmpleado } from '../utils/jwt';

const router = Router();

router.get('/by_id/:id', validateTokenAmbos, UsersController.getById);
router.post('/create', UsersController.create);
router.put('/update/:id', validateTokenAmbos, UsersController.update);
router.delete('/delete/:id', validateTokenEmpleado, UsersController.delete);
router.put('/verify_by_email', UsersController.verifyByEmail);
router.get('/get_matriculados', UsersController.getMatriculados);
router.get('/get_usuarios_con_carpeta', UsersController.getUsuariosConCarpeta);

export default router;
