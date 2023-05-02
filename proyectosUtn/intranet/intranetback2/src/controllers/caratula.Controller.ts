import { Request, Response } from 'express';
import errorHandler from '../utils/errorHandler';
import caratulaValidators, {
  CaratulaValidator
} from '../validators/caratula.validators';

class CaratulaController {
  async getAll(req: Request, res: Response) {
    const pagina = req.query.pagina || 1;
    const limite = req.query.limite || 10;
    const orden = req.query.orden ? String(req.query.orden) : 'asc';
    const columna = req.query.columna ? String(req.query.columna) : 'id';
    const busqueda = req.query.busqueda ? String(req.query.busqueda) : '';

    try {
      const caratula = await caratulaValidators.getAll({
        pagina: Number(pagina),
        limite: Number(limite),
        orden,
        columna,
        busqueda
      });

      return res.status(200).json(caratula);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const caratula = await caratulaValidators.getById(Number(id));

      return res.status(200).json(caratula);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async create(req: Request, res: Response) {
    const { titulo, denunciante, denunciado, expedienteId } = req.body;

    try {
      const caratula = await caratulaValidators.create({
        titulo,
        denunciante,
        denunciado,
        expedienteId
      });
      return res.status(200).json(caratula);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { titulo, denunciante, denunciado, expedienteId } = req.body;
    try {
      const caratula = await caratulaValidators.update({
        caratulaId: Number(id),
        data: {
          titulo,
          denunciante,
          denunciado,
          expedienteId
        }
      });
      return res.status(200).json(caratula);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const caratula = await caratulaValidators.delete(Number(id));
      return res.status(200).json(caratula);
    } catch (error) {
      return errorHandler(error, res);
    }
  }
}

export default new CaratulaController();
