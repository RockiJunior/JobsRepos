import { Request, Response } from 'express';
import errorHandler from '../utils/errorHandler';
import inputsValuesFiscalizacionValidator from '../validators/inputValuesFiscalizacion.validator';

class InputsValuesFiscalizacionController {
  async upsertMany(req: Request, res: Response) {
    const { usuarioid } = req.headers;
    const { inputs, fiscalizacionId } = req.body;

    try {
      const expedienteUpdated =
        await inputsValuesFiscalizacionValidator.upsertMany({
          arrInputs: inputs,
          fiscalizacionId,
          usuarioId: Number(usuarioid)
        });

      return res.status(200).json(expedienteUpdated);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async archivo(req: Request, res: Response) {
    const {
      inputNombre,
      expedienteId,
      userId,
      estado,
      borrarAnteriores,
      fiscalizacionId
    } = req.body;
    const filename = req.file?.filename;

    try {
      if (!filename) throw new Error('No se ha recibido el archivo');

      const recibirArchivo = await inputsValuesFiscalizacionValidator.archivo({
        inputNombre,
        userId,
        estado,
        filename,
        borrarAnteriores,
        expedienteId,
        fiscalizacionId
      });

      return res.status(200).json(recibirArchivo);
    } catch (error) {
      return errorHandler(error, res);
    }
  }
}

export default new InputsValuesFiscalizacionController();
