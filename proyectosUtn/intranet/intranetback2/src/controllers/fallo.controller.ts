import { Request, Response } from 'express';
import errorHandler from '../utils/errorHandler';
import falloValidator from '../validators/fallo.validator';

class FalloController {
  async findById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const fallo = await falloValidator.findById(Number(id));
      return res.status(200).json(fallo);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async crearFallo(req: Request, res: Response) {
    const { titulo, comentario, tipo, procesoLegalesId } = req.body;
    const { usuarioid } = req.headers;

    try {
      const fallo = await falloValidator.crearFallo({
        titulo,
        comentario,
        tipo,
        procesoLegalesId,
        usuarioId: Number(usuarioid)
      });
      return res.status(200).json(fallo);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async editarFallo(req: Request, res: Response) {
    const { titulo, comentario, tipo, falloId } = req.body;
    const { usuarioid } = req.headers;

    try {
      const fallo = await falloValidator.editarFallo({
        falloId: Number(falloId),
        titulo,
        comentario,
        tipo,
        usuarioId: Number(usuarioid)
      });
      return res.status(200).json(fallo);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async eliminarFallo(req: Request, res: Response) {
    const { id } = req.params;
    const { usuarioid } = req.headers;

    try {
      const fallo = await falloValidator.eliminarfallo({
        falloId: Number(id),
        usuarioId: Number(usuarioid)
      });
      return res.status(200).json(fallo);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async documento(req: Request, res: Response) {
    const {
      falloId,
      documentoId,
      procesoLegalesId,
      userId: expedienteUserId,
      expedienteId
    } = req.body;
    const { usuarioid } = req.headers;
    const filename = req.file?.filename;

    try {
      if (!filename) throw new Error('No se ha recibido el archivo');

      const recibirDocumento = await falloValidator.documento({
        falloId: Number(falloId),
        usuarioId: Number(usuarioid),
        filename,
        expedienteUserId,
        procesoLegalesId: Number(procesoLegalesId),
        documentoId,
        expedienteId
      });

      return res.status(200).json(recibirDocumento);
    } catch (error) {
      errorHandler(error, res);
    }
  }
}

export default new FalloController();
