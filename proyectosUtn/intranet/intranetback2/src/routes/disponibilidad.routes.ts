import { Router } from 'express';
import disponibilidadController from '../controllers/disponibilidad.controller';

const router = Router();

router.get('/byArea/:areaId', disponibilidadController.byArea);
router.post('/create', disponibilidadController.create);
router.put('/update/:id', disponibilidadController.update);
router.delete('/delete/:id', disponibilidadController.delete);

export default router;
