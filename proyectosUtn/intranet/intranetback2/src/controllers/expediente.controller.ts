import { Request, Response } from 'express';
import errorHandler from '../utils/errorHandler';
import expedienteValidators from '../validators/expediente.validators';

class ExpedientesController {
  async getAll(req: Request, res: Response) {
    const { usuarioid } = req.headers;
    const pagina = req.query.pagina || 1;
    const limite = req.query.limite || 10;
    const orden = req.query.orden ? String(req.query.orden) : 'desc';
    const columna = req.query.columna ? String(req.query.columna) : 'createdAt';
    const busqueda = req.query.busqueda ? String(req.query.busqueda) : '';
    const filter = req.query.filter ? String(req.query.filter) : '';
    const rango = req.query.rango ? String(req.query.rango) : '';

    try {
      const expedientes = await expedienteValidators.getAll({
        usuarioId: Number(usuarioid),
        pagina: Number(pagina),
        limite: Number(limite),
        orden,
        columna,
        busqueda,
        rawFilter: filter,
        rawRango: rango
      });
      return res.status(200).json(expedientes);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async create(req: Request, res: Response) {
    const {
      areaId,
      carpetaId,
      tramitePadreId,
      expedientePadreId,
      info,
      denunciaId,
      isDenuncia
    } = req.body;
    try {
      const expediente = await expedienteValidators.create({
        areaId,
        carpetaId,
        tramitePadreId,
        expedientePadreId,
        info,
        denunciaId,
        isDenuncia
      });

      return res.status(200).json(expediente);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const { usuarioid } = req.headers;
    try {
      const expediente = await expedienteValidators.getById({
        usuarioId: Number(usuarioid),
        id: Number(id)
      });
      return res.status(200).json(expediente);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async getByAdminId(req: Request, res: Response) {
    const { id } = req.params;
    const { usuarioid } = req.headers;
    const pagina = req.query.pagina || 1;
    const limite = req.query.limite || 10;
    const orden = req.query.orden ? String(req.query.orden) : 'desc';
    const columna = req.query.columna ? String(req.query.columna) : 'createdAt';
    const busqueda = req.query.busqueda ? String(req.query.busqueda) : '';
    const filter = req.query.filter ? String(req.query.filter) : '';
    const rango = req.query.rango ? String(req.query.rango) : '';

    try {
      const expedientes = await expedienteValidators.getByAdminId({
        id: Number(id),
        usuarioId: Number(usuarioid),
        pagina: Number(pagina),
        limite: Number(limite),
        orden,
        columna,
        busqueda,
        rawFilter: filter,
        rawRango: rango
      });
      return res.status(200).json(expedientes);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async byArea(req: Request, res: Response) {
    const { usuarioid } = req.headers;
    const pagina = req.query.pagina || 1;
    const limite = req.query.limite || 10;
    const orden = req.query.orden ? String(req.query.orden) : 'desc';
    const columna = req.query.columna ? String(req.query.columna) : 'createdAt';
    const busqueda = req.query.busqueda ? String(req.query.busqueda) : '';
    const filter = req.query.filter ? String(req.query.filter) : '';
    const rango = req.query.rango ? String(req.query.rango) : '';

    try {
      const expedientes = await expedienteValidators.byArea({
        usuarioId: Number(usuarioid),
        pagina: Number(pagina),
        limite: Number(limite),
        orden,
        columna,
        busqueda,
        rawFilter: filter,
        rawRango: rango
      });

      return res.status(200).json(expedientes);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async getSinAsignarPorArea(req: Request, res: Response) {
    const { usuarioid } = req.headers;
    const pagina = req.query.pagina || 1;
    const limite = req.query.limite || 10;
    const orden = req.query.orden ? String(req.query.orden) : 'desc';
    const columna = req.query.columna ? String(req.query.columna) : 'createdAt';
    const busqueda = req.query.busqueda ? String(req.query.busqueda) : '';
    const filter = req.query.filter ? String(req.query.filter) : '';
    const rango = req.query.rango ? String(req.query.rango) : '';

    try {
      const expedientes = await expedienteValidators.getSinAsignarPorArea({
        usuarioId: Number(usuarioid),
        pagina: Number(pagina),
        limite: Number(limite),
        orden,
        columna,
        busqueda,
        rawFilter: filter,
        rawRango: rango
      });
      return res.status(200).json(expedientes);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async buscarFamilia(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const tramite = await expedienteValidators.buscarFamilia(Number(id));
      return res.status(200).json(tramite);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async asignarEmpleado(req: Request, res: Response) {
    const { encargadoId, expedienteId } = req.body;
    const { usuarioid } = req.headers;
    try {
      const asignarEmpleado = await expedienteValidators.asignarEmpleado({
        encargadoId,
        expedienteId,
        usuarioId: Number(usuarioid)
      });
      return res.status(200).json(asignarEmpleado);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async desasignarEmpleado(req: Request, res: Response) {
    const { expedienteId } = req.body;
    const { usuarioid } = req.headers;
    try {
      const desasignarEmpleado = await expedienteValidators.desasignarEmpleado({
        expedienteId,
        usuarioId: Number(usuarioid)
      });
      return res.status(200).json(desasignarEmpleado);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async cambiarArea(req: Request, res: Response) {
    const { expedienteId, areaId } = req.body;
    const { usuarioid } = req.headers;
    try {
      const cambiarArea = await expedienteValidators.cambiarArea({
        usuarioId: Number(usuarioid),
        expedienteId: Number(expedienteId),
        areaId: Number(areaId)
      });
      return res.status(200).json(cambiarArea);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  finalizarExpediente = async (req: Request, res: Response) => {
    const { expedienteId } = req.body;
    const { usuarioid } = req.headers;
    try {
      const expediente = await expedienteValidators.finalizarExpediente({
        usuarioId: Number(usuarioid),
        expedienteId: Number(expedienteId)
      });
      return res.status(200).json(expediente);
    } catch (error) {
      return errorHandler(error, res);
    }
  };
}

export default new ExpedientesController();
