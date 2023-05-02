import Exception from '../utils/Exception';
import prisma from '../config/db';

class IntimacionService {
  async findById(id: number) {
    return prisma.intimacion.findUnique({
      where: {
        id
      },
      include: {
        documento: true
      }
    });
  }

  async create({
    titulo,
    comentario,
    tramiteId,
    usuarioId,
    paso
  }: {
    titulo: string;
    comentario: string;
    tramiteId: number;
    usuarioId: number;
    paso: number;
  }) {
    return prisma.intimacion.create({
      data: {
        titulo,
        comentario,
        tramiteId,
        empleadoId: usuarioId,
        paso
      }
    });
  }

  async update({
    intimacionId,
    titulo,
    comentario
  }: {
    intimacionId: number;
    titulo?: string;
    comentario?: string;
  }) {
    return prisma.intimacion.update({
      where: {
        id: intimacionId
      },
      data: {
        titulo,
        comentario
      }
    });
  }

  async delete(intimacionId: number) {
    return prisma.intimacion.delete({
      where: {
        id: intimacionId
      }
    });
  }
}

export default new IntimacionService();
