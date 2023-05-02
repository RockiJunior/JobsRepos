import { Router } from 'express';
import eventoController from '../controllers/evento.controller';
import {
  validateTokenAmbos,
  validateTokenEmpleado,
  validateTokenUsuario
} from '../utils/jwt';

const router = Router();

router.post('/create', validateTokenEmpleado, eventoController.create);

router.get(
  '/lista_espera',
  validateTokenEmpleado,
  eventoController.getListaEsperaEventos
);

router.put(
  '/invitar_usuarios',
  validateTokenEmpleado,
  eventoController.invitarUsuarios
);

router.put(
  '/aceptar_rechazar',
  validateTokenUsuario,
  eventoController.aceptarRechazar
);

router.put(
  '/aceptar_rechazar_empleado',
  validateTokenEmpleado,
  eventoController.aceptarRechazarEmpleado
);

router.get('/by_id/:id', validateTokenAmbos, eventoController.getById);

router.get(
  '/by_user_id',
  validateTokenUsuario,
  eventoController.getByIdfindAllEventByUser
);

router.get(
  '/all_pending',
  validateTokenEmpleado,
  eventoController.findAllEventPending
);

router.get(
  '/event_types',
  validateTokenEmpleado,
  eventoController.getEventTypes
);

router.put('/update/:id', validateTokenEmpleado, eventoController.update);

router.delete('/delete/:id', validateTokenEmpleado, eventoController.delete);

router.put('/finalizar/:id', validateTokenEmpleado, eventoController.finalizar);

export default router;
