import { Request, Response } from 'express';
import errorHandler from '../utils/errorHandler';
import resolucionValidator from '../validators/resolucion.validator';

class ResolucionController {
  async crearResolucion(req: Request, res: Response) {
    const { usuarioid: empleadoId } = req.headers;
    const { titulo, comentario, tramiteId, procesoLegalesId } = req.body;

    try {
      const resolucion = await resolucionValidator.crearResolucion({
        titulo,
        comentario,
        empleadoId: Number(empleadoId),
        tramiteId,
        procesoLegalesId
      });
      return res.status(200).json(resolucion);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async editarResolucion(req: Request, res: Response) {
    const { titulo, comentario, resolucionId } = req.body;
    const { usuarioid } = req.headers;

    try {
      const resolucion = await resolucionValidator.editarResolucion({
        resolucionId: Number(resolucionId),
        titulo,
        comentario,
        usuarioId: Number(usuarioid)
      });
      return res.status(200).json(resolucion);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async eliminarresolucion(req: Request, res: Response) {
    const { id } = req.params;
    const { usuarioid } = req.headers;

    try {
      const resolucion = await resolucionValidator.eliminarResolucion(
        Number(id),
        Number(usuarioid)
      );
      return res.status(200).json(resolucion);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async documento(req: Request, res: Response) {
    const {
      resolucionId,
      documentoId,
      tramiteId,
      userId: tramiteUserId,
      procesoLegalesId,
      expedienteId
    } = req.body;
    const { usuarioid } = req.headers;
    const filename = req.file?.filename;

    try {
      if (!filename) throw new Error('No se ha recibido el archivo');

      const recibirDocumento = await resolucionValidator.documento({
        resolucionId: Number(resolucionId),
        usuarioId: Number(usuarioid),
        filename,
        tramiteUserId,
        tramiteId: Number(tramiteId),
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

export default new ResolucionController();
