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
import declaracionJuradaServices from '../services/declaracionJuradaFiscalizacion.services';
import fiscalizacionServices from '../services/fiscalizacion.services';

declare const process: {
  env: {
    SERVER_URL: string;
  };
};

class DeclaracionJuradaValidator {
  async findById(id: number) {
    if (!id) {
      throw new Exception('El id del archivo es requerido');
    }

    const archivo = await declaracionJuradaServices.findById(id);

    if (!archivo) {
      throw new Exception('El archivo no existe');
    }

    return archivo;
  }

  async create({
    titulo,
    filename,
    usuarioId,
    fiscalizacionId,
    userFiscalizacionId,
    expedienteId
  }: {
    titulo: string;
    filename: string;
    usuarioId: number;
    fiscalizacionId?: number;
    userFiscalizacionId?: number;
    expedienteId?: number;
  }) {
    if (!titulo) {
      throw new Exception('El título es requerido');
    }
    if (!filename) {
      throw new Exception('El nombre del archivo es requerido');
    }

    if (!expedienteId) {
      throw new Exception('El expediente es requerido');
    }

    if (!usuarioId) {
      throw new Exception('El empleado es requerido');
    }

    if (!fiscalizacionId) {
      throw new Exception('La fiscalización es requerida');
    }

    if (!userFiscalizacionId) {
      throw new Exception('El usuario de la fiscalización es requerido');
    }

    const empleado = await empleadoServices.findById(usuarioId);

    if (!empleado) {
      throw new Exception('El usuario no existe');
    }

    const fiscalizacion = await fiscalizacionServices.findById(fiscalizacionId);
    if (!fiscalizacion) {
      throw new Exception('La fiscalización no existe');
    }

    const archivo = await declaracionJuradaServices.create({
      titulo,
      filename,
      empleadoId: usuarioId,
      fiscalizacionId,
      userFiscalizacionId,
      expedienteId
    });

    if (fiscalizacion.transaccion?.estado === 'approved') {
      await fiscalizacionServices.update({
        id: fiscalizacion.id,
        data: {
          estado: 'finalizada'
        }
      });

      await expedienteServices.update({
        id: expedienteId,
        data: {
          estado: 'pendiente'
        }
      })
    }

    return archivo;
  }

  // if (archivo) {

  // }

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

    const archivo = await declaracionJuradaServices.findById(id);

    if (!archivo) {
      throw new Exception('Archivo no encontrado');
    }

    const archivoUpdated = await declaracionJuradaServices.update({
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

    const ddjj = await declaracionJuradaServices.findById(id);

    if (!ddjj) {
      throw new Exception('El archivo no existe');
    }

    if (!usuarioId) {
      throw new Exception('El usuario es requerido');
    }

    const empleado = await empleadoServices.findById(usuarioId);

    if (!empleado) {
      throw new Exception('El empleado no existe');
    }

    if (ddjj.empleado?.areaId !== empleado.areaId) {
      throw new Exception('No tiene permisos para eliminar este archivo');
    }

    const deleted = await declaracionJuradaServices.delete(id);

    if (deleted.fiscalizacionId) {
      const fiscalizacion = await fiscalizacionServices.findById(
        deleted.fiscalizacionId
      );
      await registroHistorial({
        titulo: 'Se ha eliminado un archivo',
        descripcion: `Se ha eliminado el archivo "<strong>${deleted.titulo}</strong>" en el área <strong>${empleado?.area?.nombre}</strong>`,
        usuarioId: usuarioId,
        fiscalizacionId: deleted.fiscalizacionId,
        expedienteId: fiscalizacion?.expedienteId,
        info: {
          tipo: 'ddjj',
          id: deleted.id
        }
      });

      await registroHistorial({
        titulo: 'Se ha eliminado un archivo',
        descripcion: `Se ha eliminado el archivo "<strong>${deleted.titulo}</strong>" en el área <strong>${empleado?.area?.nombre}</strong>`,
        usuarioId: usuarioId,
        fiscalizacionId: deleted.fiscalizacionId,
        info: {
          tipo: 'ddjj',
          id: deleted.id
        }
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

export default new DeclaracionJuradaValidator();
