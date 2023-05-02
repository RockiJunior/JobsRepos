import { Notificacion } from '@prisma/client';
import { JsonObject } from 'swagger-ui-express';
import prisma from '../config/db';

class NotificacionService {
  create({
    titulo,
    descripcion,
    usuarioId,
    info
  }: {
    titulo: string;
    descripcion: string;
    usuarioId: number;
    info?: JsonObject;
  }) {
    return prisma.notificacion.create({
      data: {
        titulo,
        descripcion,
        usuarioId,
        info
      }
    });
  }

  findNotificacionByUserId(userId: number) {
    return prisma.notificacion.findMany({
      where: {
        usuarioId: userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  updateMarcarNotifLeida(usuarioId: number) {
    return prisma.notificacion.updateMany({
      where: {
        usuarioId,
        leido: null
      },
      data: {
        leido: new Date()
      }
    });
  }
  updateMarcarNotifVista(usuarioId: number) {
    return prisma.notificacion.updateMany({
      where: {
        usuarioId,
        vista: null
      },
      data: {
        vista: new Date()
      }
    });
  }
  updateMarcarNotifByNotifId(id: number) {
    return prisma.notificacion.update({
      where: {
        id
      },
      data: {
        leido: new Date()
      }
    });
  }
}
export default new NotificacionService();
