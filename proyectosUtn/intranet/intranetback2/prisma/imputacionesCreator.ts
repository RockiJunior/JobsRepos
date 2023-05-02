import prisma from '../src/config/db';
import { PadreImputacion } from './seedData';

export const imputacionesCreator = async (imputaciones: PadreImputacion[]) => {
  console.log('Creación de Imputaciones \n\n');
  for (const padreImputacion of imputaciones) {
    const padre = await prisma.padreImputacion.create({
      data: {
        titulo: padreImputacion.titulo
      }
    });
    console.log(`${padreImputacion.titulo}: \n`);
    for (const imputacion of padreImputacion.imputaciones) {
      await prisma.imputacion.create({
        data: {
          titulo: imputacion.titulo,
          padreImputacionId: padre.id
        }
      });
      console.log(imputacion.titulo);
    }
    console.log('\n');
  }
  console.log('Imputaciones creadas \n\n');
};
