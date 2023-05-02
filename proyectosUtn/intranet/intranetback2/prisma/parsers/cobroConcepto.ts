/* import prisma from '../../src/config/db';

const main = async () => {
  try {
    const cobros = await prisma.cobroFiscalizacion.findMany({
      include: { conceptos: true }
    });

    for (const cobro of cobros) {
      await prisma.cobroFiscalizacion.update({
        where: {
          id: cobro.id
        },
        data: {
          conceptos: {
            disconnect: cobro.conceptos.map((concepto) => ({ id: concepto.id }))
          },
          CobroConcepto: {
            createMany: {
              data: cobro.conceptos.map((concepto) => ({
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
