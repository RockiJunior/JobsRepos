import prisma from '../config/db';

class CarpetaService {
  findById(id: number) {
    return prisma.carpeta.findUnique({
      where: {
        id
      },
      include: {
        usuario: true
      }
    });
  }
  create({
    descripcion,
    usuarioId
  }: {
    descripcion: string;
    usuarioId: number;
  }) {
    return prisma.carpeta.create({
      data: {
        descripcion,
        usuarioId
      }
    });
  }

  findCarpetaActiva(userId: number) {
    return prisma.carpeta.findFirst({
      where: {
        usuarioId: userId,
        estado: true
      }
    });
  }
}
export default new CarpetaService();
