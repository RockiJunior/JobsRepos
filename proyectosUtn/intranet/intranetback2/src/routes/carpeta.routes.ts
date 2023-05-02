import { Router } from 'express';
import CarpetaController from '../controllers/carpeta.controller';

const router = Router();

router.get('/by_id/:id', CarpetaController.getById);

export default router;
