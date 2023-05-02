import prisma from '../../src/config/db';
import { imputacionesCreator } from '../imputacionesCreator';
import { imputaciones } from '../seedData';

const main = async () => {
  await imputacionesCreator(imputaciones);
};

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
