import fs from 'fs';
import documentoServices from '../services/documento.services';
import empleadoServices from '../services/empleado.services';
import intimacionService from '../services/intimacion.services';
import tramiteServices from '../services/tramite.services';
import Exception from '../utils/Exception';
import { registroHistorial } from '../utils/registrarHistorial';
import tramiteActionStep from '../utils/tramite/tramiteActionStep';
import tramiteCheckGotoNextStep from '../utils/tramite/tramiteCheckGotoNextStep';
import tramiteValidators from './tramite.validators';

declare const process: {
  env: {
    SERVER_URL: string;
  };
};

class IntimacionValidator {
  async crearIntimacion({
    titulo,
    comentario,
    tramiteId,
    usuarioId
  }: {
    titulo: string;
    comentario: string;
    tramiteId: number;
    usuarioId: number;
  }) {
    if (!titulo) {
      throw new Exception('Titulo es requerido');
    }

    if (!comentario) {
      throw new Exception('Comentario es requerido');
    }

    if (!tramiteId) {
      throw new Exception('Trámite id es requerido');
    }

    if (!usuarioId) {
      throw new Exception('Usuario id es requerido');
    }

    const tramiteDB = await tramiteValidators.getByIdForAction(tramiteId);

    if (!tramiteDB) {
      throw new Exception('El trámite no existe');
    }

    const intimacion = await intimacionService.create({
      titulo,
      comentario,
      tramiteId,
      usuarioId,
      paso: tramiteDB.pasoActual
    });

    const tramite = await tramiteValidators.getByIdForAction(tramiteId);

    if (!tramite) {
      throw new Exception('El trámite no existe');
    }

    const empleado = await empleadoServices.findById(usuarioId);
    await registroHistorial({
      titulo: 'Se ha generado una intimación',
      descripcion: `Se ha generado una intimación en el área <strong>${empleado?.area?.nombre}</strong>`,
      usuarioId,
      tramiteId: tramite.id,
      info: {
        tipo: 'intimacion',
        id: intimacion.id
      }
    });

    if (tramiteCheckGotoNextStep(tramite)) {
      await tramiteServices.update(tramiteId, {
        pasoActual: tramite.pasoActual + 1
      });

      const newTramite = await tramiteValidators.getByIdForAction(tramiteId);

      await tramiteActionStep(newTramite);
    }

    return intimacion;
  }

  async editarIntimacion({
    intimacionId,
    titulo,
    comentario
  }: {
    intimacionId: number;
    titulo?: string;
    comentario?: string;
  }) {
    if (!intimacionId) {
      throw new Exception('Intimación id es requerido');
    }

    const intimacionDB = await intimacionService.findById(intimacionId);

    if (!intimacionDB) {
      throw new Exception('La intimación no existe');
    }

    const intimacion = await intimacionService.update({
      intimacionId,
      titulo,
      comentario
    });
    return intimacion;
  }

  async eliminarIntimacion({
    intimacionId,
    empleadoId
  }: {
    intimacionId: number;
    empleadoId: number;
  }) {
    if (!intimacionId) {
      throw new Exception('El id de la intimación es requerido');
    }
    if (!empleadoId) {
      throw new Exception('El id del empleado es requerido');
    }

    const empleado = await empleadoServices.findById(empleadoId);

    if (!empleado) {
      throw new Exception('El empleado no existe');
    }

    const intimacionDB = await intimacionService.findById(intimacionId);

    if (!intimacionDB) {
      throw new Exception('La intimación no existe');
    }

    for (const documento of intimacionDB.documento) {
      try {
        fs.unlinkSync(
          '.' + documento.archivoUbicacion.replace(process.env.SERVER_URL, '')
        );
      } catch (e) {
        console.log(e);
      }
      await documentoServices.delete(documento.id);
    }

    const intimacion = await intimacionService.delete(intimacionId);

    if (intimacion.tramiteId) {
      await registroHistorial({
        titulo: 'Se ha eliminado una intimación',
        descripcion: `Se ha eliminado una intimación en el área <strong>${empleado?.area?.nombre}</strong>`,
        usuarioId: empleadoId,
        tramiteId: intimacion.tramiteId
      });
    }

    return intimacion;
  }
  async documento({
    intimacionId,
    usuarioId,
    filename,
    tramiteUserId,
    tramiteId,
    documentoId
  }: {
    intimacionId: number;
    usuarioId: number;
    filename: string;
    tramiteUserId: number;
    tramiteId: number;
    documentoId?: number;
  }) {
    if (!intimacionId) {
      throw new Exception('El id de la intimación es requerido');
    }

    if (!usuarioId) {
      throw new Exception('El id usuario es requerido');
    }

    const empleado = await empleadoServices.findById(usuarioId);

    if (!empleado) {
      throw new Exception('El empleado no existe');
    }

    const documentoGuardado = await documentoServices.upsertIntimacion({
      intimacionId,
      filename,
      tramiteUserId,
      tramiteId,
      documentoId
    });

    return documentoGuardado;
  }
}

export default new IntimacionValidator();
