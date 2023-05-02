import { EstadoUsuarioEvento, Evento } from '@prisma/client';
import dayjs from 'dayjs';
import prisma from '../config/db';
import permisos from '../data/permisos';
import eventoServices from '../services/evento.services';
import plazoServices from '../services/plazo.services';
import tramiteServices from '../services/tramite.services';
import usuarioEventoServices from '../services/usuarioEvento.services';
import { ConfirmacionEvento } from '../utils/enviarEmail';
import Exception from '../utils/Exception';
import { notify } from '../utils/notify';
import { registroHistorial } from '../utils/registrarHistorial';
import tramiteActionStep from '../utils/tramite/tramiteActionStep';
import checkGotoNextStep from '../utils/tramite/tramiteCheckGotoNextStep';
import checkGotoPrevStep from '../utils/tramite/tramiteCheckGotoPrevStep';
import { verificarPermiso } from '../utils/verificarPermisos';
import tramiteValidators from './tramite.validators';
import tramiteGoTo from '../utils/tramite/tramiteGoTo';

class EventoValidator {
  async create({
    fecha,
    superAdminId,
    tipoEventoId
  }: {
    fecha: Date;
    superAdminId: number;
    tipoEventoId: number;
  }) {
    await verificarPermiso([permisos.eventos.crear_eventos], superAdminId);

    if (!fecha) {
      throw new Exception('La fecha es requerida');
    }

    if (!superAdminId) {
      throw new Exception('El id del Admin es requerido');
    }

    if (!tipoEventoId) {
      throw new Exception('El id del tipo de evento es requerido');
    }
    const tipoEvento = await prisma.tipoEvento.findUnique({
      where: {
        id: tipoEventoId
      }
    });

    if (!tipoEvento) {
      throw new Exception('El tipo de evento no existe');
    }

    const evento = await eventoServices.create({
      fecha: new Date(fecha),
      superAdminId,
      tipoEventoId
    });

    return evento;
  }

  async getListaEsperaEventos(usuarioId: number) {
    await verificarPermiso([permisos.eventos.ver_lista_espera], usuarioId);

    const eventos = await usuarioEventoServices.getListaEsperaEventos();

    const newEventos: {
      tipoEventoId: number;
      nombreTipoEvento: string;
      cantidadUsuarios: number;
      usuarios: {
        usuarioEventoId: number;
        nombre: string;
        apellido: string;
        dni: string;
        email: string;
        usuarioId: number;
      }[];
    }[] = [];

    eventos.forEach((usuarioEvento) => {
      const user = {
        usuarioEventoId: usuarioEvento.id,
        nombre: usuarioEvento.usuario.nombre,
        apellido: usuarioEvento.usuario.apellido,
        dni: usuarioEvento.usuario.dni,
        email: usuarioEvento.usuario.email,
        usuarioId: usuarioEvento.usuarioId
      };

      const tipoEvento = newEventos.find(
        (tipoEvento) => tipoEvento.tipoEventoId === usuarioEvento.tipoEventoId
      );

      if (tipoEvento) {
        tipoEvento.usuarios.push(user);
        tipoEvento.cantidadUsuarios = tipoEvento.usuarios.length;
      } else {
        newEventos.push({
          tipoEventoId: usuarioEvento.tipoEventoId,
          nombreTipoEvento: usuarioEvento.tipoEvento.nombre,
          cantidadUsuarios: 1,
          usuarios: [user]
        });
      }
    });

    return newEventos;
  }

  async invitarUsuarios({
    eventoId,
    usuarioEventos,
    empleadoId
  }: {
    eventoId: number;
    usuarioEventos: any[];
    empleadoId: number;
  }) {
    if (!eventoId) {
      throw new Exception('El id del evento es requerido');
    }

    if (!usuarioEventos || !usuarioEventos.length) {
      throw new Exception('Los usuarios son requeridos');
    }

    if (!empleadoId) {
      throw new Exception('El id del empleado es requerido');
    }

    const evento = await eventoServices.findById(eventoId);

    if (!evento) {
      throw new Exception('El evento no existe');
    }

    const tipoEvento = await prisma.tipoEvento.findUnique({
      where: {
        id: evento.tipoEventoId
      },
      include: {
        tipoTramite: true
      }
    });

    if (!tipoEvento) {
      throw new Exception('El tipo de evento no existe');
    }

    for (const usuarioEvento of usuarioEventos) {
      await usuarioEventoServices.update(usuarioEvento.usuarioEventoId, {
        eventoId,
        estado: 'invitado'
      });

      const usuarioEventoUpdated = await usuarioEventoServices.findById({
        id: usuarioEvento.usuarioEventoId,
        usuarioId: usuarioEvento.usuarioId
      });

      if (
        usuarioEventoUpdated &&
        usuarioEventoUpdated.evento?.tipoEvento.tipoTramite?.tramite.length &&
        usuarioEventoUpdated.eventoId
      ) {
        const tramiteId =
          usuarioEventoUpdated.evento.tipoEvento.tipoTramite.tramite[0].id;

        const evento = await eventoServices.findById(
          usuarioEventoUpdated.eventoId
        );

        await registroHistorial({
          titulo: 'Invitación a Evento',
          descripcion: `El aspirante ha sido invitado a asistir al evento de la fecha <strong>${dayjs(
            evento?.fecha
          ).format('DD/MM/YYYY HH:mm')}</strong>`,
          usuarioId: empleadoId,
          tramiteId
        });

        if (evento) {
          await ConfirmacionEvento({
            tramiteId,
            tipoEvento: tipoEvento.nombre,
            tipoTramite: tipoEvento.tipoTramite?.titulo || '',
            fecha: evento.fecha
          });
        }
      }

      await notify({
        tipo: 'user_EventInvitation',
        tramite: { carpeta: { usuarioId: usuarioEvento.usuarioId } },
        evento
      });
    }

    return 'success';
  }

  async aceptarRechazar({
    usuarioEventoId,
    estado,
    usuarioId,
    empleadoId,
    info
  }: {
    usuarioEventoId: number;
    estado: EstadoUsuarioEvento;
    usuarioId: number;
    empleadoId?: number;
    info?: { [key: string]: any };
  }) {
    if (!usuarioEventoId) {
      throw new Exception('El id del usuario evento es requerido');
    }

    if (!estado) {
      throw new Exception('El estado es requerido');
    }

    const usuarioEvento = await usuarioEventoServices.findById({
      id: usuarioEventoId,
      usuarioId
    });

    if (!usuarioEvento) {
      throw new Exception('El evento no existe');
    }

    if (
      usuarioEvento.estado === 'pendiente' ||
      usuarioEvento.estado === 'postergado' ||
      usuarioEvento.estado === 'aprobado'
    ) {
      throw new Exception('No se permite cambiar el estado de este evento');
    }

    if (!usuarioEvento.evento || !usuarioEvento.eventoId) {
      throw new Exception('El evento no existe');
    }

    if (usuarioEvento.evento.tipoEvento.tipoTramite?.tramite.length) {
      const tramiteId =
        usuarioEvento.evento.tipoEvento.tipoTramite.tramite[0].id;
      const tramite = await tramiteValidators.getByIdForAction(tramiteId);

      const evento = await eventoServices.findById(usuarioEvento.eventoId);

      switch (estado) {
        case 'postergado':
          if (empleadoId) {
            await registroHistorial({
              titulo: 'El aspirante no asistió al evento',
              descripcion: `El aspirante no pudo asistir al evento en la fecha <strong>${dayjs(
                evento?.fecha
              ).format('DD/MM/YYYY HH:mm')}</strong>`,
              usuarioId: empleadoId,
              tramiteId: tramite.id
            });
          } else {
            await registroHistorial({
              titulo: 'Ha postergado el evento',
              descripcion: `Postergó su presencia al evento a realizarse en la fecha <strong>${dayjs(
                evento?.fecha
              ).format('DD/MM/YYYY HH:mm')}</strong>`,
              usuarioId,
              tramiteId: tramite.id
            });
          }

          break;

        case 'confirmado':
          await registroHistorial({
            titulo: 'Confirmó Evento',
            descripcion: `El aspirante confirmó su asistencia al evento en la fecha <strong>${dayjs(
              evento?.fecha
            ).format('DD/MM/YYYY HH:mm')}</strong>`,
            usuarioId,
            tramiteId
          });
          break;

        case 'aprobado':
          if (empleadoId) {
            await registroHistorial({
              titulo: 'Asistencia al Evento',
              descripcion: `El aspirante asistió al evento en la fecha <strong>${dayjs(
                evento?.fecha
              ).format('DD/MM/YYYY HH:mm')}</strong>`,
              usuarioId: empleadoId,
              tramiteId
            });
          }
          break;
      }

      if (tramite) {
        if (checkGotoPrevStep(tramite, { ...usuarioEvento, estado })) {
          await tramiteServices.update(tramite.id, {
            pasoActual: tramite.pasoActual - 1
          });

          const plazo = tramite.plazos.find((p) => !p.fechaFinalizacion);

          if (plazo) {
            await plazoServices.finish(plazo.id);
          }
        } else if (
          checkGotoNextStep(tramite, undefined, { ...usuarioEvento, estado })
        ) {
          await tramiteServices.update(tramite.id, {
            pasoActual: tramite.pasoActual + 1
          });

          const newTramite = await tramiteValidators.getByIdForAction(
            tramite.id
          );
          await tramiteActionStep(newTramite);

          const plazo = tramite.plazos.find((p) => !p.fechaFinalizacion);

          if (plazo) {
            await plazoServices.finish(plazo.id);
          }
        } else {
          await tramiteGoTo(tramite, { ...usuarioEvento, estado });
        }
      }
    }

    const eventoUpdated = await usuarioEventoServices.update(usuarioEventoId, {
      estado,
      info
    });

    return eventoUpdated;
  }

  async update(usuarioId: number, id: number, data: Partial<Evento>) {
    await verificarPermiso([permisos.eventos.modificar_eventos], usuarioId);

    if (!id) {
      throw new Exception('El id del evento es requerido');
    }

    if (!data) {
      throw new Exception('Los datos son requeridos');
    }

    const evento = await eventoServices.findByIdConUsuarios(id);

    if (evento?.Usuario_Evento.length) {
      throw new Exception(
        'No se puede editar un evento que ya tiene usuarios asociados'
      );
    }

    const eventoupdate = await eventoServices.update(id, data);

    return eventoupdate;
  }

  async delete({ usuarioId, id }: { usuarioId: number; id: number }) {
    await verificarPermiso([permisos.eventos.eliminar_eventos], usuarioId);

    if (!id) {
      throw new Exception('El id del evento es requerido');
    }

    const evento = await eventoServices.findByIdConUsuarios(id);

    if (evento?.Usuario_Evento.length) {
      throw new Exception(
        'No se puede eliminar un evento que ya tiene usuarios asociados'
      );
    }

    const eventoDeleted = await eventoServices.delete(id);

    return eventoDeleted;
  }

  async getById({ usuarioId, id }: { usuarioId: number; id: number }) {
    await verificarPermiso([permisos.eventos.ver_eventos], usuarioId);

    if (!id) {
      throw new Exception('El id del evento es requerido');
    }

    const eventoDB = await eventoServices.findById(id);

    if (!eventoDB) {
      throw new Exception('Carpeta no encontrado');
    }
    return eventoDB;
  }

  async findAllEventByUser(usuarioId: number) {
    if (!usuarioId) {
      throw new Exception('El id del usuario es requerido');
    }
    const usuarioEventos = await eventoServices.findAllEventByUser(usuarioId);

    const eventos = usuarioEventos.map((usuarioEvento: any) => ({
      id: usuarioEvento.id,
      nombre: usuarioEvento.evento.tipoEvento.nombre,
      descripcion: usuarioEvento.evento.tipoEvento.descripcion,
      fecha: usuarioEvento.evento.fecha,
      estado: usuarioEvento.estado
    }));

    return eventos;
  }

  async findAllEventPending() {
    const eventosPendientes = await eventoServices.findAllEventPending();

    return eventosPendientes;
  }

  async getEventTypes() {
    const tiposEventos = await eventoServices.findAllEventTypes();

    return tiposEventos;
  }

  async finalizar({
    usuarioId,
    eventoId
  }: {
    usuarioId: number;
    eventoId: number;
  }) {
    await verificarPermiso([permisos.eventos.modificar_eventos], usuarioId);

    if (!eventoId) {
      throw new Exception('El id del evento es requerido');
    }

    const evento = await eventoServices.findByIdConUsuarios(eventoId);

    if (!evento) {
      throw new Exception('El evento no existe');
    }

    const eventoUpdated = await eventoServices.update(eventoId, {
      estado: 'finalizado'
    });

    return eventoUpdated;
  }
}

export default new EventoValidator();
