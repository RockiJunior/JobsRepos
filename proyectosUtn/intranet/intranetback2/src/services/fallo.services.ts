import prisma from '../config/db';
import { Fallo, TipoFallo } from '@prisma/client';

class FalloService {
  async findById(id: number) {
    return prisma.fallo.findUnique({
      where: {
        id
      },
      include: {
        documento: true
      }
    });
  }

  create({
    titulo,
    comentario,
    tipo,
    paso,
    procesoLegalesId,
    usuarioId
  }: {
    titulo: string;
    comentario: string;
    tipo: TipoFallo;
    paso: number;
    procesoLegalesId: number;
    usuarioId: number;
  }) {
    return prisma.fallo.create({
      data: {
        titulo,
        comentario,
        tipo,
        procesoLegalesId,
        empleadoId: usuarioId,
        paso
      }
    });
  }

  update({
    falloId,
    titulo,
    comentario,
    tipo
  }: {
    falloId: number;
    titulo: string;
    comentario: string;
    tipo: TipoFallo;
  }) {
    return prisma.fallo.update({
      where: {
        id: falloId
      },
      data: {
        titulo,
        comentario,
        tipo
      }
    });
  }

  delete(falloId: number) {
    return prisma.fallo.delete({
      where: {
        id: falloId
      }
    });
  }
}

export default new FalloService();
