import prisma from '../../src/config/db';

const main = async () => {
  await prisma.configuracion.upsert({
    where: {
      id: 1
    },
    update: {
      matriculaAnual: 34000,
      sueldoVitalMovil: 69480
    },
    create: {
      matriculaAnual: 34000,
      sueldoVitalMovil: 69480
    }
  });
};

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
