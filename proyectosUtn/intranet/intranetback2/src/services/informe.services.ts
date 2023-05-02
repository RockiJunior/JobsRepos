import prisma from '../config/db';

class InformeService {
  async findById(id: number) {
    return prisma.informe.findUnique({
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
    usuarioId,
    paso,
    tramiteId,
    expedienteId,
    cedulaId,
    procesoLegalesId
  }: {
    titulo: string;
    comentario: string;
    usuarioId: number;
    paso: number;
    tramiteId?: number;
    expedienteId?: number;
    cedulaId?: number;
    procesoLegalesId?: number;
  }) {
    return prisma.informe.create({
      data: {
        titulo,
        comentario,
        tramiteId,
        expedienteId,
        empleadoId: usuarioId,
        paso,
        cedulaId,
        procesoLegalesId
      }
    });
  }

  update({
    informeId,
    titulo,
    comentario
  }: {
    informeId: number;
    titulo?: string;
    comentario?: string;
  }) {
    return prisma.informe.update({
      where: {
        id: informeId
      },
      data: {
        titulo,
        comentario
      }
    });
  }

  delete(informeId: number) {
    return prisma.informe.delete({
      where: {
        id: informeId
      }
    });
  }
}

export default new InformeService();
