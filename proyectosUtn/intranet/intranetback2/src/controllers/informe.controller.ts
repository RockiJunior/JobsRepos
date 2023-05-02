import { Request, Response } from 'express';
import errorHandler from '../utils/errorHandler';
import informeValidator from '../validators/informe.validator';

class InformeController {
  async crearInforme(req: Request, res: Response) {
    const {
      titulo,
      comentario,
      tramiteId,
      expedienteId,
      cedulaId,
      procesoLegalesId
    } = req.body;
    const { usuarioid } = req.headers;

    try {
      const informe = await informeValidator.crearInforme({
        titulo,
        comentario,
        usuarioId: Number(usuarioid),
        tramiteId: tramiteId && Number(tramiteId),
        expedienteId: expedienteId && Number(expedienteId),
        cedulaId: cedulaId && Number(cedulaId),
        procesoLegalesId: procesoLegalesId && Number(procesoLegalesId)
      });
      return res.status(200).json(informe);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async editarInforme(req: Request, res: Response) {
    const { titulo, comentario, informeId } = req.body;
    const { usuarioid } = req.headers;

    try {
      const informe = await informeValidator.editarInforme({
        informeId: Number(informeId),
        titulo,
        comentario,
        usuarioId: Number(usuarioid)
      });
      return res.status(200).json(informe);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async eliminarInforme(req: Request, res: Response) {
    const { id } = req.params;
    const { usuarioid } = req.headers;

    try {
      const informe = await informeValidator.eliminarInforme({
        informeId: Number(id),
        empleadoId: Number(usuarioid)
      });
      return res.status(200).json(informe);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async documento(req: Request, res: Response) {
    const {
      informeId,
      documentoId,
      tramiteId,
      userId: tramiteUserId,
      expedienteId,
      cedulaId,
      procesoLegalesId
    } = req.body;
    const { usuarioid } = req.headers;
    const filename = req.file?.filename;

    try {
      if (!filename) throw new Error('No se ha recibido el archivo');

      const recibirDocumento = await informeValidator.documento({
        informeId: Number(informeId),
        usuarioId: Number(usuarioid),
        filename,
        tramiteUserId,
        tramiteId: Number(tramiteId),
        expedienteId: Number(expedienteId),
        cedulaId: Number(cedulaId),
        documentoId: isNaN(documentoId) ? undefined : Number(documentoId),
        procesoLegalesId: isNaN(procesoLegalesId)
          ? undefined
          : Number(procesoLegalesId)
      });

      return res.status(200).json(recibirDocumento);
    } catch (error) {
      errorHandler(error, res);
    }
  }
}

export default new InformeController();
