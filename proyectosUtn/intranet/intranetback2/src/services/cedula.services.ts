import { CedulaNotificacion, TipoCedula } from '@prisma/client';
import prisma from '../config/db';

export class CedulaNotificacionService {
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
    return prisma.cedulaNotificacion.findMany({
      where: {
        OR: [
          {
            titulo: {
              contains: busqueda,
              mode: 'insensitive'
            }
          },
          {
            motivo: {
              contains: busqueda,
              mode: 'insensitive'
            }
          },
          {
            usuario: {
              OR: [
                { nombre: { contains: busqueda, mode: 'insensitive' } },
                { apellido: { contains: busqueda, mode: 'insensitive' } },
                { dni: { contains: busqueda, mode: 'insensitive' } }
              ]
            }
          }
        ]
      },
      include: {
        usuario: true,
        empleadoAsignado: true
      },
      orderBy: {
        [columna]: orden
      },
      take: limite,
      skip: (pagina - 1) * limite
    });
  }

  findById(id: number) {
    return prisma.cedulaNotificacion.findUnique({
      where: {
        id
      },
      include: {
        areas: true,
        documentos: true,
        usuario: true,
        empleadoAsignado: true,
        procesoLegalesPadre: true,
        fiscalizacionPadre: true,
        tramitePadre: true,
        informes: {
          include: {
            documento: true,
            empleado: {
              include: {
                area: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        notas: {
          where: {
            deletedAt: null
          },
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            empleado: {
              include: {
                usuario: true,
                area: true
              }
            }
          }
        }
      }
    });
  }

  create({
    numero,
    titulo,
    motivo,
    usuarioId,
    estado,
    empleadoId,
    procesoLegalesId,
    fiscalizacionId,
    tramiteId,
    expedienteId,
    fechaRecepcion,
    pasoCreacion
  }: {
    numero: number;
    titulo: string;
    motivo: string;
    usuarioId: number;
    estado: TipoCedula;
    empleadoId?: number;
    procesoLegalesId?: number;
    fiscalizacionId?: number;
    tramiteId?: number;
    expedienteId?: number;
    fechaRecepcion?: Date;
    pasoCreacion?: number;
  }) {
    return prisma.cedulaNotificacion.create({
      data: {
        numero,
        titulo,
        motivo,
        usuarioId,
        estado,
        empleadoId,
        procesoLegalesId,
        fiscalizacionId,
        tramiteId,
        expedienteId,
        fechaRecepcion,
        pasoCreacion
      }
    });
  }

  update(cedulaId: number, data: Partial<CedulaNotificacion>) {
    return prisma.cedulaNotificacion.update({
      where: {
        id: cedulaId
      },
      data
    });
  }

  delete(cedulaId: number) {
    return prisma.cedulaNotificacion.delete({
      where: {
        id: cedulaId
      }
    });
  }

  contarTotalCedulas(busqueda?: string) {
    return prisma.cedulaNotificacion.count({
      where: {
        empleadoId: null,
        OR: [
          {
            usuario: {
              OR: [
                { nombre: { contains: busqueda, mode: 'insensitive' } },
                { apellido: { contains: busqueda, mode: 'insensitive' } },
                { dni: { contains: busqueda, mode: 'insensitive' } }
              ]
            }
          }
        ]
      }
    });
  }

  contarCedulasPorEmpleado(empleadoId: number) {
    return prisma.cedulaNotificacion.count({
      where: {
        empleadoId,
        fechaRecepcion: null
      }
    });
  }

  findSinAsignar({
    pagina,
    limite,
    orden,
    columna,
    busqueda
  }: {
    limite: number;
    orden: string;
    columna: string;
    pagina: number;
    busqueda: string;
  }) {
    let orderBy = {};

    if (
      columna === 'nombre' ||
      columna === 'apellido' ||
      columna === 'dni' ||
      columna === 'email'
    ) {
      orderBy = {
        usuario: {
          [columna]: orden
        }
      };
    } else if (columna === 'tipo') {
      orderBy = {
        titulo: orden
      };
    } else {
      orderBy = {
        [columna]: orden
      };
    }

    return prisma.cedulaNotificacion.findMany({
      skip: limite * (pagina - 1),
      take: limite,
      where: {
        empleadoId: null,
        OR: [
          {
            usuario: {
              OR: [
                { nombre: { contains: busqueda, mode: 'insensitive' } },
                { apellido: { contains: busqueda, mode: 'insensitive' } },
                { dni: { contains: busqueda, mode: 'insensitive' } }
              ]
            }
          },
          {
            titulo: { contains: busqueda, mode: 'insensitive' }
          }
        ]
      },
      orderBy,
      include: {
        usuario: true
      }
    });
  }

  ultimaCedula() {
    return prisma.cedulaNotificacion.findFirst({
      orderBy: {
        numero: 'desc'
      }
    });
  }

  findByEmpleadoId({
    empleadoId,
    limite,
    orden,
    columna,
    pagina,
    busqueda
  }: {
    empleadoId: number;
    limite: number;
    orden: string;
    columna: string;
    pagina: number;
    busqueda: string;
  }) {
    let orderBy = {};

    if (columna === 'nombre' || columna === 'apellido' || columna === 'dni') {
      orderBy = {
        usuario: {
          [columna]: orden
        }
      };
    } else {
      orderBy = {
        [columna]: orden
      };
    }

    return prisma.cedulaNotificacion.findMany({
      skip: limite * (pagina - 1),
      take: limite,
      where: {
        empleadoId,
        OR: [
          {
            usuario: {
              OR: [
                { nombre: { contains: busqueda, mode: 'insensitive' } },
                { apellido: { contains: busqueda, mode: 'insensitive' } },
                { dni: { contains: busqueda, mode: 'insensitive' } }
              ]
            }
          },
          {
            titulo: { contains: busqueda, mode: 'insensitive' }
          }
        ]
      },
      orderBy,
      include: {
        usuario: true
      }
    });
  }

  findFamilia(id: number) {
    return prisma.cedulaNotificacion.findUnique({
      where: {
        id
      },
      include: {
        tramitePadre: true,
        procesoLegalesPadre: true,
        fiscalizacionPadre: true
      }
    });
  }

  findByAreaId({
    areaId,
    limite,
    orden,
    columna,
    pagina,
    busqueda
  }: {
    areaId: number;
    limite: number;
    orden: string;
    columna: string;
    pagina: number;
    busqueda: string;
  }) {
    let orderBy = {};

    if (
      columna === 'nombre' ||
      columna === 'apellido' ||
      columna === 'dni' ||
      columna === 'email'
    ) {
      orderBy = {
        usuario: {
          [columna]: orden
        }
      };
    } else if (columna === 'titulo') {
      orderBy = {
        titulo: orden
      };
    } else {
      orderBy = {
        [columna]: orden
      };
    }

    return prisma.cedulaNotificacion.findMany({
      skip: limite * (pagina - 1),
      take: limite,
      where: {
        areas: {
          some: {
            areaId,
            deleted: null
          }
        },
        OR: [
          {
            usuario: {
              OR: [
                { nombre: { contains: busqueda, mode: 'insensitive' } },
                { apellido: { contains: busqueda, mode: 'insensitive' } },
                { dni: { contains: busqueda, mode: 'insensitive' } },
                { email: { contains: busqueda, mode: 'insensitive' } }
              ]
            }
          },
          {
            areas: {
              every: {
                area: {
                  nombre: { contains: busqueda, mode: 'insensitive' }
                }
              }
            }
          }
        ]
      },
      select: {
        areas: {
          include: {
            area: true
          }
        },
        id: true,
        createdAt: true,

        usuario: {
          select: {
            apellido: true,
            dni: true,
            email: true,
            nombre: true
          }
        }
      },
      orderBy
    });
  }

  contarTramitesPendientesByArea(areaId: number, busqueda?: string) {
    return prisma.cedulaNotificacion.count({
      where: {
        areas: {
          every: {
            areaId,
            deleted: null
          }
        },
        OR: [
          {
            usuario: {
              OR: [
                { nombre: { contains: busqueda, mode: 'insensitive' } },
                { apellido: { contains: busqueda, mode: 'insensitive' } },
                { dni: { contains: busqueda, mode: 'insensitive' } },
                { email: { contains: busqueda, mode: 'insensitive' } }
              ]
            }
          },
          {
            areas: {
              every: {
                area: {
                  nombre: { contains: busqueda, mode: 'insensitive' }
                }
              }
            }
          }
        ]
      }
    });
  }
}
export default new CedulaNotificacionService();
