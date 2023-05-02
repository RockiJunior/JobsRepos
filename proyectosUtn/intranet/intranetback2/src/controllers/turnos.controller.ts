import dayjs from 'dayjs';
import { Request, Response } from 'express';
import errorHandler from '../utils/errorHandler';
import turnosValidator from '../validators/turnos.validator';

class TurnosController {
  async turnosDisponibles(req: Request, res: Response) {
    const { anio, mes, areaId } = req.body;

    try {
      const turnosDisponibles = await turnosValidator.turnosDisponibles({
        anio: Number(anio),
        mes: Number(mes) ? Number(mes) : 0,
        areaId: Number(areaId)
      });
      return res.status(200).json(turnosDisponibles);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async reservarTurno(req: Request, res: Response) {
    const { areaId, tramiteId, procesoLegalesId, inicio, fin } = req.body;
    const { usuarioid } = req.headers;

    try {
      const crearTurno = await turnosValidator.reservarTurno({
        areaId: areaId,
        usuarioId: Number(usuarioid),
        tramiteId: tramiteId,
        procesoLegalesId: procesoLegalesId,
        inicio: dayjs(inicio).toDate(),
        fin: dayjs(fin).toDate()
      });

      return res.status(200).json(crearTurno);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async turnosReservados(req: Request, res: Response) {
    const { areaId } = req.body;
    const { usuarioid } = req.headers;

    try {
      const turnosResrvados = await turnosValidator.turnosReservados({
        usuarioId: Number(usuarioid),
        areaId: Number(areaId)
      });
      return res.status(200).json(turnosResrvados);
    } catch (error) {
      errorHandler(error, res);
    }
  }
  async actualizarEstado(req: Request, res: Response) {
    const { usuarioid } = req.headers;
    const { estado, turnoId } = req.body;

    try {
      const actualizarEstado = await turnosValidator.actualizarEstado(
        estado,
        Number(turnoId),
        Number(usuarioid)
      );
      return res.status(200).json(actualizarEstado);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async all(req: Request, res: Response) {
    const { usuarioid } = req.headers;

    try {
      const all = await turnosValidator.all({ usuarioId: Number(usuarioid) });
      return res.status(200).json(all);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async turnoFiscalizacion(req: Request, res: Response) {
    const {
      motivo,
      fecha,
      nombreTitular,
      apellidoTitular,
      dniTitular,
      mailTitular,
      telefono,
      empresa,
      direccion,
      numero,
      piso,
      depto,
      localidad,
      concurre,
      nombreConcurre,
      apellidoConcurre,
      matricula,
      numeroMatricula,
      acta,
      visita,
      inspeccion,
      nombreInspector,
      formaPago,
      usuarioId
    } = req.body;

    try {
      const turnoFiscalizacion = await turnosValidator.turnoFiscalizacion({
        motivo,
        fecha,
        nombreTitular,
        apellidoTitular,
        dniTitular,
        mailTitular,
        telefono,
        empresa,
        direccion,
        numero,
        piso,
        depto,
        localidad,
        concurre,
        nombreConcurre,
        apellidoConcurre,
        matricula,
        numeroMatricula,
        acta,
        visita,
        inspeccion,
        nombreInspector,
        formaPago,
        usuarioId
      });
      return res.status(200).json(turnoFiscalizacion);
    } catch (error) {
      errorHandler(error, res);
    }
  }
}

export default new TurnosController();
