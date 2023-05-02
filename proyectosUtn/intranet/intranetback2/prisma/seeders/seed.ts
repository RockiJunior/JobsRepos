import prisma from '../../src/config/db';
import { IInputSeed, inputsSeed } from '../../src/data/seed/inputs/inputs';
import { tiposTramites } from '../../src/data/seed/tipos';
import formularioFiscalizacion from '../../src/data/seed/tiposFiscalizacion/fiscalizacion';
import getKeys from '../../src/utils/getKeys';
import fiscalizacionCreator from '../fiscalizacionCreator';
import { imputacionesCreator } from '../imputacionesCreator';
import {
  areas,
  disponibilidades,
  empleados,
  permisos,
  permisosRoles,
  roles,
  tiposTransaccion,
  usuarios,
  tipoEventos,
  imputaciones,
  textoPdf,
  conceptosTransacciones
} from '../seedData';
import tramiteCreator from '../tramiteCreator';

const main = async () => {
  try {
    await prisma.usuario.createMany({
      data: getKeys(usuarios).map((key) => ({
        ...usuarios[key]
      }))
    });

    console.log('Usuarios creados');

    const usuariosDB = await prisma.usuario.findMany();

    await prisma.area.createMany({
      data: areas
    });

    console.log('Areas creadas\n');

    await prisma.permiso.createMany({
      data: permisos
    });
    console.log('Permisos creados');

    await prisma.rol.createMany({
      data: roles.map((rol) => ({
        nombre: rol.nombre
      }))
    });
    console.log('Roles creados');

    await prisma.permisoRol.createMany({
      data: permisosRoles
    });
    console.log('PermisosRoles creados');

    empleados.forEach(async (empleado) => {
      const { usuarioEmail, roles, ...empleadoData } = empleado;
      const usuarioId = usuariosDB.find(
        (usuario) => usuario.email === usuarioEmail
      )?.id;

      if (usuarioId) {
        const empleado = await prisma.empleado.create({
          data: {
            ...empleadoData,
            roles: {
              connect: {
                id: roles[0]
              }
            },
            usuarioId: usuarioId
          }
        });

        roles.forEach(async (rol) => {
          await prisma.empleado.update({
            where: {
              usuarioId: empleado.usuarioId
            },
            data: {
              roles: {
                connect: {
                  id: rol
                }
              }
            }
          });
        });
      }
    });
    console.log('Empleados creados');

    await prisma.concepto.createMany({
      data: getKeys(conceptosTransacciones).map((key) => ({
        ...conceptosTransacciones[key]
      }))
    });

    for (const tipoTransaccion of tiposTransaccion) {
      await prisma.tipoTransaccion.create({
        data: {
          nombre: tipoTransaccion.nombre,
          opcionesCuotas: {
            create: tipoTransaccion.opcionesCuotas
          }
        }
      });

      const conceptos = tipoTransaccion.conceptos;

      await prisma.tipoTransaccionConcepto.createMany({
        data: conceptos.map((concepto) => ({
          conceptoId: concepto.id,
          tipoTransaccionNombre: tipoTransaccion.nombre
        }))
      });
    }

    console.log('TipoTransacciones creadas');

    await prisma.disponibilidad.createMany({
      data: disponibilidades
    });
    console.log('Disponibilidades creadas');

    await prisma.matricula.createMany({
      data: [
        {
          id: 8654,
          usuarioId: 12,
          estado: 'baja',
          fecha: new Date('2021-01-01')
        }
      ]
    });

    await imputacionesCreator(imputaciones);

    for (const texto of textoPdf) {
      await prisma.textoPdf.create({
        data: {
          ...texto
        }
      });
    }
    console.log('Textos PDF creados');

    console.log('_________________________________________\n');
    console.log('Inicio de creación de tipos de inputs:\n');

    let acc = 0;
    for (const item of getKeys(inputsSeed).map((k) => inputsSeed[k])) {
      const input = item as IInputSeed;

      await prisma.input.create({
        data: {
          nombre: input.nombre,
          tipo: input.tipo,
          titulo: input.titulo,
          ayuda: input.ayuda,
          opciones: input.opciones as any,
          validaciones: {
            create: {
              ...input.validaciones
            }
          }
        }
      });

      acc++;
    }
    console.log('_________________________________________');
    console.log(getKeys(inputsSeed).length + ' tipos de inputs en la seed');
    console.log(acc + ' tipos de inputs creados');
    console.log('_________________________________________\n');

    console.log('_________________________________________\n');
    console.log('Inicio de creación de tipos de trámite:\n');

    for (const tramite of tiposTramites) {
      await tramiteCreator(tramite);
    }

    await fiscalizacionCreator(formularioFiscalizacion);

    await prisma.tipoEvento.createMany({
      data: tipoEventos
    });
    console.log('Tipos de eventos creados');

    console.log('Seed ejecutado correctamente\n');
  } catch (error) {
    console.log(error);
  }
};

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
