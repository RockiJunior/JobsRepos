import { Exception } from 'handlebars';
import prisma from '../config/db';
import permisosData from '../data/permisos';
import rolPermisoServices, {
  RolPermisoServicesClass
} from '../services/rolPermiso.services';
import { verificarPermiso } from '../utils/verificarPermisos';

export class RolPermisoValidatorClass {
  rolPermisoService: RolPermisoServicesClass;

  constructor() {
    this.rolPermisoService = rolPermisoServices;
  }

  async getAllRoles(usuarioId: number) {
    await verificarPermiso(
      [
        [
          permisosData.roles.ver_roles,
          permisosData.empleados.crear_empleados,
          permisosData.empleados.modificar_empleados
        ]
      ],
      usuarioId,
      'ver roles'
    );

    const roles = await this.rolPermisoService.getAllRoles();
    if (!roles) {
      throw new Exception('No hay roles');
    }

    return roles;
  }

  async getAllPermisos(usuarioId: number) {
    // const empleado = await empleadoServices.findById(usuarioId);

    // empleado?.roles.forEach((rol) => {
    //   if(!rol.PermisoRol.some((permiso) => permiso.permisoId === permisos.)){
    //     throw new Exception('No tienes permiso para ver los permisos');
    //   }
    // })

    const permisos = await this.rolPermisoService.getAllPermisions();

    if (!permisos) {
      throw new Exception('No hay permisos');
    }

    return permisos;
  }

  async createRol(usuarioId: number, nombre: string, permisos: number[]) {
    await verificarPermiso([permisosData.roles.crear_roles], usuarioId);

    if (!nombre) {
      throw new Exception('El nombre es requerido');
    }

    if (!permisos) {
      throw new Exception('Los permisos son requeridos');
    }

    const rol = await this.rolPermisoService.createRol(nombre, permisos);

    return rol;
  }

  async updateRol(
    usuarioId: number,
    id: number,
    nombre?: string,
    permisos?: number[]
  ) {
    await verificarPermiso([permisosData.roles.modificar_roles], usuarioId);

    if (!id) {
      throw new Exception('El id es requerido');
    }

    const rol = await this.rolPermisoService.updateRol(id, nombre, permisos);

    return rol;
  }

  async deleteRol(usuarioId: number, id: number) {
    await verificarPermiso([permisosData.roles.eliminar_roles], usuarioId);

    if (!id) {
      throw new Exception('El id es requerido');
    }

    const rol = await this.rolPermisoService.deleteRol(id);
    const empleadosDB = await prisma.empleado.findMany({
      where: {
        roles: {
          some: {
            id
          }
        }
      }
    });

    empleadosDB.forEach(async (empleado) => {
      await prisma.empleado.update({
        where: {
          usuarioId: empleado.usuarioId
        },
        data: {
          roles: {
            disconnect: {
              id
            }
          }
        }
      });
    });

    return rol;
  }
}

export default new RolPermisoValidatorClass();
