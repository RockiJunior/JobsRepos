import { Request, Response } from 'express';
import errorHandler from '../utils/errorHandler';
import dictamenValidator from '../validators/dictamen.validators';

class DictamenController {
  async findById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const dictamen = await dictamenValidator.findById(Number(id));
      return res.status(200).json(dictamen);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async create(req: Request, res: Response) {
    const { usuarioid } = req.headers;
    const { titulo, comentario, tramiteId, procesoLegalesId } = req.body;
    try {
      const dictamen = await dictamenValidator.create({
        titulo,
        comentario,
        tramiteId,
        empleadoId: Number(usuarioid),
        procesoLegalesId
      });
      return res.status(200).json(dictamen);
    } catch (error) {
      return errorHandler(error, res);
    }
  }
  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { titulo, comentario } = req.body;
    const { usuarioid } = req.headers;
    try {
      const dictamen = await dictamenValidator.update({
        id: Number(id),
        usuarioId: Number(usuarioid),
        data: {
          comentario,
          titulo
        }
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
      const dictamen = await dictamenValidator.eliminarDictamen({
        dictamenId: Number(id),
        empleadoId: Number(usuarioid)
      });
      return res.status(200).json(dictamen);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async documento(req: Request, res: Response) {
    const {
      dictamenId,
      documentoId,
      tramiteId,
      userId,
      expedienteId,
      procesoLegalesId
    } = req.body;
    const { usuarioid } = req.headers;
    const filename = req.file?.filename;

    try {
      if (!filename) throw new Error('No se ha recibido el archivo');

      const recibirDocumento = await dictamenValidator.documento({
        dictamenId,
        usuarioId: Number(usuarioid),
        filename,
        tramiteUserId: userId,
        tramiteId,
        documentoId,
        expedienteId,
        expedienteUserId: userId,
        procesoLegalesId
      });

      return res.status(200).json(recibirDocumento);
    } catch (error) {
      errorHandler(error, res);
    }
  }
}

export default new DictamenController();
