import prisma from '../../src/config/db';
import { textoPdf } from '../seedData';

const main = async () => {
  for (const texto of textoPdf) {
    await prisma.textoPdf.upsert({
      where: {
        id: texto.id
      },
      create: {
        ...texto
      },
      update: {
        ...texto
      }
    });
  }
  console.log('Textos PDF creados');
};

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
