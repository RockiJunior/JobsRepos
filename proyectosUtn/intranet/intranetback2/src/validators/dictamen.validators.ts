import { Dictamen } from '@prisma/client';
import fs from 'fs';
import { IProcesoLegales } from '../interfaces/expediente.interface';
import { ITramite } from '../interfaces/tramite.interface';
import dictamenServices from '../services/dictamen.services';
import documentoServices from '../services/documento.services';
import empleadoServices from '../services/empleado.services';
import procesoLegalesServices from '../services/procesoLegales.services';
import tramiteServices from '../services/tramite.services';
import Exception from '../utils/Exception';
import { registroHistorial } from '../utils/registrarHistorial';

declare const process: {
  env: {
    SERVER_URL: string;
  };
};

class DictamenValidator {
  async findById(id: number) {
    if (!id) {
      throw new Exception('El id es requerido');
    }
    const dictamenDB = await dictamenServices.findById(id);

    if (!dictamenDB) {
      throw new Exception('Dictamen no encontrada');
    }

    return dictamenDB;
  }

  async create({
    titulo,
    comentario,
    tramiteId,
    procesoLegalesId,
    empleadoId
  }: {
    titulo: string;
    comentario: string;
    tramiteId?: number;
    procesoLegalesId?: number;
    empleadoId: number;
  }) {
    if (!titulo) {
      throw new Exception('El id dictamen es requerido');
    }

    if (!comentario) {
      throw new Exception('El comentario es requerido');
    }

    if (!empleadoId) {
      throw new Exception('El id del empleado es requerido');
    }

    let tramite: ITramite | undefined;
    let procesoLegal: IProcesoLegales | null | undefined;

    if (tramiteId) {
      tramite = await tramiteServices.findById(tramiteId);
    }

    if (procesoLegalesId) {
      procesoLegal = await procesoLegalesServices.findById(procesoLegalesId);
    }

    const dictamen = await dictamenServices.create({
      titulo,
      comentario,
      tramiteId,
      empleadoId,
      paso: tramite?.pasoActual || procesoLegal?.pasoActual,
      procesoLegalesId
    });

    const empleado = await empleadoServices.findById(empleadoId);

    if (tramite) {
      await registroHistorial({
        titulo: 'Se ha generado un dictamen',
        descripcion: `Se ha generado un dictamen en el área <strong>${empleado?.area?.nombre}</strong>`,
        usuarioId: empleadoId,
        tramiteId: tramite.id,
        info: {
          tipo: 'dictamen',
          id: dictamen.id
        }
      });
    } else if (procesoLegal) {
      await registroHistorial({
        titulo: 'Se ha generado un dictamen',
        descripcion: `Se ha generado un dictamen en el Proceso Legal Nro <strong>${procesoLegal.id}</strong> en el área <strong>${empleado?.area?.nombre}</strong>`,
        usuarioId: empleadoId,
        expedienteId: procesoLegal.expedienteId,
        info: {
          tipo: 'dictamen',
          id: dictamen.id,
          procesoLegalId: procesoLegal.id
        }
      });
      
      await registroHistorial({
        titulo: 'Se ha generado un dictamen',
        descripcion: `Se ha generado un dictamen en el Proceso Legal Nro <strong>${procesoLegal.id}</strong> en el área <strong>${empleado?.area?.nombre}</strong>`,
        usuarioId: empleadoId,
        expedienteId: procesoLegal.expedienteId,
        procesoLegalId: procesoLegal.id,
        info: {
          tipo: 'dictamen',
          id: dictamen.id,
          procesoLegalId: procesoLegal.id
        }
      });
    }

    return dictamen;
  }

  async update({
    id,
    usuarioId,
    data
  }: {
    id: number;
    usuarioId: number;
    data: Partial<Dictamen>;
  }) {
    if (!id) {
      throw new Exception('El id es requerido');
    }

    if (!usuarioId) {
      throw new Exception('El id del usuario es requerido');
    }

    const empleado = await empleadoServices.findById(usuarioId);

    if (!empleado) {
      throw new Exception('El empleado no existe');
    }

    if (!data) {
      throw new Exception('Los datos son requeridos');
    }

    const dictamen = await dictamenServices.findById(id);

    if (!dictamen) {
      throw new Exception('Dictamen no encontrado');
    }
    const procesoLegales = await procesoLegalesServices.findById(
      Number(dictamen.procesoLegalesId)
    );
    if (dictamen.paso === procesoLegales?.pasoActual) {
      const dictamenUpdated = await dictamenServices.update({ id, data });

      if (dictamen.tramiteId) {
        await registroHistorial({
          titulo: 'Se ha editado un dictamen',
          descripcion: `Se ha editado un dictamen en el área <strong>${empleado?.area?.nombre}</strong>`,
          usuarioId,
          tramiteId: dictamen.tramiteId,
          info: {
            tipo: 'dictamen',
            id: dictamen.id
          }
        });
      } else if (dictamen.procesoLegalesId) {
        const procesoLegal = await procesoLegalesServices.findById(
          dictamen.procesoLegalesId
        );
        await registroHistorial({
          titulo: 'Se ha editado un dictamen',
          descripcion: `Se ha editado un dictamen en el Proceso Legal Nro <strong>${dictamen.procesoLegalesId}</strong> en el área <strong>${empleado?.area?.nombre}</strong>`,
          expedienteId: procesoLegal?.expedienteId,
          usuarioId,
          info: {
            tipo: 'dictamen',
            id: dictamen.id,
            procesoLegalId: dictamen.procesoLegalesId
          }
        });
      }

      return dictamenUpdated;
    } else {
      throw new Exception('No se puede editar el dictamen en este paso.');
    }
  }

  async eliminarDictamen({
    dictamenId,
    empleadoId
  }: {
    dictamenId: number;
    empleadoId: number;
  }) {
    if (!dictamenId) {
      throw new Exception('El id del dictamen es requerido');
    }

    if (!empleadoId) {
      throw new Exception('El id del empleado es requerido');
    }

    const empleado = await empleadoServices.findById(empleadoId);

    if (!empleado) {
      throw new Exception('El empleado no existe');
    }

    const dictamenDB = await dictamenServices.findById(dictamenId);

    if (!dictamenDB) {
      throw new Exception('El dictamen no existe');
    }

    for (const documento of dictamenDB.documento) {
      try {
        fs.unlinkSync(
          '.' + documento.archivoUbicacion.replace(process.env.SERVER_URL, '')
        );
      } catch (e) {
        console.log(e);
      }
      await documentoServices.delete(documento.id);
    }
    const procesolegales = await procesoLegalesServices.findById(
      Number(dictamenDB.procesoLegalesId)
    );
    if (dictamenDB.paso === procesolegales?.pasoActual) {
      const dictamen = await dictamenServices.delete(dictamenId);

      if (dictamen.tramiteId) {
        await registroHistorial({
          titulo: 'Se ha eliminado un dictamen',
          descripcion: `Se ha eliminado un dictamen en el área <strong>${empleado?.area?.nombre}</strong>`,
          usuarioId: empleadoId,
          tramiteId: dictamen.tramiteId
        });
      } else if (dictamen.procesoLegales) {
        await registroHistorial({
          titulo: 'Se ha eliminado un dictamen',
          descripcion: `Se ha eliminado un dictamen en el Proceso Legal Nro <strong>${dictamen.procesoLegalesId}</strong> en el área <strong>${empleado?.area?.nombre}</strong>`,
          usuarioId: empleadoId,
          expedienteId: dictamen.procesoLegales.expedienteId
        });
      }

      return dictamen;
    } else {
      throw new Exception('No se puede eliminar el dictamen en este paso.');
    }
  }

  async documento({
    dictamenId,
    usuarioId,
    filename,
    tramiteUserId,
    tramiteId,
    documentoId,
    expedienteId,
    expedienteUserId,
    procesoLegalesId
  }: {
    dictamenId: number;
    usuarioId: number;
    filename: string;
    tramiteUserId?: number | string;
    tramiteId?: number;
    procesoLegalesId?: number;
    expedienteUserId?: number;
    documentoId?: number;
    expedienteId?: number;
  }) {
    if (!dictamenId) {
      throw new Exception('El id del dictamen es requerido');
    }

    if (!usuarioId) {
      throw new Exception('El id usuario es requerido');
    }

    const empleado = await empleadoServices.findById(usuarioId);

    if (!empleado) {
      throw new Exception('El empleado no existe');
    }

    const documentoGuardado = await documentoServices.upsertDictamen({
      dictamenId,
      filename,
      tramiteUserId,
      tramiteId,
      documentoId,
      expedienteId,
      expedienteUserId,
      procesoLegalesId
    });

    return documentoGuardado;
  }
}

export default new DictamenValidator();
