import prisma from '../config/db';

class DenunciaService {
  findById(id: number) {
    return prisma.denuncia.findUnique({
      where: {
        id
      }
    });
  }
}

export default new DenunciaService();
