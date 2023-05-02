import prisma from '../src/config/db';
import TipoFiscalizacion from '../src/data/seed/tiposFiscalizacion/interfaceTipoFiscalizacion';

const fiscalizacionUpdater = async (fiscalizacion: TipoFiscalizacion) => {
  const { id, secciones } = fiscalizacion;

  console.log('Inicio de formulario de fiscalización:');

  const fiscalizacionDB = await prisma.tipoFiscalizacion.upsert({
    where: {
      id
    },
    create: {
      id
    },
    update: {
      id
    }
  });

  for (const seccion of secciones) {
    const seccionDB = await prisma.seccionFiscalizacion.upsert({
      where: {
        id: seccion.id
      },
      create: {
        inputs: {
          connect: seccion.inputs.map((input) => ({
            nombre: input.nombre
          }))
        },
        titulo: seccion.titulo,
        id: seccion.id,
        tipo: seccion.tipo,
        tipoFiscalizacionId: fiscalizacionDB.id
      },
      update: {
        inputs: {
          connect: seccion.inputs.map((input) => ({
            nombre: input.nombre
          }))
        },
        titulo: seccion.titulo,
        tipo: seccion.tipo,
        tipoFiscalizacionId: fiscalizacionDB.id
      }
    });

    console.log('* Sección', seccionDB.titulo, 'actualizada');
  }

  console.log('Formulario de fiscalización actualizado\n\n');
};

export default fiscalizacionUpdater;
