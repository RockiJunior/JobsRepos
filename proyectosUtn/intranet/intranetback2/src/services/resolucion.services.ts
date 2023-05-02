import prisma from '../config/db';

class ResolucionService {
  async findById(id: number) {
    return prisma.resolucion.findUnique({
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
    empleadoId,
    paso,
    tramiteId,
    procesoLegalesId
  }: {
    titulo: string;
    comentario: string;
    empleadoId: number;
    paso: number;
    tramiteId?: number;
    procesoLegalesId?: number;
  }) {
    return prisma.resolucion.create({
      data: {
        titulo,
        comentario,
        empleadoId,
        paso,
        tramiteId,
        procesoLegalesId
      }
    });
  }

  update({
    resolucionId,
    titulo,
    comentario
  }: {
    resolucionId: number;
    titulo?: string;
    comentario?: string;
  }) {
    return prisma.resolucion.update({
      where: {
        id: resolucionId
      },
      data: {
        titulo,
        comentario
      }
    });
  }

  delete(resolucionId: number) {
    return prisma.resolucion.delete({
      where: {
        id: resolucionId
      }
    });
  }
}

export default new ResolucionService();
