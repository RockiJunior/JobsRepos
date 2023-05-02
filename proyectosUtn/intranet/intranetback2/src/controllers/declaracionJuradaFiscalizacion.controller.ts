import { Request, Response } from 'express';
import errorHandler from '../utils/errorHandler';
import declaracionJuradaValidators from '../validators/declaracionJuradaFiscalizacion.validators';

class declaracionJuradaController {
  async findById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const archivo = await declaracionJuradaValidators.findById(Number(id));
      return res.status(200).json(archivo);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async create(req: Request, res: Response) {
    const { usuarioid } = req.headers;
    const {
      titulo,
      fiscalizacionId,
      userId: userFiscalizacionId,
      expedienteId
    } = req.body;
    const filename = req.file?.filename;

    if (!filename) throw new Error('No se ha recibido el archivo');

    try {
      const archivo = await declaracionJuradaValidators.create({
        titulo,
        filename,
        usuarioId: Number(usuarioid),
        fiscalizacionId: Number(fiscalizacionId),
        userFiscalizacionId: Number(userFiscalizacionId),
        expedienteId: Number(expedienteId)
      });

      return res.status(200).json(archivo);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { titulo, filename, path } = req.body;
    try {
      const dictamen = await declaracionJuradaValidators.update({
        id: Number(id),
        titulo,
        filename,
        path
      });
      return res.status(200).json(dictamen);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const { usuarioid } = req.headers;

    try {
      const deleted = await declaracionJuradaValidators.delete(
        Number(id),
        Number(usuarioid)
      );
      return res.status(200).json(deleted);
    } catch (error) {
      errorHandler(error, res);
    }
  }
}

export default new declaracionJuradaController();
