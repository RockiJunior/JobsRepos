import { Empleado } from '@prisma/client';
import prisma from '../config/db';

class EmpleadoService {
  findById(id: number) {
    return prisma.empleado.findUnique({
      where: {
        usuarioId: id
      },
      include: {
        roles: {
          include: {
            PermisoRol: true
          }
        },
        usuario: true,
        tramites: {
          include: {
            tipo: true,
            areas: true,
            carpeta: {
              include: {
                usuario: true
              }
            }
          }
        },
        cedulas: true,
        dictamen: true,
        area: true
      }
    });
  }

  findUsersByArea(areaId: number) {
    return prisma.empleado.findMany({
      where: {
        areaId
      },
      include: {
        usuario: true
      }
    });
  }

  findByUserArea(id: number) {
    return prisma.empleado.findMany({
      where: {
        usuarioId: id
      },
      include: {
        area: {
          include: {
            empleados: {
              include: {
                usuario: true,
                area: true,
                roles: true
              }
            }
          }
        }
      }
    });
  }

  findJefeDeArea(id: number) {
    return prisma.empleado.findMany({
      where: {
        roles: {
          some: {
            nombre: 'jefe_Area'
          }
        },
        areaId: id
      }
    });
  }

  findEmpleadosByArea(areaId: number) {
    return prisma.empleado.findMany({
      where: {
        AND: [
          {
            areaId
          },
          {
            roles: {
              some: {
                nombre: 'empleado'
              }
            }
          }
        ]
      }
    });
  }

  getAll({
    limite,
    orden,
    columna,
    pagina,
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
    } else if (columna === 'rolNombre') {
      orderBy = {
        rol: {
          nombre: orden
        }
      };
    } else if (columna === 'areaNombre') {
      orderBy = {
        area: {
          nombre: orden
        }
      };
    } else {
      orderBy = {
        [columna]: orden
      };
    }

    return prisma.empleado.findMany({
      skip: limite * (pagina - 1),
      take: limite,
      where: {
        deletedAt: null,
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
            roles: {
              some: {
                nombre: { contains: busqueda, mode: 'insensitive' }
              }
            }
          },
          {
            area: {
              nombre: { contains: busqueda, mode: 'insensitive' }
            }
          }
        ]
      },
      orderBy,
      include: {
        usuario: true,
        roles: true,
        area: true
      }
    });
  }

  contarEmpleados(busqueda: string) {
    return prisma.empleado.count({
      where: {
        deletedAt: null,
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
            roles: {
              some: {
                nombre: { contains: busqueda, mode: 'insensitive' }
              }
            }
          },
          {
            area: {
              nombre: { contains: busqueda, mode: 'insensitive' }
            }
          }
        ]
      }
    });
  }

  crearEmpleado({
    usuarioId,
    roles,
    areaId
  }: {
    usuarioId: number;
    roles: number[];
    areaId: number;
  }) {
    return prisma.empleado.create({
      data: {
        usuarioId,
        roles: {
          connect: roles.map((rol) => ({ id: rol }))
        },
        areaId
      }
    });
  }

  updateEmpleado({
    id,
    roles,
    areaId
  }: {
    id: number;
    roles: number[];
    areaId: number;
  }) {
    return prisma.empleado.update({
      where: {
        usuarioId: id
      },
      data: {
        roles: {
          set: roles.map((rol) => ({ id: rol }))
        },
        areaId
      }
    });
  }

  deleteEmpleado(id: number) {
    return prisma.empleado.update({
      where: {
        usuarioId: id
      },
      data: {
        deletedAt: new Date()
      }
    });
  }
}

export default new EmpleadoService();
