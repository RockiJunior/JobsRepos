/* import prisma from '../../src/config/db';

const main = async () => {
  try {
    const tipoTransacciones = await prisma.tipoTransaccion.findMany({
      include: { conceptos: true }
    });

    for (const tipoTransaccion of tipoTransacciones) {
      await prisma.tipoTransaccion.update({
        where: {
          nombre: tipoTransaccion.nombre
        },
        data: {
          conceptos: {
            disconnect: tipoTransaccion.conceptos.map((concepto) => ({
              id: concepto.id
            }))
          },
          TipoTransaccionConcepto: {
            createMany: {
              data: tipoTransaccion.conceptos.map((concepto) => ({
                conceptoId: concepto.id,
                cantidad: 1
              }))
            }
          }
        }
      });
    }
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
 */
