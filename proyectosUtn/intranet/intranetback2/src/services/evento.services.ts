import { EstadoTramite, EstadoTransaccion, Evento } from '@prisma/client';
import prisma from '../config/db';

class EventoService {
  findById(eventoId: number) {
    return prisma.evento.findUnique({
      where: {
        id: eventoId
      },
      include: {
        tipoEvento: true,
        Usuario_Evento: {
          where: {
            OR: [{ estado: 'confirmado' }, { estado: 'aprobado' }]
          },
          include: {
            usuario: {
              include: {
                matricula: true
              }
            }
          }
        }
      }
    });
  }

  findByIdConUsuarios(eventoId: number) {
    return prisma.evento.findUnique({
      where: {
        id: eventoId
      },
      include: {
        Usuario_Evento: true
      }
    });
  }

  create({
    fecha,
    superAdminId,
    tipoEventoId
  }: {
    fecha: Date;
    superAdminId: number;
    tipoEventoId: number;
  }) {
    return prisma.evento.create({
      data: {
        fecha,
        superAdminId,
        tipoEventoId
      }
    });
  }

  update(id: number, data: Partial<Evento>) {
    return prisma.evento.update({
      where: {
        id
      },
      data
    });
  }

  delete(id: number) {
    return prisma.evento.delete({
      where: {
        id
      }
    });
  }

  findAllEventByUser(usuarioId: number) {
    return prisma.usuario_Evento.findMany({
      where: {
        usuarioId,
        NOT: {
          evento: null
        }
      },
      include: {
        evento: {
          include: {
            tipoEvento: true
          }
        }
      }
    });
  }

  findAllEventPending() {
    return prisma.evento.findMany({
      where: {
        estado: 'pendiente'
      },
      include: {
        tipoEvento: true,
        Usuario_Evento: true
      },
      orderBy: {
        fecha: 'asc'
      }
    });
  }

  findAllEventTypes() {
    return prisma.tipoEvento.findMany();
  }
}
export default new EventoService();
