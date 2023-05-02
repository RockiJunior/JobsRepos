import fs from 'fs';
import cedulaServices from '../services/cedula.services';
import documentoServices from '../services/documento.services';
import empleadoServices from '../services/empleado.services';
import expedienteServices from '../services/expediente.services';
import InformeService from '../services/informe.services';
import procesoLegalesServices from '../services/procesoLegales.services';
import Exception from '../utils/Exception';
import { registroHistorial } from '../utils/registrarHistorial';
import tramiteValidators from './tramite.validators';

declare const process: {
  env: {
    SERVER_URL: string;
  };
};

class InformeValidator {
  async crearInforme({
    titulo,
    comentario,
    usuarioId,
    tramiteId,
    expedienteId,
    cedulaId,
    procesoLegalesId
  }: {
    titulo: string;
    comentario: string;
    usuarioId: number;
    tramiteId?: number;
    expedienteId?: number;
    cedulaId?: number;
    procesoLegalesId?: number;
  }) {
    if (!titulo) {
      throw new Exception('Titulo es requerido');
    }
    if (!comentario) {
      throw new Exception('Comentario es requerido');
    }

    if (!tramiteId && !expedienteId && !cedulaId && !procesoLegalesId) {
      throw new Exception(
        'Se requiere un trámite, expediente, cedula o proceso.'
      );
    }

    if (
      (tramiteId && cedulaId) ||
      (tramiteId && expedienteId) ||
      (tramiteId && procesoLegalesId) ||
      (cedulaId && expedienteId) ||
      (cedulaId && procesoLegalesId)
    ) {
      throw new Exception(
        'Solo se puede enviar un trámite, expediente, cédula o proceso'
      );
    }

    if (!usuarioId) {
      throw new Exception('Usuario Id es requerido');
    }

    let paso = 0;

    if (cedulaId) {
      const cedula = await cedulaServices.findById(cedulaId);
      if (!cedula) {
        throw new Exception('La cédula no existe');
      }
      paso = cedula.pasoActual;
    } else if (tramiteId) {
      const tramite = await tramiteValidators.getByIdForAction(tramiteId);
      if (!tramite) {
        throw new Exception('El trámite no existe');
      }
      paso = tramite.pasoActual;
    } else if (procesoLegalesId) {
      const proceso = await procesoLegalesServices.findById(procesoLegalesId);
      if (!proceso) {
        throw new Exception('El proceso no existe');
      }
      paso = proceso.pasoActual;
    }

    const informe = await InformeService.create({
      titulo,
      comentario,
      usuarioId,
      paso,
      tramiteId,
      expedienteId: procesoLegalesId ? undefined : expedienteId,
      cedulaId,
      procesoLegalesId
    });
    const empleado = await empleadoServices.findById(usuarioId);

    if (tramiteId) {
      const tramite = await tramiteValidators.getByIdForAction(tramiteId);

      if (!tramite) {
        throw new Exception('El trámite no existe');
      }

      if (tramite) {
        await registroHistorial({
          titulo: 'Se ha generado un informe',
          descripcion: `Se ha generado un informe en el área <strong>${empleado?.area?.nombre}</strong>`,
          usuarioId,
          tramiteId: tramite.id,
          info: {
            tipo: 'informe',
            id: informe.id
          }
        });
      }
    } else if (procesoLegalesId) {
      const proceso = await procesoLegalesServices.findById(procesoLegalesId);

      if (!proceso) {
        throw new Exception('El proceso no existe');
      }

      await registroHistorial({
        titulo: 'Se ha generado un informe',
        descripcion: `Se ha generado un informe en el Proceso Legal Nro <strong>${proceso.id}</strong> en el área <strong>${empleado?.area?.nombre}</strong>`,
        usuarioId,
        expedienteId: proceso.expedienteId,
        info: {
          tipo: 'informe',
          id: informe.id,
          procesoLegalId: proceso.id
        }
      });
    } else if (expedienteId) {
      const expediente = await expedienteServices.findById(expedienteId);

      if (!expediente) {
        throw new Exception('El expediente no existe');
      }

      await registroHistorial({
        titulo: 'Se ha generado un informe',
        descripcion: `Se ha generado un informe en el área <strong>${empleado?.area?.nombre}</strong>`,
        usuarioId,
        expedienteId: expediente.id,
        info: {
          tipo: 'informe',
          id: informe.id
        }
      });
    }

    return informe;
  }

  async editarInforme({
    informeId,
    titulo,
    comentario,
    usuarioId
  }: {
    informeId: number;
    titulo?: string;
    comentario?: string;
    usuarioId: number;
  }) {
    if (!informeId) {
      throw new Exception('El id del informe es requerido');
    }

    if (!usuarioId) {
      throw new Exception('El id del usuario es requerido');
    }

    const empleado = await empleadoServices.findById(usuarioId);

    if (!empleado) {
      throw new Exception('El empleado no existe');
    }

    const informeDB = await InformeService.findById(informeId);

    if (!informeDB) {
      throw new Exception('El informe no existe');
    }

    const informe = await InformeService.update({
      informeId,
      titulo,
      comentario
    });

    if (informe.tramiteId) {
      await registroHistorial({
        titulo: 'Se ha editado un informe',
        descripcion: `Se ha editado un informe en el área <strong>${empleado?.area?.nombre}</strong>`,
        usuarioId,
        tramiteId: informe.tramiteId,
        info: {
          tipo: 'informe',
          id: informe.id
        }
      });
    } else if (informe.expedienteId) {
      await registroHistorial({
        titulo: 'Se ha editado un informe',
        descripcion: `Se ha editado un informe en el área <strong>${empleado?.area?.nombre}</strong>`,
        usuarioId,
        expedienteId: informe.expedienteId,
        info: {
          tipo: 'informe',
          id: informe.id
        }
      });
    } else if (informe.procesoLegalesId) {
      const procesoLegal = await procesoLegalesServices.findById(
        informe.procesoLegalesId
      );
      await registroHistorial({
        titulo: 'Se ha editado un informe',
        descripcion: `Se ha editado un informe en el Proceso Legal Nro <strong>${informe.procesoLegalesId}</strong> en el área <strong>${empleado?.area?.nombre}</strong>`,
        expedienteId: procesoLegal?.expedienteId,
        usuarioId,
        info: {
          tipo: 'informe',
          id: informe.id,
          procesoLegalId: informe.procesoLegalesId
        }
      });
    }

    return informe;
  }

  async eliminarInforme({
    informeId,
    empleadoId
  }: {
    informeId: number;
    empleadoId: number;
  }) {
    if (!informeId) {
      throw new Exception('El id del informe es requerido');
    }

    if (!empleadoId) {
      throw new Exception('El id del empleado es requerido');
    }

    const empleado = await empleadoServices.findById(empleadoId);

    if (!empleado) {
      throw new Exception('El empleado no existe');
    }

    const informeDB = await InformeService.findById(informeId);

    if (!informeDB) {
      throw new Exception('El informe no existe');
    }

    for (const documento of informeDB.documento) {
      try {
        fs.unlinkSync(
          '.' + documento.archivoUbicacion.replace(process.env.SERVER_URL, '')
        );
      } catch (e) {
        console.log(e);
      }
      await documentoServices.delete(documento.id);
    }

    const informe = await InformeService.delete(informeId);

    if (informe.tramiteId) {
      await registroHistorial({
        titulo: 'Se ha eliminado un informe',
        descripcion: `Se ha eliminado un informe en el área <strong>${empleado?.area?.nombre}</strong>`,
        usuarioId: empleadoId,
        tramiteId: informe.tramiteId
      });
    } else if (informe.expedienteId) {
      await registroHistorial({
        titulo: 'Se ha eliminado un informe',
        descripcion: `Se ha eliminado un informe en el área <strong>${empleado?.area?.nombre}</strong>`,
        usuarioId: empleadoId,
        expedienteId: informe.expedienteId
      });
    } else if (informe.procesoLegalesId) {
      const procesoLegal = await procesoLegalesServices.findById(
        informe.procesoLegalesId
      );
      await registroHistorial({
        titulo: 'Se ha eliminado un informe',
        descripcion: `Se ha eliminado un informe en el Proceso Legal Nro <strong>${informe.procesoLegalesId}</strong> en el área <strong>${empleado?.area?.nombre}</strong>`,
        usuarioId: empleadoId,
        expedienteId: procesoLegal?.expedienteId
      });
    }

    return informe;
  }

  async documento({
    informeId,
    usuarioId,
    filename,
    tramiteUserId,
    tramiteId,
    expedienteId,
    cedulaId,
    documentoId,
    procesoLegalesId
  }: {
    informeId: number;
    usuarioId: number;
    filename: string;
    tramiteUserId: number | 'cucicba';
    tramiteId?: number;
    expedienteId?: number;
    cedulaId?: number;
    documentoId?: number;
    procesoLegalesId?: number;
  }) {
    if (!informeId) {
      throw new Exception('El id del informe es requerido');
    }

    if (!usuarioId) {
      throw new Exception('El id usuario es requerido');
    }

    const empleado = await empleadoServices.findById(usuarioId);

    if (!empleado) {
      throw new Exception('El empleado no existe');
    }

    const documentoGuardado = await documentoServices.upsertInformes({
      informeId,
      filename,
      tramiteUserId,
      tramiteId,
      expedienteId,
      cedulaId,
      documentoId,
      procesoLegalesId
    });

    return documentoGuardado;
  }
}

export default new InformeValidator();
