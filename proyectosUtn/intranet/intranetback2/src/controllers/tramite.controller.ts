import { Request, Response } from 'express';
import errorHandler from '../utils/errorHandler';
import tramitesValidator from '../validators/tramite.validators';

class TramitesController {
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
      const tramites = await tramitesValidator.getAll({
        usuarioId: Number(usuarioid),
        pagina: Number(pagina),
        limite: Number(limite),
        orden,
        columna,
        busqueda,
        rawFilter: filter,
        rawRango: rango
      });

      return res.status(200).json(tramites);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const tramite = await tramitesValidator.getById(Number(id));
      return res.status(200).json(tramite);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async create(req: Request, res: Response) {
    const { tipoId, userId, empleadoId } = req.body;
    const { usuarioid } = req.headers;
    try {
      const tramite = await tramitesValidator.create({
        usuarioSolicitanteId: Number(usuarioid),
        tipoId,
        userId,
        empleadoId
      });
      return res.status(200).json(tramite);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async getByIdParaEmpleado(req: Request, res: Response) {
    const { id } = req.params;
    const { usuarioid } = req.headers;
    try {
      const tramite = await tramitesValidator.getByIdParaEmpleado({
        id: Number(id),
        usuarioId: Number(usuarioid)
      });
      return res.status(200).json(tramite);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async getByUserId(req: Request, res: Response) {
    const { id } = req.params;
    const { usuarioid } = req.headers;
    const pagina = req.query.pagina || 1;
    const limite = req.query.limite || 10;
    const orden = req.query.orden ? String(req.query.orden) : 'desc';
    const columna = req.query.columna ? String(req.query.columna) : 'createdAt';
    const busqueda = req.query.busqueda ? String(req.query.busqueda) : '';
    const filter = req.query.filter ? String(req.query.filter) : '';

    try {
      const tramites = await tramitesValidator.getTramitesByUserId({
        id: Number(id),
        usuarioId: Number(usuarioid),
        pagina: Number(pagina),
        limite: Number(limite),
        orden,
        columna,
        busqueda,
        rawFilter: filter
      });
      return res.status(200).json(tramites);
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
      const tramites = await tramitesValidator.getByAdminId({
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
      return res.status(200).json(tramites);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async byArea(req: Request, res: Response) {
    const { usuarioid } = req.headers;
    const { areaId } = req.params;
    const pagina = req.query.pagina || 1;
    const limite = req.query.limite || 10;
    const orden = req.query.orden ? String(req.query.orden) : 'desc';
    const columna = req.query.columna ? String(req.query.columna) : 'createdAt';
    const busqueda = req.query.busqueda ? String(req.query.busqueda) : '';
    const filter = req.query.filter ? String(req.query.filter) : '';
    const rango = req.query.rango ? String(req.query.rango) : '';

    try {
      const tramites = await tramitesValidator.byArea({
        usuarioId: Number(usuarioid),
        pagina: Number(pagina),
        limite: Number(limite),
        orden,
        columna,
        busqueda,
        areaId: areaId ? Number(areaId) : undefined,
        rawFilter: filter,
        rawRango: rango
      });
      return res.status(200).json(tramites);
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
      const tramite = await tramitesValidator.getSinAsignarPorArea({
        usuarioId: Number(usuarioid),
        pagina: Number(pagina),
        limite: Number(limite),
        orden,
        columna,
        busqueda,
        rawFilter: filter,
        rawRango: rango
      });
      return res.status(200).json(tramite);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async getUltimoTramiteByUserByTipo(req: Request, res: Response) {
    const { userId, tipoTramiteId } = req.body;
    try {
      const ultimoTramite =
        await tramitesValidator.getUltimoTramiteByUserByTipo({
          userId,
          tipoTramiteId
        });
      return res.status(200).json(ultimoTramite);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async asignarMatriculador(req: Request, res: Response) {
    const { encargadoId, tramiteId } = req.body;
    const { usuarioid } = req.headers;
    try {
      const asignarMatriculador = await tramitesValidator.asignarMatriculador({
        encargadoId: Number(encargadoId),
        tramiteId: Number(tramiteId),
        usuarioId: Number(usuarioid)
      });
      return res.status(200).json(asignarMatriculador);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async desasignarMatriculador(req: Request, res: Response) {
    const { tramiteId } = req.body;
    const { usuarioid } = req.headers;
    try {
      const desasignarMatriculador =
        await tramitesValidator.desasignarMatriculador({
          tramiteId: Number(tramiteId),
          usuarioId: Number(usuarioid)
        });
      return res.status(200).json(desasignarMatriculador);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async pasoAnterior(req: Request, res: Response) {
    const { tramiteId } = req.body;
    const { usuarioid } = req.headers;

    try {
      const volverAtras = await tramitesValidator.pasoAnterior({
        tramiteId: Number(tramiteId),
        userId: Number(usuarioid)
      });
      return res.status(200).json(volverAtras);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async pasoSiguiente(req: Request, res: Response) {
    const { usuarioid } = req.headers;
    const { tramiteId } = req.body;
    try {
      const siguiente = await tramitesValidator.pasoSiguiente({
        tramiteId: Number(tramiteId),
        usuarioId: Number(usuarioid)
      });
      return res.status(200).json(siguiente);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async gotoPaso(req: Request, res: Response) {
    const { usuarioid } = req.headers;
    const { tramiteId, pasoId } = req.body;
    try {
      const siguiente = await tramitesValidator.gotoPaso({
        tramiteId: Number(tramiteId),
        paso: Number(pasoId),
        usuarioId: Number(usuarioid)
      });
      return res.status(200).json(siguiente);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async aprobarPorArea(req: Request, res: Response) {
    const { usuarioid } = req.headers;
    const { tramiteId } = req.body;
    try {
      const tramite = await tramitesValidator.aprobarPorArea({
        tramiteId: Number(tramiteId),
        usuarioId: Number(usuarioid)
      });
      return res.status(200).json(tramite);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async rechazarPorArea(req: Request, res: Response) {
    const { usuarioid } = req.headers;
    const { tramiteId } = req.body;
    try {
      const tramite = await tramitesValidator.rechazarPorArea({
        tramiteId: Number(tramiteId),
        usuarioId: Number(usuarioid)
      });
      return res.status(200).json(tramite);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async solicitarModificacionPorArea(req: Request, res: Response) {
    const { usuarioid } = req.headers;
    const { tramiteId } = req.body;
    try {
      const tramite = await tramitesValidator.solicitarModificacionPorArea({
        tramiteId: Number(tramiteId),
        usuarioId: Number(usuarioid)
      });
      return res.status(200).json(tramite);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async rechazarTramite(req: Request, res: Response) {
    const { usuarioid } = req.headers;
    const { tramiteId } = req.body;
    try {
      const tramite = await tramitesValidator.rechazarTramite({
        tramiteId: Number(tramiteId),
        usuarioId: Number(usuarioid)
      });
      return res.status(200).json(tramite);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async cancelarTramite(req: Request, res: Response) {
    const { usuarioid } = req.headers;
    const { tramiteId } = req.body;
    try {
      const tramite = await tramitesValidator.cancelarTramite({
        tramiteId: Number(tramiteId),
        usuarioId: Number(usuarioid)
      });
      return res.status(200).json(tramite);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async buscarFamilia(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const tramite = await tramitesValidator.buscarFamilia(Number(id));
      return res.status(200).json(tramite);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async createSinUsuario(req: Request, res: Response) {
    const { tipoId, empleadoId } = req.body;
    const { usuarioid } = req.headers;
    try {
      const tramite = await tramitesValidator.createSinUsuario({
        usuarioSolicitante: Number(usuarioid),
        tipoId,
        empleadoId
      });
      return res.status(200).json(tramite);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async getSinUsuario(req: Request, res: Response) {
    const { usuarioid } = req.headers;
    const pagina = req.query.pagina || 1;
    const limite = req.query.limite || 10;
    const orden = req.query.orden ? String(req.query.orden) : 'desc';
    const columna = req.query.columna ? String(req.query.columna) : 'createdAt';
    const busqueda = req.query.busqueda ? String(req.query.busqueda) : '';

    try {
      const tramites = await tramitesValidator.getSinUsuario({
        usuarioid: Number(usuarioid),
        pagina: Number(pagina),
        limite: Number(limite),
        orden,
        columna,
        busqueda
      });
      return res.status(200).json(tramites);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async crearTramiteConInputsExterno(req: Request, res: Response) {
    const { tipoId, inputs } = req.body;
    try {
      const tramite = await tramitesValidator.crearTramiteConInputsExterno({
        tipo: tipoId,
        arrInputs: inputs
      });

      return res.status(200).json(tramite);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async getTramiteExterno(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const tramite = await tramitesValidator.getTramiteExterno(id);

      return res.status(200).json(tramite);
    } catch (error) {
      return errorHandler(error, res);
    }
  }
}

export default new TramitesController();
