import { Request, Response } from 'express';
import errorHandler from '../utils/errorHandler';
import tipoTramiteValidator from '../validators/tipoTramite.validators';

class TipoTramiteController {
  async getByIdExterno(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const tipoTramite = await tipoTramiteValidator.findByIdExterno(
        Number(id)
      );

      return res.status(200).json(tipoTramite);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async getAllUsuario(req: Request, res: Response) {
    const { usuarioid } = req.headers;

    try {
      const tipoTramites = await tipoTramiteValidator.findAllUsuario(
        Number(usuarioid)
      );

      return res.status(200).json(tipoTramites);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async getAllEmpleado(req: Request, res: Response) {
    const { usuarioid } = req.headers;

    try {
      const tipoTramites = await tipoTramiteValidator.findAllEmpleado(
        Number(usuarioid)
      );

      return res.status(200).json(tipoTramites);
    } catch (error) {
      return errorHandler(error, res);
    }
  }
}

export default new TipoTramiteController();
