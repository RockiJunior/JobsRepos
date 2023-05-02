import cobroFiscalizacionValidators from '../validators/cobroFiscalizacion.validators';
import { Request, Response } from 'express';
import errorHandler from '../utils/errorHandler';

class CobroFiscalizacionController {
  async create(req: Request, res: Response) {
    try {
      const { fiscalizacionId } = req.body;

      const cobroFiscalizacion = await cobroFiscalizacionValidators.create(
        fiscalizacionId
      );

      res.status(200).json(cobroFiscalizacion);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { conceptos } = req.body;

      const cobroFiscalizacion = await cobroFiscalizacionValidators.update({
        id: Number(id),
        conceptos
      });

      res.status(200).json(cobroFiscalizacion);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const cobroFiscalizacion = await cobroFiscalizacionValidators.delete(
        Number(id)
      );

      res.status(200).json(cobroFiscalizacion);
    } catch (error) {
      return errorHandler(error, res);
    }
  }
}

export default new CobroFiscalizacionController();
