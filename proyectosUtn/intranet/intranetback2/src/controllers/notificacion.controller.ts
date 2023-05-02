import { Request, Response } from 'express';
import errorHandler from '../utils/errorHandler';
import notificacionValidators from '../validators/notificacion.validators';

class NotificacionController {
  async getByUserId(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const notificacionValidator =
        await notificacionValidators.findNotificacionByUserId(Number(id));
      return res.status(200).json(notificacionValidator);
    } catch (error) {
      return errorHandler(error, res);
    }
  }
  async marcarTodasLeidas(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const notificacionValidator =
        await notificacionValidators.updateMarcarNotifLeida(Number(id));
      return res.status(200).json(notificacionValidator);
    } catch (error) {
      return errorHandler(error, res);
    }
  }
  async marcarTodasVistas(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const notificacionValidator =
        await notificacionValidators.updateMarcarNotifVista(Number(id));
      return res.status(200).json(notificacionValidator);
    } catch (error) {
      return errorHandler(error, res);
    }
  }
  async marcarLeida(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const notificacionValidator =
        await notificacionValidators.updateMarcarNotifByNotifId(Number(id));

      return res.status(200).json(notificacionValidator);
    } catch (error) {
      return errorHandler(error, res);
    }
  }
}

export default new NotificacionController();
