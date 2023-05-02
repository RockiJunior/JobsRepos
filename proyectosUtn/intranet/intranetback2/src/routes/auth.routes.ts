import { Router } from 'express';
import AuthController from '../controllers/auth.controller';
import { validateTokenAmbos } from '../utils/jwt';

const router = Router();

router.post('/login', AuthController.login);
router.post('/login_cabaprop', AuthController.loginCabaprop)
router.post('/login_empleado', AuthController.loginEmpleado);
router.post('/check_logged', validateTokenAmbos, AuthController.checkLogged);
router.post('/reenviar-mail', AuthController.reenviarMail);
router.post('/recuperar-contrasenia', AuthController.recuperarContrasenia);
router.post('/restablecer-contrasenia', AuthController.restablecerContrasenia);
router.post('/solicitud-cambio-mail', AuthController.solicitudCambioMail);
router.post('/restablecer-mail', AuthController.restablecerMail);

export default router;
