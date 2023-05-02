import { Router } from 'express';
import TurnosController from '../controllers/turnos.controller';
import { validateTokenAmbos, validateTokenEmpleado } from '../utils/jwt';

const router = Router();

router.post('/turnos_disponibles', TurnosController.turnosDisponibles);
router.post(
  '/reservar_turno',
  validateTokenAmbos,
  TurnosController.reservarTurno
);
router.post(
  '/turnos_reservados',
  validateTokenEmpleado,
  TurnosController.turnosReservados
);

router.get('/all', validateTokenEmpleado, TurnosController.all);

router.put(
  '/actualizar_estado_turno',
  validateTokenEmpleado,
  TurnosController.actualizarEstado
);

router.post('/turno_fiscalizacion', TurnosController.turnoFiscalizacion);

export default router;
