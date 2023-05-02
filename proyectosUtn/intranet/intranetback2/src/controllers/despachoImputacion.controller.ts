import { Request, Response } from 'express';
import errorHandler from '../utils/errorHandler';
import despachoImputacionValidators from '../validators/despachoImputacion.validators';

class DespachoImputacionController {
  async getById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const despachoImputacion = await despachoImputacionValidators.getById(
        Number(id)
      );

      return res.status(200).json(despachoImputacion);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async getByProcesoLegales(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const despachoImputacion =
        await despachoImputacionValidators.getByProcesoLegalesId(Number(id));

      return res.status(200).json(despachoImputacion);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async create(req: Request, res: Response) {
    const { usuarioid } = req.headers;
    const { titulo, motivo, imputaciones, procesoLegalesId } = req.body;

    try {
      const despachoImputacion = await despachoImputacionValidators.create({
        titulo,
        motivo,
        imputaciones,
        procesoLegalesId,
        usuarioId: Number(usuarioid)
      });
      return res.status(200).json(despachoImputacion);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { titulo, motivo, imputaciones } = req.body;
    const { usuarioid } = req.headers;
    try {
      const despachoImputacion = await despachoImputacionValidators.update({
        id: Number(id),
        titulo,
        motivo,
        imputaciones,
        usuarioId: Number(usuarioid)
      });
      return res.status(200).json(despachoImputacion);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const despachoImputacion = await despachoImputacionValidators.delete(
        Number(id)
      );
      return res.status(200).json(despachoImputacion);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async getImputaciones(req: Request, res: Response) {
    try {
      const imputaciones = await despachoImputacionValidators.getImputaciones();
      return res.status(200).json(imputaciones);
    } catch (error) {
      return errorHandler(error, res);
    }
  }
}

export default new DespachoImputacionController();
