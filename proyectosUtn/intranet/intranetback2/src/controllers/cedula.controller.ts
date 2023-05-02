import { Request, Response } from 'express';
import errorHandler from '../utils/errorHandler';
import cedulaValidators, {
  CedulaNotificacionValidator
} from '../validators/cedula.validators';

class CedulaController {
  cedulaValidator: CedulaNotificacionValidator;

  constructor() {
    this.cedulaValidator = cedulaValidators;
    this.getById = this.getById.bind(this);
    this.create = this.create.bind(this);
    this.getSinAsignar = this.getSinAsignar.bind(this);
    this.asignarEmpleado = this.asignarEmpleado.bind(this);
    this.actualizarFechaRecepcion = this.actualizarFechaRecepcion.bind(this);
    this.pasoSiguiente = this.pasoSiguiente.bind(this);
    this.getByEmpleadoId = this.getByEmpleadoId.bind(this);
    this.desasignarEmpleado = this.desasignarEmpleado.bind(this);
    this.byArea = this.byArea.bind(this);
  }

  async getAll(req: Request, res: Response) {
    const { usuarioid } = req.headers;
    const pagina = req.query.pagina || 1;
    const limite = req.query.limite || 10;
    const orden = req.query.orden ? String(req.query.orden) : 'asc';
    const columna = req.query.columna ? String(req.query.columna) : 'id';
    const busqueda = req.query.busqueda ? String(req.query.busqueda) : '';

    try {
      const cedulas = await cedulaValidators.getAll({
        usuarioId: Number(usuarioid),
        pagina: Number(pagina),
        limite: Number(limite),
        orden,
        columna,
        busqueda
      });

      return res.status(200).json(cedulas);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const { usuarioid } = req.headers;
    try {
      const cedula = await this.cedulaValidator.getById(
        Number(usuarioid),
        Number(id)
      );

      return res.status(200).json(cedula);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async byArea(req: Request, res: Response) {
    const { usuarioid } = req.headers;
    const pagina = req.query.pagina || 1;
    const limite = req.query.limite || 10;
    const orden = req.query.orden ? String(req.query.orden) : 'asc';
    const columna = req.query.columna ? String(req.query.columna) : 'id';
    const busqueda = req.query.busqueda ? String(req.query.busqueda) : '';

    try {
      const cedulas = await this.cedulaValidator.byArea({
        usuarioId: Number(usuarioid),
        pagina: Number(pagina),
        limite: Number(limite),
        orden,
        columna,
        busqueda
      });
      return res.status(200).json(cedulas);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async create(req: Request, res: Response) {
    const {
      titulo,
      motivo,
      usuarioId,
      tramiteId,
      fiscalizacionId,
      procesoLegalesId,
      expedienteId,
      pasoCreacion,
      tipo
    } = req.body;

    try {
      const cedula = await this.cedulaValidator.create({
        titulo,
        motivo,
        usuarioId,
        tipo,
        empleadoId: undefined,
        fiscalizacionId,
        procesoLegalesId,
        tramiteId,
        expedienteId,
        fechaRecepcion: undefined,
        pasoCreacion
      });

      return res.status(200).json(cedula);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async getSinAsignar(req: Request, res: Response) {
    const { usuarioid } = req.headers;

    const pagina = req.query.pagina || 1;
    const limite = req.query.limite || 10;
    const orden = req.query.orden ? String(req.query.orden) : 'asc';
    const columna = req.query.columna ? String(req.query.columna) : 'id';
    const busqueda = req.query.busqueda ? String(req.query.busqueda) : '';

    try {
      const cedulas = await this.cedulaValidator.getSinAsignar({
        usuarioId: Number(usuarioid),
        pagina: Number(pagina),
        limite: Number(limite),
        orden: String(orden),
        columna: String(columna),
        busqueda: String(busqueda)
      });

      return res.status(200).json(cedulas);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async asignarEmpleado(req: Request, res: Response) {
    const { cedulaId } = req.params;
    const { empleadoId } = req.body;
    const { usuarioid } = req.headers;

    try {
      const cedula = await this.cedulaValidator.asignarEmpleado({
        cedulaId: Number(cedulaId),
        empleadoId,
        usuarioId: Number(usuarioid)
      });

      return res.status(200).json(cedula);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async desasignarEmpleado(req: Request, res: Response) {
    const { cedulaId } = req.params;
    const { usuarioid } = req.headers;

    try {
      const cedula = await this.cedulaValidator.desasignarEmpleado(
        Number(cedulaId),
        Number(usuarioid)
      );

      return res.status(200).json(cedula);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async actualizarFechaRecepcion(req: Request, res: Response) {
    const { cedulaId } = req.params;
    const { usuarioid } = req.headers;

    try {
      const cedula = await this.cedulaValidator.update(
        Number(usuarioid),
        Number(cedulaId),
        {
          fechaRecepcion: new Date()
        }
      );

      return res.status(200).json(cedula);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async pasoSiguiente(req: Request, res: Response) {
    const { cedulaId } = req.params;

    try {
      const cedula = await this.cedulaValidator.pasoSiguiente(Number(cedulaId));

      return res.status(200).json(cedula);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async getByEmpleadoId(req: Request, res: Response) {
    const { usuarioid } = req.headers;
    const { id } = req.params;
    const pagina = req.query.pagina || 1;
    const limite = req.query.limite || 10;
    const orden = req.query.orden ? String(req.query.orden) : 'asc';
    const columna = req.query.columna ? String(req.query.columna) : 'id';
    const busqueda = req.query.busqueda ? String(req.query.busqueda) : '';

    try {
      const cedulas = await this.cedulaValidator.getByEmpleadoId({
        empleadoId: Number(id),
        usuarioId: Number(usuarioid),
        pagina: Number(pagina),
        limite: Number(limite),
        orden: String(orden),
        columna: String(columna),
        busqueda: String(busqueda)
      });

      return res.status(200).json(cedulas);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async buscarFamilia(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const tramite = await cedulaValidators.buscarFamilia(Number(id));
      return res.status(200).json(tramite);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async documento(req: Request, res: Response) {
    const { cedulaId, documentoId, userId: cedulaUserId } = req.body;
    const { usuarioid } = req.headers;
    const filename = req.file?.filename;

    try {
      if (!filename) throw new Error('No se ha recibido el archivo');

      const recibirDocumento = await cedulaValidators.documento({
        cedulaId: Number(cedulaId),
        usuarioId: Number(usuarioid),
        filename,
        cedulaUserId,
        documentoId
      });

      return res.status(200).json(recibirDocumento);
    } catch (error) {
      errorHandler(error, res);
    }
  }
}

export default new CedulaController();
