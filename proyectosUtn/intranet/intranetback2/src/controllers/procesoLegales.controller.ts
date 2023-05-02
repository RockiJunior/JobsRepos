import procesoLegalesValidator from '../validators/procesoLegales.validator';
import { Request, Response } from 'express';
import errorHandler from '../utils/errorHandler';

class ProcesoLegalesController {
  async create(req: Request, res: Response) {
    const { expedienteId } = req.body;
    const { usuarioid } = req.headers;
    try {
      const procesoLegal = await procesoLegalesValidator.create({
        expedienteId,
        usuarioId: Number(usuarioid)
      });

      return res.status(200).json(procesoLegal);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async pasoAnterior(req: Request, res: Response) {
    const { procesoLegalId } = req.body;
    const { usuarioid } = req.headers;

    try {
      const volverAtras = await procesoLegalesValidator.pasoAnterior({
        procesoLegalId,
        usuarioId: Number(usuarioid)
      });
      return res.status(200).json(volverAtras);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async pasoSiguiente(req: Request, res: Response) {
    const { procesoLegalId } = req.body;
    const { usuarioid } = req.headers;
    try {
      const siguiente = await procesoLegalesValidator.pasoSiguiente({
        procesoLegalId,
        usuarioId: Number(usuarioid)
      });
      return res.status(200).json(siguiente);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async aprobarPorArea(req: Request, res: Response) {
    const { usuarioid } = req.headers;
    const { procesoLegalId } = req.body;
    try {
      const tramite = await procesoLegalesValidator.aprobarPorArea({
        procesoLegalId: Number(procesoLegalId),
        usuarioId: Number(usuarioid)
      });
      return res.status(200).json(tramite);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async rechazarPorArea(req: Request, res: Response) {
    const { usuarioid } = req.headers;
    const { procesoLegalId } = req.body;
    try {
      const tramite = await procesoLegalesValidator.rechazarPorArea({
        procesoLegalId: Number(procesoLegalId),
        usuarioId: Number(usuarioid)
      });
      return res.status(200).json(tramite);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async cancelarProcesoLegales(req: Request, res: Response) {
    const { usuarioid } = req.headers;
    const { procesoLegalesId } = req.body;
    try {
      const procesoLegales =
        await procesoLegalesValidator.cancelarProcesoLegales({
          procesoLegalesId,
          usuarioId: Number(usuarioid)
        });
      return res.status(200).json(procesoLegales);
    } catch (error) {
      return errorHandler(error, res);
    }
  }
}
export default new ProcesoLegalesController();
