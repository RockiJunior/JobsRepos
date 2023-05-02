import prisma from '../../src/config/db';
import { conceptosTransacciones, tiposTransaccion } from '../seedData';
import lodash from 'lodash';
import getKeys from '../../src/utils/getKeys';

const main = async () => {
  for (const conceptoKey of getKeys(conceptosTransacciones)) {
    const concepto = conceptosTransacciones[conceptoKey];

    console.log(concepto.nombre);

    await prisma.concepto.upsert({
      where: {
        id: concepto.id
      },
      update: {
        nombre: concepto.nombre,
        monto: concepto.monto,
        nombreMontoPorcentaje: concepto.nombreMontoPorcentaje,
        padre: concepto.padre,
        porcentaje: concepto.porcentaje,
        tipo: concepto.tipo
      },
      create: {
        id: concepto.id,
        nombre: concepto.nombre,
        monto: concepto.monto,
        nombreMontoPorcentaje: concepto.nombreMontoPorcentaje,
        padre: concepto.padre,
        porcentaje: concepto.porcentaje,
        tipo: concepto.tipo
      }
    });
  }

  for (const tipoTransaccion of tiposTransaccion) {
    const tipoTransaccionExistente = await prisma.tipoTransaccion.findUnique({
      where: {
        nombre: tipoTransaccion.nombre
      },
      include: {
        TipoTransaccionConcepto: { include: { concepto: true } },
        opcionesCuotas: true
      }
    });

    if (tipoTransaccionExistente) {
      const opcionesCuotasExistentes =
        tipoTransaccionExistente.opcionesCuotas.map((opcion) => {
          const { id, tipoTransaccionNombre, ...resto } = opcion;
          return resto;
        });

      const opcionesCuotas = tipoTransaccion.opcionesCuotas.filter(
        (opcion) =>
          !opcionesCuotasExistentes.some((opcionExistente) =>
            lodash.isEqual(opcion, opcionExistente)
          )
      );

      const conceptosTransaccion = await prisma.concepto.findMany({
        where: {
          TipoTransaccionConcepto: {
            some: {
              tipoTransaccionNombre: tipoTransaccion.nombre
            }
          }
        }
      });

      for (const concepto of conceptosTransaccion) {
        await prisma.tipoTransaccionConcepto.deleteMany({
          where: {
            conceptoId: concepto.id,
            tipoTransaccionNombre: tipoTransaccion.nombre
          }
        });
      }

      for (const concepto of tipoTransaccion.conceptos) {
        await prisma.tipoTransaccionConcepto.create({
          data: {
            conceptoId: concepto.id,
            tipoTransaccionNombre: tipoTransaccion.nombre
          }
        });
      }

      for (const opcion of opcionesCuotas) {
        const existia = tipoTransaccionExistente.opcionesCuotas.find(
          (opcionExistente) => {
            const { id, tipoTransaccionNombre, ...resto } = opcionExistente;
            return lodash.isEqual(opcion, { ...resto, activo: true });
          }
        );

        if (existia) {
          await prisma.tipoTransaccion.update({
            where: {
              nombre: tipoTransaccion.nombre
            },
            data: {
              opcionesCuotas: {
                updateMany: {
                  where: {
                    cantidad: opcion.cantidad
                  },
                  data: {
                    activo: false
                  }
                },
                update: {
                  where: {
                    id: existia.id
                  },
                  data: {
                    activo: true
                  }
                }
              }
            }
          });

          console.log(
            `${tipoTransaccion.nombre} - Opción de cuotas ${opcion.cantidad} ya existía, se activó`
          );
        } else {
          await prisma.tipoTransaccion.update({
            where: {
              nombre: tipoTransaccion.nombre
            },
            data: {
              opcionesCuotas: {
                updateMany: {
                  where: {
                    cantidad: opcion.cantidad
                  },
                  data: {
                    activo: false
                  }
                },

                create: opcion
              }
            }
          });

          console.log(
            `${tipoTransaccion.nombre} - Opción de cuotas ${opcion.cantidad} agregada`
          );
        }
      }

      console.log(`${tipoTransaccion.nombre} actualizada`);
    } else {
      await prisma.tipoTransaccion.create({
        data: {
          nombre: tipoTransaccion.nombre,
          opcionesCuotas: {
            create: tipoTransaccion.opcionesCuotas
          }
        }
      });

      for (const concepto of tipoTransaccion.conceptos) {
        await prisma.tipoTransaccionConcepto.create({
          data: {
            conceptoId: concepto.id,
            tipoTransaccionNombre: tipoTransaccion.nombre
          }
        });
      }

      console.log(`${tipoTransaccion.nombre} creada`);
    }
  }
};

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
