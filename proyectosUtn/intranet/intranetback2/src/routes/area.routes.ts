import { Router } from 'express';
import AreaController from '../controllers/area.controller';

const router = Router();

router.get('/get_all', AreaController.getAllAreas);

export default router;
