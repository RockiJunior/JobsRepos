import prisma from '../config/db';

class InformeFiscalizacionService {
  async findById(id: number) {
    return prisma.informeFiscalizacion.findUnique({
      where: {
        id
      },
      include: {
        documento: true,
        fiscalizacion: true
      }
    });
  }

  create({
    titulo,
    comentario,
    usuarioId,
    fiscalizacionId,
    paso
  }: {
    titulo: string;
    comentario: string;
    usuarioId: number;
    fiscalizacionId: number;
    paso?: number;
  }) {
    return prisma.informeFiscalizacion.create({
      data: {
        titulo,
        comentario,
        empleadoId: usuarioId,
        fiscalizacionId,
        paso
      }
    });
  }

  update({
    informeFiscalizacionId,
    titulo,
    comentario
  }: {
    informeFiscalizacionId: number;
    titulo?: string;
    comentario?: string;
  }) {
    return prisma.informeFiscalizacion.update({
      where: {
        id: informeFiscalizacionId
      },
      data: {
        titulo,
        comentario
      }
    });
  }

  delete(informeFiscalizacionId: number) {
    return prisma.informeFiscalizacion.delete({
      where: {
        id: informeFiscalizacionId
      }
    });
  }
}

export default new InformeFiscalizacionService();
