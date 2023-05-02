import { Request, Response } from 'express';
import errorHandler from '../utils/errorHandler';
import disponibilidadValidator from '../validators/disponibilidad.validator';

class DisponibilidadController {
  async byArea(req: Request, res: Response) {
    const { areaId } = req.params;
    const { usuarioid } = req.headers;
    try {
      const disponibilidades = await disponibilidadValidator.byAreaId(
        Number(usuarioid),
        Number(areaId)
      );
      return res.status(200).json(disponibilidades);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async create(req: Request, res: Response) {
    const { nombre, areaId, inicio, fin, lun, mar, mie, jue, vie, sab, dom } =
      req.body;
    try {
      const disponibilidad = await disponibilidadValidator.create(
        areaId,
        nombre,
        inicio,
        fin,
        lun,
        mar,
        mie,
        jue,
        vie,
        sab,
        dom
      );
      return res.status(200).json(disponibilidad);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { usuarioid } = req.headers;
    const data = req.body;
    try {
      const disponibilidad = await disponibilidadValidator.update(
        Number(usuarioid),
        Number(id),
        data
      );
      return res.status(200).json(disponibilidad);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const disponibilidad = await disponibilidadValidator.delete(Number(id));
      return res.status(200).json(disponibilidad);
    } catch (error) {
      return errorHandler(error, res);
    }
  }
}

export default new DisponibilidadController();
