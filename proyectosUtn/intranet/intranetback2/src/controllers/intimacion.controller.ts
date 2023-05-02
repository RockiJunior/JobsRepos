import { Request, Response } from 'express';
import errorHandler from '../utils/errorHandler';
import intimacionValidator from '../validators/intimacion.validator';

class IntimacionController {
  async crearIntimacion(req: Request, res: Response) {
    const { titulo, comentario, tramiteId } = req.body;
    const { usuarioid } = req.headers;

    try {
      const intimacion = await intimacionValidator.crearIntimacion({
        titulo,
        comentario,
        tramiteId: Number(tramiteId),
        usuarioId: Number(usuarioid)
      });

      return res.status(200).json(intimacion);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async editarIntimacion(req: Request, res: Response) {
    const { intimacionId, titulo, comentario } = req.body;

    try {
      const informe = await intimacionValidator.editarIntimacion({
        intimacionId: Number(intimacionId),
        titulo,
        comentario
      });
      return res.status(200).json(informe);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async eliminarIntimacion(req: Request, res: Response) {
    const { id } = req.params;
    const { usuarioid } = req.headers;

    try {
      const informe = await intimacionValidator.eliminarIntimacion({
        intimacionId: Number(id),
        empleadoId: Number(usuarioid)
      });
      return res.status(200).json(informe);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async documento(req: Request, res: Response) {
    const {
      intimacionId,
      documentoId,
      tramiteId,
      userId: tramiteUserId
    } = req.body;
    const { usuarioid } = req.headers;
    const filename = req.file?.filename;

    try {
      if (!filename) throw new Error('No se ha recibido el archivo');

      const recibirDocumento = await intimacionValidator.documento({
        intimacionId: Number(intimacionId),
        usuarioId: Number(usuarioid),
        filename,
        tramiteUserId: Number(tramiteUserId),
        tramiteId: Number(tramiteId),
        documentoId: isNaN(documentoId) ? undefined : Number(documentoId)
      });

      return res.status(200).json(recibirDocumento);
    } catch (error) {
      errorHandler(error, res);
    }
  }
}

export default new IntimacionController();
