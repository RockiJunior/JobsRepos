import prisma from '../config/db';

class TextoPdfService {
  findById(id: number) {
    return prisma.textoPdf.findUnique({
      where: {
        id
      },
      select: {
        texto: true
      }
    });
  }

  findByTitulo(titulo: string) {
    return prisma.textoPdf.findFirst({
      where: {
        titulo
      }
    });
  }
}

export default new TextoPdfService();