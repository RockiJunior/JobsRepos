import prisma from '../src/config/db';
import TipoTramite from '../src/data/seed/tiposTramites/interfaceTipoTramite';

const expedienteUpdater = async (tramite: TipoTramite) => {
  console.log(
    'Inicio de actualización de trámite:',
    tramite.titulo.toUpperCase()
  );

  const tramiteDB = await prisma.tipoTramite.upsert({
    where: {
      id: tramite.id
    },
    create: {
      id: tramite.id,
      titulo: tramite.titulo,
      plazo: tramite.plazo,
      areaId: tramite.areaId,
      pasos: tramite.pasos as any,
      tipo: tramite.tipo,
      puedeIniciar: tramite.puedeIniciar,
      requiere: tramite.requiere,
      descripcion: tramite.descripcion
    },
    update: {
      titulo: tramite.titulo,
      plazo: tramite.plazo,
      areaId: tramite.areaId,
      pasos: tramite.pasos as any,
      tipo: tramite.tipo,
      puedeIniciar: tramite.puedeIniciar,
      requiere: tramite.requiere,
      descripcion: tramite.descripcion
    }
  });

  for (const seccion of tramite.secciones) {
    const seccionDB = await prisma.seccion.upsert({
      where: {
        id: seccion.id
      },
      create: {
        id: seccion.id,
        titulo: seccion.titulo,
        tipoTramiteId: tramiteDB.id,
        tipo: seccion.tipo,
        inputs: {
          connect: seccion.inputs.map((input) => ({
            nombre: input.nombre
          }))
        }
      },
      update: {
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

    console.log('* Sección', seccionDB.titulo, 'actualizada');
  }

  console.log('Trámite', tramite.titulo, 'actualizado\n\n');
};

export default expedienteUpdater;
