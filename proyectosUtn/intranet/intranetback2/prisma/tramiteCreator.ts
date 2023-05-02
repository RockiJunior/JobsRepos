import prisma from '../src/config/db';
import TipoTramite from '../src/data/seed/tiposTramites/interfaceTipoTramite';

const tramiteCreator = async (tramite: TipoTramite) => {
  const tramiteDB = await prisma.tipoTramite.create({
    data: {
      titulo: tramite.titulo,
      id: tramite.id,
      plazo: tramite.plazo,
      areaId: tramite.areaId,
      pasos: tramite.pasos as any,
      tipo: tramite.tipo,
      puedeIniciar: tramite.puedeIniciar,
      requiere: tramite.requiere,
      descripcion: tramite.descripcion
    }
  });

  console.log('Inicio de creación de trámite:', tramiteDB.titulo.toUpperCase());

  for (const seccion of tramite.secciones) {
    const seccionDB = await prisma.seccion.create({
      data: {
        titulo: seccion.titulo,
        tipoTramiteId: tramiteDB.id,
        tipo: seccion.tipo,
        inputs: {
          connect: seccion.inputs.map((input) => ({
            nombre: input.nombre
          }))
        }
      }
    });

    console.log('* Sección', seccionDB.titulo, 'creada');
  }

  console.log('Trámite', tramiteDB.titulo, 'creado\n');
};

export default tramiteCreator;
