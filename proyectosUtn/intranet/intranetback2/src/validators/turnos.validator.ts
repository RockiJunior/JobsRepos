import { EstadoTurno } from '@prisma/client';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import prisma from '../config/db';
import permisos from '../data/permisos';
import { Disponibilidad } from '../interfaces/disponibilidad.interface';
import { IPaso } from '../interfaces/pasos.interface';
import disponibilidadServices from '../services/disponibilidad.services';
import tramiteServices from '../services/tramite.services';
import turnoSevices from '../services/turno.sevices';
import { detallesTurno, notificacionMail } from '../utils/enviarEmail';
import Exception from '../utils/Exception';
import { isFeriado } from '../utils/getDiasLaborales';
import { notify } from '../utils/notify';
import { registroHistorial } from '../utils/registrarHistorial';
import tramiteActionStep from '../utils/tramite/tramiteActionStep';
import checkGotoNextStep from '../utils/tramite/tramiteCheckGotoNextStep';
import { verificarPermiso } from '../utils/verificarPermisos';
import tramiteValidators from './tramite.validators';
import procesoLegalesServices from '../services/procesoLegales.services';
import expedienteServices from '../services/expediente.services';
dayjs.extend(isBetween);

class TurnosValidator {
  async turnosDisponibles({
    anio,
    mes,
    areaId
  }: {
    anio: number;
    mes: number;
    areaId: number;
  }) {
    if (!anio) {
      throw new Exception('Año es requerido');
    }

    if (mes !== 0 && !mes) {
      throw new Exception('Mes es requerido');
    }

    if (!areaId) {
      throw new Exception('Area id es requerido');
    }

    const fecha = dayjs(`${anio}-${mes + 1}`).toDate();
    let inicio = dayjs(fecha)
      .startOf('month')
      .set('second', 0)
      .set('millisecond', 0)
      .toDate();
    const fin = dayjs(fecha)
      .endOf('month')
      .set('second', 0)
      .set('millisecond', 0)
      .toDate();

    if (mes === dayjs().get('month')) {
      inicio = dayjs().set('second', 0).set('millisecond', 0).toDate();
    }

    const disponibilidades =
      await disponibilidadServices.getDisponibilidadBetweenDates({
        areaId,
        inicio,
        fin
      });

    if (!disponibilidades) {
      throw new Exception('No hay disponibilidad en esta área');
    }

    const turnosReservados = await turnoSevices.findTurnos({
      inicio,
      fin: dayjs(fin).endOf('day').toDate()
    });

    const disponibles: { inicio: Date; fin: Date }[] = [];

    let fechaActual = dayjs(inicio).set('second', 0).set('millisecond', 0);
    let dias: ['dom', 'lun', 'mar', 'mie', 'jue', 'vie', 'sab'] = [
      'dom',
      'lun',
      'mar',
      'mie',
      'jue',
      'vie',
      'sab'
    ];

    while (fechaActual.isBefore(fin)) {
      const disponibilidad = disponibilidades.find((dis) =>
        fechaActual.isBetween(dis.inicio, dis.fin, 'day', '[]')
      ) as any as Disponibilidad;

      if (disponibilidad) {
        const dia = dias[fechaActual.day()];
        if (
          disponibilidad[dia].abierto &&
          !(await isFeriado(fechaActual.toDate()))
        ) {
          const intervalos = disponibilidad[dia].intervalos;
          intervalos.forEach((int) => {
            const [horaInicio, minutoInicio] = int.inicio.split(':');
            const [horaFin, minutoFin] = int.fin.split(':');
            let inicioInt = dayjs(fechaActual)
              .set('hour', Number(horaInicio))
              .set('minutes', Number(minutoInicio));
            const finInt = dayjs(fechaActual)
              .set('hour', Number(horaFin))
              .set('minutes', Number(minutoFin));

            if (fechaActual.isSame(new Date(), 'date')) {
              if (dayjs().isBetween(inicioInt, finInt, 'hour', '[)')) {
                let minutoActual = dayjs().minute();
                if (minutoActual !== 0 && minutoActual !== 30) {
                  inicioInt = dayjs()
                    .add(30, 'minutes')
                    .subtract(
                      minutoActual > 30 ? minutoActual - 30 : minutoActual,
                      'minutes'
                    )
                    .set('second', 0)
                    .set('millisecond', 0);
                }

                while (inicioInt.format('HH:mm') !== int.fin) {
                  const finInt = inicioInt.add(30, 'minutes');
                  const turno = {
                    inicio: inicioInt.toDate(),
                    fin: finInt.toDate()
                  };
                  if (
                    !turnosReservados.find((t) =>
                      dayjs(t.inicio).isSame(turno.inicio)
                    )
                  ) {
                    disponibles.push(turno);
                  }
                  inicioInt = finInt;
                }
              }
            } else {
              while (inicioInt.format('HH:mm') !== int.fin) {
                const finInt = inicioInt.add(30, 'minutes');
                const turno = {
                  inicio: inicioInt.toDate(),
                  fin: finInt.toDate()
                };

                if (
                  !turnosReservados.find((t) =>
                    dayjs(t.inicio).isSame(turno.inicio)
                  )
                ) {
                  disponibles.push(turno);
                }
                inicioInt = finInt;
              }
            }
          });
        }
      }

      fechaActual = fechaActual.add(1, 'day');
    }

    return disponibles;
  }

  async reservarTurno({
    areaId,
    usuarioId,
    tramiteId,
    procesoLegalesId,
    inicio,
    fin
  }: {
    areaId: number;
    usuarioId: number;
    tramiteId?: number;
    procesoLegalesId?: number;
    inicio: Date;
    fin: Date;
  }) {
    if (!areaId) {
      throw new Exception('Área id es requerido');
    }

    if (!usuarioId) {
      throw new Exception('Usuario id es requerido');
    }

    if (!inicio) {
      throw new Exception('Fecha de inicio es requerida');
    }

    if (!fin) {
      throw new Exception('Fecha de fin es requerida');
    }

    const area = await prisma.area.findUnique({
      where: {
        id: areaId
      }
    });

    if (!area) {
      throw new Exception('Área no encontrada');
    }

    let turno;

    if (tramiteId) {
      await turnoSevices.reservarTurno({
        usuarioId,
        areaId: area.id,
        tramiteId,
        inicio,
        fin
      });

      await detallesTurno({ usuarioId, tramiteId, inicio });
      await registroHistorial({
        titulo: 'Reservó un turno',
        descripcion: `Se reservó un turno para presentar la documentación física en la fecha <strong>${dayjs(
          inicio
        ).format('DD/MM/YYYY HH:mm')}</strong>`,
        usuarioId,
        tramiteId
      });
    } else if (procesoLegalesId) {
      await detallesTurno({ usuarioId, procesoLegalesId, inicio });

      const procesoLegal = await procesoLegalesServices.findById(
        procesoLegalesId
      );
      if (!procesoLegal) {
        throw new Error('Proceso Legal no encontrado');
      }
      const expediente = await expedienteServices.findById(
        procesoLegal.expedienteId
      );
      if (!expediente) {
        throw new Error('Expediente no encontrado');
      }

      const info = expediente.denuncia?.info as any;

      if (info.denuncianteMatriculado) {
        await turnoSevices.reservarTurno({
          usuarioId: info.denuncianteMatriculado as number,
          areaId: area.id,
          procesoLegalesId,
          inicio,
          fin
        });
      } else {
        await turnoSevices.reservarTurno({
          areaId: area.id,
          procesoLegalesId,
          inicio,
          fin,
          info: {
            nombreTitular: info.contacto.nombreDenunciante as string,
            apellidoTitular: info.contacto.apellidoDenunciante as string
          }
        });
      }

      /* await registroHistorial({
       titulo: 'Reservó un turno',
       descripcion: `Se reservó un turno para presentar la documentación física en la fecha <strong>${dayjs(
         inicio
       ).format('DD/MM/YYYY HH:mm')}</strong>`,
       usuarioId,
       procesoLegalesId
     }); */
    }

    return turno;
  }

  async turnosReservados({
    usuarioId,
    areaId
  }: {
    usuarioId: number;
    areaId: number;
  }) {
    if (!usuarioId) {
      throw new Exception('Usuario id es requerido');
    }

    await verificarPermiso(
      [permisos.turnos.ver_turnos_reservados_area],
      usuarioId
    );

    if (!areaId) {
      throw new Exception('Área id es requerido');
    }

    const turnos = await turnoSevices.findTurnosByArea({ areaId });

    return turnos;
  }

  async all({ usuarioId }: { usuarioId: number }) {
    if (!usuarioId) {
      throw new Exception('Usuario id es requerido');
    }

    await verificarPermiso([permisos.turnos.ver_turnos_todos], usuarioId);

    const turnos = await turnoSevices.all();

    const turnosGroup = turnos.reduce((acc: { [prop: number]: any }, turno) => {
      const areaId = turno.areaId;
      if (!acc[areaId]) {
        acc[areaId] = [];
      }
      acc[areaId].push(turno);
      return acc;
    }, {});

    return turnosGroup;
  }

  async actualizarEstado(estado: EstadoTurno, id: number, usuarioId: number) {
    if (!estado) {
      throw new Exception('El estado es requerido');
    }
    if (!id) {
      throw new Exception('El id del turno es requerido');
    }

    if (!usuarioId) {
      throw new Exception('El id del usuario es requerido');
    }

    const turno = await turnoSevices.findTurnoById({ id });

    if (!turno) {
      throw new Exception('Turno no encontrado');
    }

    const updatedTurno = await turnoSevices.actualizarEstado({
      estado,
      turnoId: id
    });

    if (updatedTurno.tramiteId) {
      const tramite = await tramiteValidators.getByIdForAction(
        updatedTurno.tramiteId
      );

      if (!tramite) {
        throw new Exception('Trámite no encontrado');
      }

      if (updatedTurno.estado === EstadoTurno.approved) {
        if (tramite && checkGotoNextStep(tramite, updatedTurno.id)) {
          await tramiteServices.update(tramite.id, {
            pasoActual: tramite.pasoActual + 1
          });

          const newTramite = await tramiteValidators.getByIdForAction(
            tramite.id
          );

          await tramiteActionStep(newTramite);

          const pasos = newTramite.tipo.pasos as any as IPaso[];

          await registroHistorial({
            titulo: `Se ha aprobado el turno`,
            descripcion: `Se ha aprobado <strong>${
              pasos[tramite.pasoActual].intraTitle
            }</strong>`,
            usuarioId,
            tramiteId: tramite.id
          });
        }
      } else if (updatedTurno.estado === EstadoTurno.rejected) {
        await registroHistorial({
          titulo: `Se ha rechazado el turno`,
          descripcion: `Se ha rechazado el turno`,
          usuarioId,
          tramiteId: tramite.id
        });

        await notificacionMail({
          type: 'reprogramarTurno',
          tramite,
          condition: 'mail'
        });
      }

      await notify({ tipo: `user_TurnoUpdated`, tramite, turno });
    }

    return turno;
  }

  async turnoFiscalizacion({
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
  }: {
    motivo: string;
    fecha: Date;
    nombreTitular: string;
    apellidoTitular: string;
    dniTitular: string;
    mailTitular: string;
    telefono: string;
    empresa: string;
    direccion: string;
    numero: string;
    piso: string;
    depto: string;
    localidad: string;
    concurre: string;
    nombreConcurre: string;
    apellidoConcurre: string;
    matricula: string;
    numeroMatricula: string;
    acta: string;
    visita: string;
    inspeccion: string;
    nombreInspector: string;
    formaPago: string;
    usuarioId?: number;
  }) {
    const inicio = dayjs(fecha);
    const fin = inicio.add(30, 'minute').toDate();
    const turno = await turnoSevices.turnoFiscalizacion({
      motivo,
      inicio: inicio.toDate(),
      fin,
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

    return turno;
  }
}

export default new TurnosValidator();
