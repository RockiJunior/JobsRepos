import Exception from './Exception';
import { Empleado, PermisoRol, Rol, Usuario } from '@prisma/client';
import empleadoServices from '../services/empleado.services';

// export interface IUsuario extends Usuario {
//   empleado: IEmpleado;
// }

// interface IEmpleado extends Empleado {
//   roles: IRol[];
// }

// interface IRol extends Rol {
//   PermisoRol: PermisoRol[];
// }

export const verificarPermiso = async (
  permisosRequeridos: (number | number[])[],
  usuarioId: number,
  accion?: string
) => {
  const empleado = await empleadoServices.findById(usuarioId);

  if (!empleado) {
    throw new Exception('No existe el empleado');
  }

  const permisosEmpleado: number[] = [];

  empleado.roles.forEach((rol) => {
    rol.PermisoRol.forEach((permiso) => {
      if (!permisosEmpleado.includes(permiso.permisoId)) {
        permisosEmpleado.push(permiso.permisoId);
      }
    });
  });

  for (const permisoRequerido of permisosRequeridos) {
    if (Array.isArray(permisoRequerido)) {
      let hasPermission = false;

      for (const permisoAnidado of permisoRequerido) {
        if (permisosEmpleado.includes(permisoAnidado)) {
          hasPermission = true;
          break;
        }
      }

      if (!hasPermission) {
        throw new Exception(
          `No tiene permisos para ${accion || 'realizar esta acción'}`
        );
      }
    } else if (!permisosEmpleado.includes(permisoRequerido)) {
      throw new Exception(
        `No tiene permisos para ${accion || 'realizar esta acción'}`
      );
    }
  }

  return;
};
