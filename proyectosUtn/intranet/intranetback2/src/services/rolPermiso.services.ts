import prisma from '../config/db';

export class RolPermisoServicesClass {
  getAllPermisions() {
    return prisma.permiso.findMany({
      orderBy: {
        id: 'asc'
      }
    });
  }

  getAllRoles() {
    return prisma.rol.findMany({
      where: {
        deletedAt: null
      },
      include: {
        PermisoRol: {
          include: {
            permiso: true
          }
        }
      },
      orderBy: {
        nombre: 'asc'
      }
    });
  }

  createRol(nombre: string, permisos: number[]) {
    return prisma.rol.create({
      data: {
        nombre,
        PermisoRol: {
          create: permisos.map((permisoId) => ({
            permisoId
          }))
        }
      }
    });
  }

  async updateRol(id: number, nombre?: string, permisos?: number[]) {
    if (permisos) {
      await prisma.rol.update({
        where: {
          id
        },
        data: {
          PermisoRol: {
            deleteMany: {}
          }
        }
      });

      return prisma.rol.update({
        where: {
          id
        },
        data: {
          nombre,
          PermisoRol: {
            create: permisos.map((permisoId) => ({
              permisoId
            }))
          }
        }
      });
    } else {
      return prisma.rol.update({
        where: {
          id
        },
        data: {
          nombre
        }
      });
    }
  }

  deleteRol(id: number) {
    return prisma.rol.update({
      where: {
        id
      },
      data: {
        deletedAt: new Date()
      }
    });
  }
}

export default new RolPermisoServicesClass();
