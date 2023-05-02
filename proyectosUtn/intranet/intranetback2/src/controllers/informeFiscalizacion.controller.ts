import { Request, Response } from 'express';
import errorHandler from '../utils/errorHandler';
import informeFiscalizacionValidator from '../validators/informeFiscalizacion.validator';

class InformeFiscalizacionController {
  async crearInformeFiscalizacion(req: Request, res: Response) {
    const { titulo, comentario, fiscalizacionId } = req.body;
    const { usuarioid } = req.headers;

    try {
      const informeFiscalizacion =
        await informeFiscalizacionValidator.crearInformeFiscalizacion({
          titulo,
          comentario,
          usuarioId: Number(usuarioid),
          fiscalizacionId
        });
      return res.status(200).json(informeFiscalizacion);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async editarInformeFiscalizacion(req: Request, res: Response) {
    const { titulo, comentario, informeFiscalizacionId } = req.body;
    const { usuarioid } = req.headers;

    try {
      const informeFiscalizacion =
        await informeFiscalizacionValidator.editarInformeFiscalizacion({
          informeFiscalizacionId: Number(informeFiscalizacionId),
          titulo,
          comentario,
          usuarioId: Number(usuarioid)
        });
      return res.status(200).json(informeFiscalizacion);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async eliminarInformeFiscalizacion(req: Request, res: Response) {
    const { id } = req.params;
    const { usuarioid } = req.headers;

    try {
      const informeFiscalizacion =
        await informeFiscalizacionValidator.eliminarInformeFiscalizacion({
          informeFiscalizacionId: Number(id),
          empleadoId: Number(usuarioid)
        });
      return res.status(200).json(informeFiscalizacion);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async documento(req: Request, res: Response) {
    const {
      informeFiscalizacionId,
      documentoId,
      fiscalizacionId,
      userId: expedienteUserId,
      expedienteId
    } = req.body;
    const { usuarioid } = req.headers;
    const filename = req.file?.filename;

    try {
      if (!filename) throw new Error('No se ha recibido el archivo');

      const recibirDocumento = await informeFiscalizacionValidator.documento({
        informeFiscalizacionId: Number(informeFiscalizacionId),
        usuarioId: Number(usuarioid),
        filename,
        expedienteUserId,
        fiscalizacionId: Number(fiscalizacionId),
        documentoId: isNaN(documentoId) ? undefined : Number(documentoId),
        expedienteId
      });

      return res.status(200).json(recibirDocumento);
    } catch (error) {
      errorHandler(error, res);
    }
  }
}

export default new InformeFiscalizacionController();
