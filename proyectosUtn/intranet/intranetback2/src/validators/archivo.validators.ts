import archivoServices from '../services/archivo.services';
import Exception from '../utils/Exception';
import fs from 'fs';
import empleadoServices from '../services/empleado.services';
import tramiteServices from '../services/tramite.services';
import expedienteServices from '../services/expediente.services';
import { registroHistorial } from '../utils/registrarHistorial';
import tramiteCheckGotoNextStep from '../utils/tramite/tramiteCheckGotoNextStep';
import tramiteValidators from './tramite.validators';
import tramiteActionStep from '../utils/tramite/tramiteActionStep';
import procesoLegalesServices from '../services/procesoLegales.services';

declare const process: {
  env: {
    SERVER_URL: string;
  };
};

class ArchivoValidator {
  async findById(id: number) {
    if (!id) {
      throw new Exception('El id del archivo es requerido');
    }

    const archivo = await archivoServices.findById(id);

    if (!archivo) {
      throw new Exception('El archivo no existe');
    }

    return archivo;
  }

  async create({
    titulo,
    filename,
    usuarioId,
    tramiteId,
    expedienteId,
    procesoLegalesId,
    userProcesoId
  }: {
    titulo: string;
    filename: string;
    usuarioId: number;
    tramiteId?: number;
    expedienteId?: number;
    procesoLegalesId?: number;
    userProcesoId?: number;
  }) {
    if (!titulo) {
      throw new Exception('El título es requerido');
    }
    if (!filename) {
      throw new Exception('El nombre del archivo es requerido');
    }

    if (!usuarioId) {
      throw new Exception('El empleado es requerido');
    }

    if (!userProcesoId) {
      throw new Exception('El usuario del proceso es requerido');
    }

    if (tramiteId && expedienteId) {
      throw new Exception(
        'El archivo no puede pertenecer a un trámite y a un expediente al mismo tiempo'
      );
    }

    if (tramiteId && procesoLegalesId) {
      throw new Exception(
        'El archivo no puede pertenecer a un trámite y a un proceso legal al mismo tiempo'
      );
    }

    if (!tramiteId && !expedienteId && !procesoLegalesId) {
      throw new Exception(
        'El archivo debe pertenecer a un trámite o a un expediente'
      );
    }

    const empleado = await empleadoServices.findById(usuarioId);

    if (!empleado) {
      throw new Exception('El usuario no existe');
    }
    let paso = 0;

    if (tramiteId) {
      const tramite = await tramiteServices.findById(tramiteId);
      if (tramite) {
        paso = tramite.pasoActual;
      }
    } else if (procesoLegalesId) {
      const procesoLegal = await procesoLegalesServices.findById(
        procesoLegalesId
      );
      if (procesoLegal) {
        paso = procesoLegal.pasoActual;
      }
    }

    const archivo = await archivoServices.create({
      titulo,
      filename,
      empleadoId: usuarioId,
      tramiteId,
      expedienteId,
      procesoLegalesId,
      userProcesoId,
      paso
    });

    if (archivo) {
      if (tramiteId) {
        await registroHistorial({
          titulo: 'Se subió un archivo',
          descripcion: `Se subió el archivo "${titulo}" en el área ${empleado?.area?.nombre}`,
          usuarioId,
          tramiteId,
          info: {
            tipo: 'archivo',
            id: archivo.id
          }
        });
      } else if (expedienteId && !procesoLegalesId) {
        await registroHistorial({
          titulo: 'Se ha subido un archivo',
          descripcion: `Se ha subido el archivo "${titulo}" en el área ${empleado?.area?.nombre}`,
          usuarioId,
          expedienteId,
          info: {
            tipo: 'archivo',
            id: archivo.id
          }
        });
      } else if (procesoLegalesId) {
        await registroHistorial({
          titulo: 'Se ha subido un archivo',
          descripcion: `Se ha subido el archivo "<strong>${titulo}</strong>" en el Proceso Legal Nro <strong>${procesoLegalesId}</strong> en el área <strong>${empleado?.area?.nombre}</strong>`,
          usuarioId,
          expedienteId,
          info: {
            tipo: 'archivo',
            id: archivo.id,
            procesoLegalId: procesoLegalesId
          }
        });

        await registroHistorial({
          titulo: 'Se ha subido un archivo',
          descripcion: `Se ha subido el archivo "<strong>${titulo}</strong>" en el Proceso Legal Nro <strong>${procesoLegalesId}</strong> en el área <strong>${empleado?.area?.nombre}</strong>`,
          usuarioId,
          expedienteId,
          procesoLegalId: procesoLegalesId,
          info: {
            tipo: 'archivo',
            id: archivo.id,
            procesoLegalId: procesoLegalesId
          }
        });
      }
    }

    if (tramiteId) {
      const tramites = await tramiteValidators.getByIdForAction(
        Number(tramiteId)
      );

      if (tramiteCheckGotoNextStep(tramites)) {
        await tramiteServices.update(tramites.id, {
          pasoActual: tramites.pasoActual + 1
        });
        const newTramite = await tramiteValidators.getByIdForAction(
          tramites.id
        );
        await tramiteActionStep(newTramite);
      }
    }

    return archivo;
  }

  async update({
    id,
    titulo,
    filename,
    path
  }: {
    id: number;
    titulo: string;
    filename: string;
    path: string;
  }) {
    if (!id) {
      throw new Exception('El id es requerido');
    }

    if (!titulo) {
      throw new Exception('Los datos son requeridos');
    }
    if (!filename) {
      throw new Exception('El nombre del archivo es requerido');
    }
    if (!path) {
      throw new Exception('El path es requerido');
    }

    const archivo = await archivoServices.findById(id);

    if (!archivo) {
      throw new Exception('Archivo no encontrado');
    }

    const archivoUpdated = await archivoServices.update({
      id,
      titulo,
      filename,
      path
    });

    // if (archivoUpdated) {
    //   const tramite = await tramiteServices.findById(id);
    //   const expediente = await expedienteServices.findById(id);
    //   if (tramite?.id) {
    //     const paso = tramite?.pasoActual;
    //     await registroHistorial(
    //       titulo,
    //       'Archivo modificado',
    //       tramite.carpeta.usuarioId,
    //       tramite?.id
    //     );
    //   } else if (expediente?.id) {
    //     const paso = expediente?.pasoActual;
    //     await registroHistorial(
    //       titulo,
    //       'Archivo modificado',
    //       expediente.carpeta.usuarioId,
    //       expediente.id
    //     );
    //   }
    // }

    return archivoUpdated;
  }

  async delete(id: number, usuarioId: number) {
    if (!id) {
      throw new Exception('El id del empleado es requerido');
    }

    const archivo = await archivoServices.findById(id);

    if (!archivo) {
      throw new Exception('El archivo no existe');
    }

    if (!usuarioId) {
      throw new Exception('El usuario es requerido');
    }

    const empleado = await empleadoServices.findById(usuarioId);

    if (!empleado) {
      throw new Exception('El empleado no existe');
    }

    if (archivo.empleado?.areaId !== empleado.areaId) {
      throw new Exception('No tiene permisos para eliminar este archivo');
    }

    const deleted = await archivoServices.delete(id);

    if (deleted.tramiteId) {
      await registroHistorial({
        titulo: 'Se ha eliminado un archivo',
        descripcion: `Se ha eliminado el archivo "<strong>${deleted.titulo}</strong>" en el área <strong>${empleado?.area?.nombre}</strong>`,
        usuarioId: usuarioId,
        tramiteId: deleted.tramiteId
      });
    } else if (deleted.expedienteId) {
      await registroHistorial({
        titulo: 'Se ha eliminado un archivo',
        descripcion: `Se ha eliminado el archivo "<strong>${deleted.titulo}</strong>" en el área <strong>${empleado?.area?.nombre}</strong>`,
        usuarioId: usuarioId,
        expedienteId: deleted.expedienteId
      });
    } else if (deleted.procesoLegalesId) {
      const procesoLegal = await procesoLegalesServices.findById(
        deleted.procesoLegalesId
      );
      await registroHistorial({
        titulo: 'Se ha eliminado un archivo',
        descripcion: `Se ha eliminado el archivo "<strong>${deleted.titulo}</strong>" en el Proceso Legal Nro <strong>${deleted.procesoLegalesId}</strong> en el área <strong>${empleado?.area?.nombre}</strong>`,
        usuarioId: usuarioId,
        expedienteId: procesoLegal?.expedienteId
      });
    }

    try {
      fs.unlinkSync(
        '.' + deleted.archivoUbicacion.replace(process.env.SERVER_URL, '')
      );
    } catch (e) {
      console.log(e);
    }

    return deleted;
  }
}

export default new ArchivoValidator();
