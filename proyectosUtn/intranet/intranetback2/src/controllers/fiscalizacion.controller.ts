import { Request, Response } from 'express';
import errorHandler from '../utils/errorHandler';
import fiscalizacionValidators from '../validators/fiscalizacion.validators';

class FiscalizacionController {
  async createFiscalizacion(req: Request, res: Response) {
    const { titulo, expedienteId } = req.body;
    const { usuarioid } = req.headers;

    try {
      const fiscalizacion = await fiscalizacionValidators.create(
        titulo,
        Number(expedienteId),
        Number(usuarioid)
      );
      return res.status(200).json(fiscalizacion);
    } catch (error) {
      errorHandler(error, res);
    }
  }
  async finalizarFiscalizacion(req: Request, res: Response) {
    const { id } = req.params;
    const { tipo } = req.body;
    const { usuarioid } = req.headers;

    try {
      const fiscalizacion =
        await fiscalizacionValidators.finalizarFiscalizacion({
          fiscalizacionId: Number(id),
          usuarioId: Number(usuarioid),
          tipo
        });
      return res.status(200).json(fiscalizacion);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async cancelarFiscalizacion(req: Request, res: Response) {
    const { id } = req.params;
    const { usuarioid } = req.headers;

    try {
      const fiscalizacion = await fiscalizacionValidators.cancelarFiscalizacion(
        { fiscalizacionId: Number(id), usuarioId: Number(usuarioid) }
      );
      return res.status(200).json(fiscalizacion);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async cambiarEstadoYCrearTransaccion(req: Request, res: Response) {
    const { id } = req.params;
    const { conceptosId, conceptoInfraccionNoMatriculadoId } = req.body;

    try {
      const fiscalizacion =
        await fiscalizacionValidators.cambiarEstadoYCrearTransaccion({
          fiscalizacionId: Number(id),
          conceptosId,
          conceptoInfraccionNoMatriculadoId
        });
      return res.status(200).json(fiscalizacion);
    } catch (error) {
      return errorHandler(error, res);
    }
  }
}

export default new FiscalizacionController();
