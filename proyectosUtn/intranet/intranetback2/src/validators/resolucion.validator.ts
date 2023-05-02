import fs from 'fs';
import documentoServices from '../services/documento.services';
import empleadoServices from '../services/empleado.services';
import expedienteServices from '../services/expediente.services';
import procesoLegalesServices from '../services/procesoLegales.services';
import resolucionService from '../services/resolucion.services';
import Exception from '../utils/Exception';
import { registroHistorial } from '../utils/registrarHistorial';
import tramiteValidators from './tramite.validators';

declare const process: {
  env: {
    SERVER_URL: string;
  };
};

class ResolucionValidator {
  async crearResolucion({
    titulo,
    comentario,
    empleadoId,
    tramiteId,
    procesoLegalesId
  }: {
    titulo: string;
    comentario: string;
    empleadoId: number;
    tramiteId?: number;
    procesoLegalesId?: number;
  }) {
    if (!titulo) {
      throw new Exception('Título es requerido');
    }
    if (!comentario) {
      throw new Exception('La descripción es requerida');
    }

    if (!tramiteId && !procesoLegalesId) {
      throw new Exception('Se requiere un trámite o expediente');
    }
    if (tramiteId && procesoLegalesId) {
      throw new Exception('Solo se puede enviar un trámite o expediente');
    }

    if (!empleadoId) {
      throw new Exception('Empleado Id es requerido');
    }

    let tramite;
    let procesoLegal;

    if (tramiteId) {
      tramite = await tramiteValidators.getByIdForAction(tramiteId);
      if (!tramite) {
        throw new Exception('El trámite no existe');
      }
    }
    if (procesoLegalesId) {
      procesoLegal = await procesoLegalesServices.findById(procesoLegalesId);
      if (!procesoLegal) {
        throw new Exception('El proceso Legal no existe');
      }
    }

    const resolucion = await resolucionService.create({
      titulo,
      comentario,
      empleadoId,
      paso: tramite?.pasoActual || procesoLegal?.pasoActual || 0,
      tramiteId,
      procesoLegalesId
    });

    if (tramiteId) {
      const tramite = await tramiteValidators.getByIdForAction(tramiteId);

      if (!tramite) {
        throw new Exception('El trámite no existe');
      }

      const empleado = await empleadoServices.findById(empleadoId);

      await registroHistorial({
        titulo: 'Se ha generado una resolución',
        descripcion: `Se ha generado un resolución en el área <strong>${empleado?.area?.nombre}</strong>`,
        usuarioId: empleadoId,
        tramiteId: tramite.id,
        info: {
          tipo: 'resolucion',
          id: resolucion.id
        }
      });
    } else if (procesoLegalesId) {
      const procesoLegal = await procesoLegalesServices.findById(
        procesoLegalesId
      );
      if (!procesoLegal) {
        throw new Exception('El proceso Legal no existe');
      }
      const empleado = await empleadoServices.findById(empleadoId);
      await registroHistorial({
        titulo: 'Se ha generado una resolución',
        descripcion: `Se ha generado un resolución en el Proceso Legal Nro <strong>${procesoLegal.id}</strong> en el área <strong>${empleado?.area?.nombre}</strong>`,
        usuarioId: empleadoId,
        expedienteId: procesoLegal.expedienteId,
        info: {
          tipo: 'resolucion',
          id: resolucion.id,
          procesoLegalId: procesoLegal.id
        }
      });

      await registroHistorial({
        titulo: 'Se ha generado una resolución',
        descripcion: `Se ha generado un resolución en el Proceso Legal Nro <strong>${procesoLegal.id}</strong> en el área <strong>${empleado?.area?.nombre}</strong>`,
        usuarioId: empleadoId,
        expedienteId: procesoLegal.expedienteId,
        procesoLegalId: procesoLegal.id,
        info: {
          tipo: 'resolucion',
          id: resolucion.id,
          procesoLegalId: procesoLegal.id
        }
      });
    }
    return resolucion;
  }

  async editarResolucion({
    resolucionId,
    titulo,
    comentario,
    usuarioId
  }: {
    resolucionId: number;
    titulo?: string;
    comentario?: string;
    usuarioId: number;
  }) {
    if (!resolucionId) {
      throw new Exception('El id del resolución es requerido');
    }

    if (!usuarioId) {
      throw new Exception('El id del usuario es requerido');
    }

    const empleado = await empleadoServices.findById(usuarioId);

    if (!empleado) {
      throw new Exception('El empleado no existe');
    }

    const resolucionDB = await resolucionService.findById(resolucionId);

    if (!resolucionDB) {
      throw new Exception('El resolución no existe');
    }

    if (resolucionDB.procesoLegalesId) {
      const procesoLegal = await procesoLegalesServices.findById(
        resolucionDB.procesoLegalesId
      );

      if (resolucionDB.paso !== procesoLegal?.pasoActual) {
        throw new Exception(
          'No se puede editar una resolución que no pertenece al paso actual'
        );
      }

      const resolucion = await resolucionService.update({
        resolucionId,
        titulo,
        comentario
      });

      await registroHistorial({
        titulo: 'Se ha editado una resolución',
        descripcion: `Se ha editado una resolución en el Proceso Legal Nro <strong>>${resolucion.procesoLegalesId}</strong> en el área <strong>${empleado?.area?.nombre}</strong>`,
        expedienteId: procesoLegal?.expedienteId,
        usuarioId,
        info: {
          tipo: 'resolucion',
          id: resolucion.id,
          procesoLegalId: resolucion.procesoLegalesId
        }
      });

      return resolucion;
    } else if (resolucionDB.tramiteId) {
      const tramite = await tramiteValidators.getByIdForAction(
        resolucionDB.tramiteId
      );

      if (resolucionDB.paso !== tramite?.pasoActual) {
        throw new Exception(
          'No se puede editar una resolución que no pertenece al paso actual'
        );
      }

      const resolucion = await resolucionService.update({
        resolucionId,
        titulo,
        comentario
      });

      await registroHistorial({
        titulo: 'Se ha editado una resolución',
        descripcion: `Se ha editado una resolución en el área <strong>${empleado?.area?.nombre}</strong>`,
        usuarioId,
        tramiteId: resolucionDB.tramiteId,
        info: {
          tipo: 'resolucion',
          id: resolucion.id
        }
      });

      return resolucion;
    } else {
      throw new Exception(
        'No se puede editar una resolución que no pertenece a un trámite o expediente'
      );
    }
  }

  async eliminarResolucion(resolucionId: number, empleadoId: number) {
    if (!resolucionId) {
      throw new Exception('El id del resolución es requerido');
    }

    if (!empleadoId) {
      throw new Exception('El id del empleado es requerido');
    }

    const empleado = await empleadoServices.findById(empleadoId);

    if (!empleado) {
      throw new Exception('El empleado no existe');
    }

    const resolucionDB = await resolucionService.findById(resolucionId);

    if (!resolucionDB) {
      throw new Exception('El resolución no existe');
    }

    if (resolucionDB.procesoLegalesId) {
      const procesoLegal = await procesoLegalesServices.findById(
        resolucionDB.procesoLegalesId
      );

      if (resolucionDB.paso !== procesoLegal?.pasoActual) {
        throw new Exception(
          'No se puede eliminar una resolución que no pertenece al paso actual'
        );
      }
    } else if (resolucionDB.tramiteId) {
      const tramite = await tramiteValidators.getByIdForAction(
        resolucionDB.tramiteId
      );

      if (resolucionDB.paso !== tramite?.pasoActual) {
        throw new Exception(
          'No se puede eliminar una resolución que no pertenece al paso actual'
        );
      }
    }
    for (const documento of resolucionDB.documento) {
      try {
        fs.unlinkSync(
          '.' + documento.archivoUbicacion.replace(process.env.SERVER_URL, '')
        );
      } catch (e) {
        console.log(e);
      }
      await documentoServices.delete(documento.id);
    }

    const resolucion = await resolucionService.delete(resolucionId);

    if (resolucion.tramiteId) {
      await registroHistorial({
        titulo: 'Se ha eliminado una resolución',
        descripcion: `Se ha eliminado una resolución en el área <strong>${empleado?.area?.nombre}</strong>`,
        usuarioId: empleadoId,
        tramiteId: resolucion.tramiteId
      });
    } else if (resolucion.procesoLegalesId) {
      const procesoLegales = await procesoLegalesServices.findById(
        resolucion.procesoLegalesId
      );
      await registroHistorial({
        titulo: 'Se ha eliminado una resolución',
        descripcion: `Se ha eliminado una resolución en el Proceso Legal Nro <strong>${resolucion.procesoLegalesId}</strong> en el área <strong>${empleado?.area?.nombre}</strong>`,
        usuarioId: empleadoId,
        expedienteId: procesoLegales?.expedienteId
      });
    }

    return resolucion;
  }

  async documento({
    resolucionId,
    usuarioId,
    filename,
    tramiteUserId,
    tramiteId,
    procesoLegalesId,
    documentoId,
    expedienteId
  }: {
    resolucionId: number;
    usuarioId: number;
    filename: string;
    tramiteUserId: number | 'cucicba';
    tramiteId?: number;
    procesoLegalesId?: number;
    documentoId?: number;
    expedienteId?: number;
  }) {
    if (!resolucionId) {
      throw new Exception('El id del resolución es requerido');
    }

    if (!usuarioId) {
      throw new Exception('El id usuario es requerido');
    }

    const empleado = await empleadoServices.findById(usuarioId);

    if (!empleado) {
      throw new Exception('El empleado no existe');
    }

    const documentoGuardado = await documentoServices.upsertResolucion({
      resolucionId,
      filename,
      tramiteUserId,
      tramiteId,
      procesoLegalesId,
      documentoId,
      expedienteId
    });

    return documentoGuardado;
  }
}

export default new ResolucionValidator();
