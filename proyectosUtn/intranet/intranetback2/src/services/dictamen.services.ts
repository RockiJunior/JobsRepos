import { Dictamen } from '@prisma/client';
import dayjs from 'dayjs';
import prisma from '../config/db';

class DictamenServices {
  findById(id: number) {
    return prisma.dictamen.findUnique({
      where: {
        id
      },
      include: {
        documento: true,
        procesoLegales: true
      }
    });
  }

  create({
    titulo,
    comentario,
    tramiteId,
    procesoLegalesId,
    empleadoId,
    paso
  }: {
    titulo: string;
    comentario: string;
    tramiteId?: number;
    procesoLegalesId?: number;
    empleadoId: number;
    paso?: number;
  }) {
    return prisma.dictamen.create({
      data: {
        titulo,
        comentario,
        tramiteId,
        procesoLegalesId,
        empleadoId,
        paso
      }
    });
  }

  update({ id, data }: { id: number; data: Partial<Dictamen> }) {
    return prisma.dictamen.update({
      where: {
        id
      },
      data
    });
  }

  delete(id: number) {
    return prisma.dictamen.delete({
      where: {
        id
      },
      include: {
        procesoLegales: true
      }
    });
  }
}

export default new DictamenServices();
