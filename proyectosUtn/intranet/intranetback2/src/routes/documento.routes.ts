import { Router } from 'express';
import documentoController from '../controllers/documento.controller';
import { validateTokenAmbos } from '../utils/jwt';

const router = Router();

router.delete('/delete/:id', validateTokenAmbos, documentoController.delete);

export default router;
