import { Request, Response } from 'express';
import errorHandler from '../utils/errorHandler';
import inputsValuesValidator from '../validators/inputValues.validator';

class InputsValuesController {
  async upsertManyExternos(req: Request, res: Response) {
    const { inputs, tramiteId, tituloSeccion } = req.body;

    try {
      const tramiteUpdated = await inputsValuesValidator.upsertManyExternos({
        arrInputs: inputs,
        tramiteId,
        tituloSeccion
      });

      return res.status(200).json(tramiteUpdated);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async upsertMany(req: Request, res: Response) {
    const { inputs, tramiteId, usuarioId, tituloSeccion } = req.body;

    try {
      const tramiteUpdated = await inputsValuesValidator.upsertMany({
        arrInputs: inputs,
        tramiteId,
        usuarioId,
        tituloSeccion
      });

      return res.status(200).json(tramiteUpdated);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async upsertManyEmpleados(req: Request, res: Response) {
    const { inputs, tramiteId, usuarioId, tituloSeccion } = req.body;

    try {
      const tramiteUpdated = await inputsValuesValidator.upsertManyEmpleados({
        arrInputs: inputs,
        tramiteId,
        usuarioId,
        tituloSeccion
      });

      return res.status(200).json(tramiteUpdated);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async upsertManyEmpleadosNoNotification(req: Request, res: Response) {
    const { inputs, tramiteId } = req.body;

    try {
      const tramiteUpdated =
        await inputsValuesValidator.upsertManyEmpleadosNoNotification({
          arrInputs: inputs,
          tramiteId
        });

      return res.status(200).json(tramiteUpdated);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async archivo(req: Request, res: Response) {
    const { inputNombre, tramiteId, userId, estado, borrarAnteriores } =
      req.body;
    const filename = req.file?.filename;

    try {
      if (!filename) throw new Error('No se ha recibido el archivo');

      const recibirArchivo = await inputsValuesValidator.archivo(
        inputNombre,
        Number(tramiteId),
        userId,
        estado,
        filename,
        borrarAnteriores
      );

      return res.status(200).json(recibirArchivo);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async archivoExterno(req: Request, res: Response) {
    const { inputNombre, tramiteId, estado, borrarAnteriores } = req.body;
    const filename = req.file?.filename;

    try {
      if (!filename) throw new Error('No se ha recibido el archivo');

      const recibirArchivo = await inputsValuesValidator.archivoExterno(
        inputNombre,
        Number(tramiteId),
        estado,
        filename,
        borrarAnteriores
      );

      return res.status(200).json(recibirArchivo);
    } catch (error) {
      return errorHandler(error, res);
    }
  }
}

export default new InputsValuesController();
