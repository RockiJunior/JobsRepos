import prisma from '../../src/config/db';
import { IInputSeed, inputsSeed } from '../../src/data/seed/inputs/inputs';
import { tiposTramites } from '../../src/data/seed/tipos';
import formularioFiscalizacion from '../../src/data/seed/tiposFiscalizacion/fiscalizacion';
import getKeys from '../../src/utils/getKeys';
import fiscalizacionUpdater from '../fiscalizacionUpdater';

import tramiteUpdater from '../tramiteUpdater';

const main = async () => {
  const inputs = await prisma.input.findMany({
    include: {
      inputValueFiscalizacion: true,
      InputValues: true,
      secciones: true,
      seccionFiscalizacion: true
    }
  });

  for (const input of inputs) {
    if (!input.inputValueFiscalizacion?.length && !input.InputValues?.length) {
      await prisma.input.update({
        where: {
          nombre: input.nombre
        },
        data: {
          seccionFiscalizacion: {
            deleteMany: {}
          },
          secciones: {
            deleteMany: {}
          }
        }
      });
    }
  }

  console.log('Inputs sin valores borrados');

  for (const item of getKeys(inputsSeed).map((k) => inputsSeed[k])) {
    const input = item as IInputSeed;

    await prisma.input.upsert({
      where: {
        nombre: input.nombre
      },
      create: {
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
      },
      update: {
        nombre: input.nombre,
        tipo: input.tipo,
        titulo: input.titulo,
        ayuda: input.ayuda,
        opciones: input.opciones as any,
        validaciones: {
          update: {
            ...input.validaciones
          }
        }
      }
    });
  }
  console.log('Inputs actualizados o creados');

  for (const tramite of tiposTramites) {
    await tramiteUpdater(tramite);
  }

  await fiscalizacionUpdater(formularioFiscalizacion);
};

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
