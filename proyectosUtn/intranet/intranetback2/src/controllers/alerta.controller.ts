import { Request, Response } from 'express';
import errorHandler from '../utils/errorHandler';
import alertaValidator from '../validators/alerta.validator';

class AlertaController {
  async create(req: Request, res: Response) {
    const { mensaje, fecha, areaId, empleadoId } = req.body;

    try {
      const alerta = await alertaValidator.create({
        mensaje,
        fecha,
        areaId,
        empleadoId
      });

      return res.status(200).json(alerta);
    } catch (error) {
      return errorHandler(error, res);
    }
  }
}

export default new AlertaController();
