import { Request, Response } from 'express';
import errorHandler from '../utils/errorHandler';
import constatacionValidators from '../validators/constatacion.validators';

class ConstatacionController {
  async findById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const constatacion = await constatacionValidators.findById(Number(id));
      return res.status(200).json(constatacion);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async crearConstatacion(req: Request, res: Response) {
    const { titulo, comentario, estado, fiscalizacionId, fecha } = req.body;
    const { usuarioid } = req.headers;

    try {
      const constatacion = await constatacionValidators.crearConstatacion({
        titulo,
        comentario,
        estado,
        fiscalizacionId,
        usuarioId: Number(usuarioid),
        fecha
      });
      return res.status(200).json(constatacion);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async editarConstatacion(req: Request, res: Response) {
    const { titulo, comentario, estado, constatacionId } = req.body;
    const { usuarioid } = req.headers;

    try {
      const constatacion = await constatacionValidators.editarConstatacion({
        constatacionId,
        titulo,
        comentario,
        estado,
        usuarioId: Number(usuarioid)
      });
      return res.status(200).json(constatacion);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async eliminarConstatacion(req: Request, res: Response) {
    const { id } = req.params;
    const { usuarioid } = req.headers;

    try {
      const constatacion = await constatacionValidators.eliminarConstatacion(
        Number(id),
        Number(usuarioid)
      );
      return res.status(200).json(constatacion);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async documento(req: Request, res: Response) {
    const {
      constatacionId,
      documentoId,
      expedienteId,
      fiscalizacionId,
      userId: expedienteUserId
    } = req.body;
    const { usuarioid } = req.headers;
    const filename = req.file?.filename;

    try {
      if (!filename) throw new Error('No se ha recibido el archivo');

      const recibirDocumento = await constatacionValidators.documento({
        constatacionId,
        usuarioId: Number(usuarioid),
        filename,
        expedienteUserId,
        expedienteId,
        fiscalizacionId,
        documentoId
      });

      return res.status(200).json(recibirDocumento);
    } catch (error) {
      errorHandler(error, res);
    }
  }
}

export default new ConstatacionController();
