import { Turno } from '@prisma/client';
import dayjs from 'dayjs';
import { logger } from 'handlebars';
import { IEventoConTipoEvento } from '../interfaces/evento.interface';
import { IExpediente } from '../interfaces/expediente.interface';
import empleadoServices from '../services/empleado.services';
import notificacionServices from '../services/notificacion.services';

export const notify = async ({
  tipo,
  tramite,
  evento,
  turno
}: {
  tipo: string;
  tramite: {
    areas?: any;
    empleadoId?: number | null;
    carpeta: { usuarioId: number } | null;
    id?: number;
    transaccionId?: number;
  };
  evento?: IEventoConTipoEvento;
  turno?: Turno;
}) => {
  let usuarioId: number | undefined | null;
  let areaId: any | undefined | null;
  let [tipoUsuario, tipoNotificacion] = tipo.split('_');

  switch (tipoUsuario) {
    case 'user':
      usuarioId = tramite.carpeta?.usuarioId;
      areaId = 1;
      break;

    case 'admin':
      usuarioId = tramite.empleadoId;
      areaId = 1;
      break;

    case 'area':
      areaId = tramite.areas.filter((area: any) => !area.deleted);

      usuarioId = 1;
      break;

    default:
      return;
  }

  if (usuarioId && areaId) {
    switch (tipoNotificacion) {
      case 'sistemaFidelita':
        await notificacionServices.create({
          titulo: 'Trámite Finalizado',
          descripcion:
            'Ya cuentas con Usuario y Clave para el Sistema Fidelitas',
          usuarioId,
          info: { tipo: 'sistema_fidelita', tramiteId: tramite.id }
        });
        break;

      case 'ApprovedProcedure':
        await notificacionServices.create({
          titulo: 'El Honorable Consejo Directivo aprobó tu trámite',
          descripcion: 'Quedan pocos pasos para terminar tu trámite...',
          usuarioId,
          info: { tipo: 'tramite', tramiteId: tramite.id }
        });
        break;

      case 'EventInvitation':
        if (evento) {
          await notificacionServices.create({
            titulo: `Invitación al evento ${evento.tipoEvento.nombre}`,
            descripcion: `Estas invitado al evento ${
              evento.id
            }, con motivo de ${
              evento.tipoEvento.nombre
            } ha realizarse en fecha ${dayjs(evento.fecha).format(
              'DD/MM/YYYY HH:mm'
            )}`,
            usuarioId,
            info: {
              tipo: 'evento',
              eventoId: evento.id
            }
          });
        } else {
          return;
        }
        break;

      case 'TurnoUpdated':
        if (turno) {
          await notificacionServices.create({
            titulo:
              turno.estado === 'rejected'
                ? `Debes volver a sacar turno para el trámite que solicitaste`
                : `Se ha aprobado tu documentación`,
            descripcion:
              turno.estado === 'rejected'
                ? `Puedes dirigirte al trámite ${tramite.id} para volver a solicitar el turno`
                : `Se ha aprobado la documentación de tu trámite ${tramite.id}`,
            usuarioId,
            info: {
              tipo: 'tramite',
              tramiteId: tramite.id
            }
          });
        } else {
          return;
        }
        break;

      case 'TransactionAsigned':
        if (tramite.transaccionId) {
          await notificacionServices.create({
            titulo: 'Se te ha asignado una transacción',
            descripcion: `Se te ha asignado la transacción Nro. ${tramite.transaccionId}.`,
            usuarioId,
            info: {
              tipo: 'transaccion',
              transaccionId: tramite.transaccionId
            }
          });
        } else {
          return;
        }
        break;

      case 'AdminTransactionModify':
        if (tramite.transaccionId) {
          await notificacionServices.create({
            titulo: 'Se ha realizado una Modificación solicitada',
            descripcion: `Se te ha realizado una modificación en la transacción Nro. ${tramite.transaccionId}.`,
            usuarioId,
            info: {
              tipo: 'transaccion',
              transaccionId: tramite.transaccionId
            }
          });
        } else {
          return;
        }

        break;
      case 'UserTransactionModify':
        await notificacionServices.create({
          titulo: 'Tienes que realizar una modificación',
          descripcion: `Debes realizar una mofificación en la transacción Nro. ${tramite.transaccionId}.`,
          usuarioId,
          info: {
            tipo: 'transaccion',
            transaccionId: tramite.transaccionId
          }
        });

        break;

      case 'TransactionApproved':
        await notificacionServices.create({
          titulo: 'Se aprobó tu transacción',
          descripcion: `Se aprobó tu transacción del trámite ${tramite.transaccionId}.`,
          usuarioId,
          info: {
            tipo: 'transaccion',
            transaccionId: tramite.transaccionId
          }
        });

        break;

      case 'assingMatricula':
        await notificacionServices.create({
          titulo: 'Se te ha asignado una matrícula',
          descripcion: `Se aprobó tu trámite de matriculación`,
          usuarioId,
          info: {
            tipo: 'tramite',
            tramiteId: tramite.id
          }
        });
        break;

      case 'registroMatricula':
        await notificacionServices.create({
          titulo: 'Finalizar el tramite',
          descripcion: `Para finalizar el tramite debés asignar Libro, Tomo y Folio al matriculado`,
          usuarioId,
          info: {
            tipo: 'tramite',
            tramiteId: tramite.id
          }
        });

        break;

      case 'returnTramite':
        for (const area of areaId) {
          const empleados = await empleadoServices.findEmpleadosByArea(
            area.areaId
          );

          const jefes = await empleadoServices.findJefeDeArea(area.areaId);

          empleados.forEach(async (empleado: any) => {
            await notificacionServices.create({
              titulo: 'Se ha devuelto un trámite',
              descripcion: `Se ha devuelto el trámite ${tramite.id}`,
              usuarioId: empleado.usuarioId,
              info: {
                tipo: 'tramite',
                tramiteId: tramite.id
              }
            });
          });

          jefes.forEach(async (jefe: any) => {
            await notificacionServices.create({
              titulo: 'Se ha devuelto un trámite',
              descripcion: `Se ha devuelto el trámite ${tramite.id}`,
              usuarioId: jefe.usuarioId,
              info: {
                tipo: 'tramite',
                tramiteId: tramite.id
              }
            });
          });
        }

        break;

      default:
        break;
    }
  } else {
    return;
  }
};

// Notify expediente
export const notifyExpediente = async ({
  tipo,
  expediente,
  procesoLegalId
}: {
  tipo: string;
  expediente: IExpediente;
  procesoLegalId?: number;
}) => {
  let [tipoNotificacion, tipoUsuario] = tipo.split('_');
  let usuarioId: number | undefined | null;
  let areaId: any | undefined | null;

  switch (tipoUsuario) {
    case 'user':
      usuarioId = expediente.carpeta?.usuarioId;
      break;

    case 'area':
      areaId = expediente.areas.filter((area) => !area.deleted);
      usuarioId = 1;
      break;

    default:
      break;
  }

  if (usuarioId && areaId) {
    switch (tipoNotificacion) {
      case 'cambiarArea':
        for (const area of areaId) {
          const empleados = await empleadoServices.findEmpleadosByArea(
            area.areaId
          );

          const jefes = await empleadoServices.findJefeDeArea(area.areaId);

          empleados.forEach(async (empleado: any) => {
            await notificacionServices.create({
              titulo: 'Se te ha enviado un expediente',
              descripcion: `Se ha enviado el expediente Nro ${expediente.id} a tu área`,
              usuarioId: empleado.usuarioId,
              info: {
                tipo: 'tramite',
                expedienteId: expediente.id
              }
            });
          });

          jefes.forEach(async (jefe: any) => {
            await notificacionServices.create({
              titulo: 'Se te ha enviado un expediente',
              descripcion: `Se ha enviado el expediente Nro ${expediente.id} a tu área`,
              usuarioId: jefe.usuarioId,
              info: {
                tipo: 'expediente',
                expedienteId: expediente.id
              }
            });
          });
        }
        break;

      case 'ingresoProceso':
        for (const area of areaId) {
          const empleados = await empleadoServices.findEmpleadosByArea(
            area.areaId
          );

          const jefes = await empleadoServices.findJefeDeArea(area.areaId);

          empleados.forEach(async (empleado: any) => {
            await notificacionServices.create({
              titulo: 'Se ha ingresado un proceso legal',
              descripcion: `Se ha ingresado el proceso legal Nro ${procesoLegalId} del expediente Nro ${expediente.id} a tu área`,
              usuarioId: empleado.usuarioId,
              info: {
                tipo: 'expediente',
                expedienteId: expediente.id,
                procesoLegalId: procesoLegalId
              }
            });
          });

          jefes.forEach(async (jefe: any) => {
            await notificacionServices.create({
              titulo: 'Se ha ingresado un proceso legal',
              descripcion: `Se ha ingresado el proceso legal Nro ${procesoLegalId} del expediente Nro ${expediente.id} a tu área`,
              usuarioId: jefe.usuarioId,
              info: {
                tipo: 'expediente',
                expedienteId: expediente.id,
                procesoLegalId: procesoLegalId
              }
            });
          });
        }

      default:
        break;
    }
  }
};
