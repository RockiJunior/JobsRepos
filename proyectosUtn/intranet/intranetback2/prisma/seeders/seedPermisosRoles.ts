import prisma from '../../src/config/db';
import { permisos } from '../seedData';

const main = async () => {
  const roles = await prisma.rol.findMany({
    include: {
      PermisoRol: {
        include: {
          permiso: true
        }
      }
    }
  });

  const rolesPermisosNombre = roles.map((rol) => {
    const { PermisoRol, ...resto } = rol;
    const permisos = PermisoRol.map((permisoRol) => permisoRol.permiso.nombre);
    return {
      ...resto,
      permisos
    };
  });

  await prisma.permisoRol.deleteMany();
  await prisma.permiso.deleteMany();

  await prisma.permiso.createMany({
    data: permisos
  });

  const permisosDB = await prisma.permiso.findMany();

  if (permisosDB) {
    const rolesPermisosNuevoId = rolesPermisosNombre.map((rol) => {
      const { permisos, ...resto } = rol;
      const permisosId = permisos.map(
        (permiso) =>
          permisosDB.find((permisoDB) => permisoDB.nombre === permiso)?.id
      );

      return {
        ...resto,
        permisos: permisosId as number[]
      };
    });

    const permisosRoles = rolesPermisosNuevoId
      .map((rol) => {
        const { permisos, ...resto } = rol;
        return permisos.map((permiso) => ({
          permisoId: permiso,
          rolId: resto.id
        }));
      })
      .flat();

    await prisma.permisoRol.createMany({
      data: permisosRoles
    });
  }
};

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
