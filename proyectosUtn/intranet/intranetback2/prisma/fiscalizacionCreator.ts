import prisma from '../src/config/db';
import TipoFiscalizacion from '../src/data/seed/tiposFiscalizacion/interfaceTipoFiscalizacion';

const fiscalizacionCreator = async (fiscalizacion: TipoFiscalizacion) => {
  const { id, secciones } = fiscalizacion;

  console.log('Inicio de creación de formulario de fiscalización:');

  const fiscalizacionDB = await prisma.tipoFiscalizacion.create({
    data: {
      id
    }
  });

  for (const seccion of secciones) {
    const seccionDB = await prisma.seccionFiscalizacion.create({
      data: {
        inputs: {
          connect: seccion.inputs.map((input) => ({
            nombre: input.nombre
          }))
        },
        titulo: seccion.titulo,
        id: seccion.id,
        tipo: seccion.tipo,
        tipoFiscalizacionId: fiscalizacionDB.id
      }
    });

    console.log('* Sección', seccionDB.titulo, 'creada');
  }

  console.log('Formulario de fiscalización creado\n\n');
};

export default fiscalizacionCreator;
