import empleadoServices from '../services/empleado.services';
import fiscalizacionServices from '../services/fiscalizacion.services';
import informeFiscalizacionServices from '../services/informeFiscalizacion.Services.';
import Exception from '../utils/Exception';
import { registroHistorial } from '../utils/registrarHistorial';
import fs from 'fs';
import documentoServices from '../services/documento.services';

declare const process: {
  env: {
    SERVER_URL: string;
  };
};

class InformeFiscalizacionValidator {
  async crearInformeFiscalizacion({
    titulo,
    comentario,
    usuarioId,
    fiscalizacionId,
    paso
  }: {
    titulo: string;
    comentario: string;
    usuarioId: number;
    fiscalizacionId: number;
    paso?: number;
  }) {
    if (!titulo) {
      throw new Exception('Titulo es requerido');
    }
    if (!comentario) {
      throw new Exception('Comentario es requerido');
    }

    if (!fiscalizacionId) {
      throw new Exception('Se requiere el id fiscalización');
    }

    if (!usuarioId) {
      throw new Exception('Usuario Id es requerido');
    }

    const informeFiscalizacion = await informeFiscalizacionServices.create({
      titulo,
      comentario,
      usuarioId,
      fiscalizacionId,
      paso
    });
    const fiscalizacion = await fiscalizacionServices.findById(fiscalizacionId); 

    if (fiscalizacion) {
      await registroHistorial({
        titulo: 'Se ha generado un informe de fiscalización',
        descripcion: `Se ha generado un informe en la fiscalización <strong>${fiscalizacion.titulo}</strong>`,
        usuarioId,
        expedienteId: fiscalizacion.expedienteId,
        info: {
          tipo: 'informeFiscalizacion',
          id: informeFiscalizacion.id,
          fiscalizacionId: fiscalizacion.id
        }
      });
    }

    return informeFiscalizacion;
  }

  async editarInformeFiscalizacion({
    informeFiscalizacionId,
    titulo,
    comentario,
    usuarioId
  }: {
    informeFiscalizacionId: number;
    titulo?: string;
    comentario?: string;
    usuarioId: number;
  }) {
    if (!informeFiscalizacionId) {
      throw new Exception('El id del informe es requerido');
    }

    if (!usuarioId) {
      throw new Exception('El id del usuario es requerido');
    }

    const empleado = await empleadoServices.findById(usuarioId);

    if (!empleado) {
      throw new Exception('El empleado no existe');
    }

    const informFiscalizacioneDB = await informeFiscalizacionServices.findById(
      informeFiscalizacionId
    );

    if (!informFiscalizacioneDB) {
      throw new Exception('El informe no existe');
    }

    const informeFiscalizacion = await informeFiscalizacionServices.update({
      informeFiscalizacionId,
      titulo,
      comentario
    });

    if (informeFiscalizacion.fiscalizacionId) {
      await registroHistorial({
        titulo: 'Se ha editado un informe',
        descripcion: `Se ha editado un informe en el área <strong>${empleado?.area?.nombre}</strong>`,
        usuarioId,
        expedienteId: informeFiscalizacion.fiscalizacionId,
        info: {
          tipo: 'informe',
          id: informeFiscalizacion.id
        }
      });
    }

    return informeFiscalizacion;
  }

  async eliminarInformeFiscalizacion({
    informeFiscalizacionId,
    empleadoId
  }: {
    informeFiscalizacionId: number;
    empleadoId: number;
  }) {
    if (!informeFiscalizacionId) {
      throw new Exception('El id del informe es requerido');
    }

    if (!empleadoId) {
      throw new Exception('El id del empleado es requerido');
    }

    const empleado = await empleadoServices.findById(empleadoId);

    if (!empleado) {
      throw new Exception('El empleado no existe');
    }

    const informeFiscalizacionDB = await informeFiscalizacionServices.findById(
      informeFiscalizacionId
    );

    if (!informeFiscalizacionDB) {
      throw new Exception('El informe no existe');
    }

    for (const documento of informeFiscalizacionDB.documento) {
      try {
        fs.unlinkSync(
          '.' + documento.archivoUbicacion.replace(process.env.SERVER_URL, '')
        );
      } catch (e) {
        console.log(e);
      }
      await documentoServices.delete(documento.id);
    }

    const informeFiscalizacion = await informeFiscalizacionServices.delete(
      informeFiscalizacionId
    );

    if (informeFiscalizacion.fiscalizacionId) {
      await registroHistorial({
        titulo: 'Se ha eliminado un informe',
        descripcion: `Se ha eliminado un informe en el área <strong>${empleado?.area?.nombre}</strong>`,
        usuarioId: empleadoId,
        expedienteId: informeFiscalizacion.fiscalizacionId
      });
    }

    return informeFiscalizacion;
  }

  async documento({
    informeFiscalizacionId,
    usuarioId,
    filename,
    expedienteUserId,
    fiscalizacionId,
    documentoId,
    expedienteId
  }: {
    informeFiscalizacionId: number;
    usuarioId: number;
    filename: string;
    expedienteUserId: number | 'cucicba';
    fiscalizacionId: number;
    documentoId?: number;
    expedienteId: number;
  }) {
    if (!informeFiscalizacionId) {
      throw new Exception('El id del informe es requerido');
    }

    if (!usuarioId) {
      throw new Exception('El id usuario es requerido');
    }

    const empleado = await empleadoServices.findById(usuarioId);

    if (!empleado) {
      throw new Exception('El empleado no existe');
    }
    if (!fiscalizacionId) {
      throw new Exception('El id de la fiscalización es requerido');
    }

    const documentoGuardado =
      await documentoServices.upsertInformesFiscalizacion({
        informeFiscalizacionId,
        filename,
        expedienteUserId,
        fiscalizacionId,
        documentoId,
        expedienteId
      });

    return documentoGuardado;
  }
}

export default new InformeFiscalizacionValidator();
