import { Request, Response } from 'express';
import errorHandler from '../utils/errorHandler';
import eventoValidators from '../validators/evento.validators';

class EventoController {
  async create(req: Request, res: Response) {
    const { usuarioid } = req.headers;
    const { fecha, tipoEventoId } = req.body;

    try {
      const empleado = await eventoValidators.create({
        fecha,
        superAdminId: Number(usuarioid),
        tipoEventoId: Number(tipoEventoId)
      });
      return res.status(200).json(empleado);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async getListaEsperaEventos(req: Request, res: Response) {
    const { usuarioid } = req.headers;
    try {
      const usuarios = await eventoValidators.getListaEsperaEventos(
        Number(usuarioid)
      );
      return res.status(200).json(usuarios);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async invitarUsuarios(req: Request, res: Response) {
    const { usuarioid } = req.headers;
    const { eventoId, usuarioEventos, info } = req.body;

    try {
      const invitaciones = await eventoValidators.invitarUsuarios({
        eventoId: Number(eventoId),
        usuarioEventos,
        empleadoId: Number(usuarioid)
      });
      return res.status(200).json(invitaciones);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async aceptarRechazar(req: Request, res: Response) {
    const { usuarioid } = req.headers;
    const { usuarioEventoId, estado, info } = req.body;

    try {
      const empleado = await eventoValidators.aceptarRechazar({
        usuarioEventoId: Number(usuarioEventoId),
        estado,
        info,
        usuarioId: Number(usuarioid)
      });
      return res.status(200).json(empleado);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async aceptarRechazarEmpleado(req: Request, res: Response) {
    const { usuarioid } = req.headers;
    const { usuarioId, usuarioEventoId, estado } = req.body;

    try {
      const empleado = await eventoValidators.aceptarRechazar({
        usuarioEventoId: Number(usuarioEventoId),
        estado,
        empleadoId: Number(usuarioid),
        usuarioId: Number(usuarioId)
      });
      return res.status(200).json(empleado);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const { usuarioid } = req.headers;

    try {
      const evento = await eventoValidators.getById({
        usuarioId: Number(usuarioid),
        id: Number(id)
      });
      return res.status(200).json(evento);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async getByIdfindAllEventByUser(req: Request, res: Response) {
    const { usuarioid } = req.headers;

    try {
      const eventoUsuario = await eventoValidators.findAllEventByUser(
        Number(usuarioid)
      );
      return res.status(200).json(eventoUsuario);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async findAllEventPending(req: Request, res: Response) {
    try {
      const eventosPendiente = await eventoValidators.findAllEventPending();
      return res.status(200).json(eventosPendiente);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async getEventTypes(req: Request, res: Response) {
    try {
      const tiposEvento = await eventoValidators.getEventTypes();
      return res.status(200).json(tiposEvento);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { data } = req.body;
    const { usuarioid } = req.headers;

    try {
      const eventoUpdate = await eventoValidators.update(
        Number(usuarioid),
        Number(id),
        data
      );
      return res.status(200).json(eventoUpdate);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const { usuarioid } = req.headers;

    try {
      const eventoDelete = await eventoValidators.delete({
        usuarioId: Number(usuarioid),
        id: Number(id)
      });
      return res.status(200).json(eventoDelete);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  async finalizar(req: Request, res: Response) {
    const { id } = req.params;
    const { usuarioid } = req.headers;

    try {
      const eventoFinalizar = await eventoValidators.finalizar({
        usuarioId: Number(usuarioid),
        eventoId: Number(id)
      });
      return res.status(200).json(eventoFinalizar);
    } catch (error) {
      return errorHandler(error, res);
    }
  }
}

export default new EventoController();
