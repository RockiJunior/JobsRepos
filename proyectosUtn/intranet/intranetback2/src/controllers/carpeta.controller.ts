import { Request, Response } from 'express';
import errorHandler from '../utils/errorHandler';
import carpetaValidator from '../validators/carpeta.validators';

class CarpetaController {
  async getById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const carpeta = await carpetaValidator.getById(Number(id));

      return res.status(200).json(carpeta);
    } catch (error) {
      return errorHandler(error, res);
    }
  }
}

export default new CarpetaController();
