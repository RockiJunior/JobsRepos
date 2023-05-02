import { Request, Response } from 'express';
import errorHandler from '../utils/errorHandler';
import notaInternaValidators from '../validators/notaInterna.validators';

class NotaInternaController {
  async getById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const notaInterna = await notaInternaValidators.getById(Number(id));
      return res.status(200).json(notaInterna);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async create(req: Request, res: Response) {
    const { usuarioid } = req.headers;
    const {
      descripcion,
      tramiteId,
      expedienteId,
      cedulaId,
      fiscalizacionId,
      procesoLegalesId
    } = req.body;

    try {
      const notaInterna = await notaInternaValidators.create({
        descripcion,
        empleadoId: Number(usuarioid),
        tramiteId,
        expedienteId,
        cedulaId,
        fiscalizacionId,
        procesoLegalesId
      });
      return res.status(200).json(notaInterna);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { descripcion, tramiteId, empleadoId } = req.body;
    try {
      const notaInterna = await notaInternaValidators.update({
        id: Number(id),
        data: {
          descripcion,
          tramiteId,
          empleadoId
        }
      });
      return res.status(200).json(notaInterna);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async delete(req: Request, res: Response) {
    const { usuarioid } = req.headers;
    const { id } = req.params;
    try {
      const notaDelete = await notaInternaValidators.delete(
        Number(id),
        Number(usuarioid)
      );
      return res.status(200).json(notaDelete);
    } catch (error) {
      return errorHandler(error, res);
    }
  }
}

export default new NotaInternaController();
