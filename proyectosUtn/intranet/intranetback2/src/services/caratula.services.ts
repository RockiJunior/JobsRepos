import { Caratula } from '@prisma/client';
import prisma from '../config/db';

export class CaratulaServices {
  async findAll({
    pagina,
    limite,
    orden,
    columna,
    busqueda
  }: {
    pagina: number;
    limite: number;
    orden: string;
    columna: string;
    busqueda: string;
  }) {
    return prisma.caratula.findMany({
      where: {
        OR: [
          {
            titulo: {
              contains: busqueda,
              mode: 'insensitive'
            }
          },
          {
            denunciado: {
              contains: busqueda,
              mode: 'insensitive'
            }
          },
          {
            denunciante: {
              contains: busqueda,
              mode: 'insensitive'
            }
          }
        ]
      },
      orderBy: {
        [columna]: orden
      },
      take: limite,
      skip: (pagina - 1) * limite
    });
  }

  findById(id: number) {
    return prisma.caratula.findUnique({
      where: {
        id
      },
      include: {
        expediente: true
      }
    });
  }

  create({
    titulo,
    denunciante,
    denunciado,
    expedienteId
  }: {
    titulo: string;
    denunciante: string;
    denunciado: string;
    expedienteId: number;
  }) {
    return prisma.caratula.create({
      data: {
        titulo,
        denunciante,
        denunciado,
        expedienteId
      }
    });
  }

  update({
    caratulaId,
    data
  }: {
    caratulaId: number;
    data: Partial<Caratula>;
  }) {
    return prisma.caratula.update({
      where: {
        id: caratulaId
      },
      data
    });
  }

  delete(caratulaId: number) {
    return prisma.caratula.delete({
      where: {
        id: caratulaId
      }
    });
  }

  contarTotalCaratulas(busqueda?: string) {
    return prisma.caratula.count({
      where: {
        OR: [
          {
            titulo: {
              contains: busqueda,
              mode: 'insensitive'
            }
          },
          {
            denunciado: {
              contains: busqueda,
              mode: 'insensitive'
            }
          },
          {
            denunciante: {
              contains: busqueda,
              mode: 'insensitive'
            }
          }
        ]
      }
    });
  }

  ultimaCaratula() {
    return prisma.caratula.findFirst({
      orderBy: {
        id: 'desc'
      }
    });
  }
}
export default new CaratulaServices();
