import documentoServices from '../services/documento.services';
import empleadoServices from '../services/empleado.services';
import Exception from '../utils/Exception';
import fs from 'fs';
import constatacionServices from '../services/constatacion.services';
import { EstadoExpediente } from '@prisma/client';
import { registroHistorial } from '../utils/registrarHistorial';
import fiscalizacionServices from '../services/fiscalizacion.services';

declare const process: {
  env: {
    SERVER_URL: string;
  };
};

class ConstatacionValidator {
  async findById(id: number) {
    if (!id) {
      throw new Exception('El id es requerido');
    }
    const constatacionDB = await constatacionServices.findById(id);

    if (!constatacionDB) {
      throw new Exception('Constatacion no encontrada');
    }

    return constatacionDB;
  }

  async crearConstatacion({
    titulo,
    comentario,
    estado,
    fiscalizacionId,
    usuarioId,
    fecha
  }: {
    titulo: string;
    comentario: string;
    estado: EstadoExpediente;
    fiscalizacionId: number;
    usuarioId: number;
    fecha: Date;
  }) {
    if (!titulo) {
      throw new Exception('Titulo es requerido');
    }

    if (!comentario) {
      throw new Exception('El comentario es requerido');
    }

    if (!estado) {
      throw new Exception('El estado es requerido');
    }

    if (!fiscalizacionId) {
      throw new Exception('El id del expediente es requerido');
    }

    if (!usuarioId) {
      throw new Exception('El id del empleado es requerido');
    }

    if (!fecha) {
      throw new Exception('La fecha es requerida');
    }

    const fiscalizacion = await fiscalizacionServices.findById(fiscalizacionId);

    if (fiscalizacion?.estado === 'pendiente') {
      const constatacion = await constatacionServices.create({
        titulo,
        comentario,
        estado,
        fiscalizacionId,
        usuarioId,
        fecha
      });

      if (fiscalizacion) {
        await registroHistorial({
          titulo: 'Se creó una constatación',
          descripcion: `Se creó una constatación para la Fiscalización <strong>${fiscalizacion.titulo}</strong>`,
          usuarioId,
          expedienteId: fiscalizacion.expedienteId,
          info: {
            tipo: 'constatacion',
            constatacionId: constatacion.id,
            fiscalizacionId: fiscalizacion.id
          }
        });

        await registroHistorial({
          titulo: 'Se creó una constatación',
          descripcion: `Se creó una constatación para la Fiscalización <strong>${fiscalizacion.titulo}</strong>`,
          usuarioId,
          expedienteId: fiscalizacion.expedienteId,
          fiscalizacionId: fiscalizacion.id,
          info: {
            tipo: 'constatacion',
            constatacionId: constatacion.id,
            fiscalizacionId: fiscalizacion.id
          }
        });
      }

      return constatacion;
    } else {
      throw new Exception(
        `No se pueden agregar constataciones porque la fiscalizacion esta en estado ${fiscalizacion?.estado
          .split('_')
          .join(' ')}`
      );
    }
  }

  async editarConstatacion({
    constatacionId,
    titulo,
    comentario,
    estado,
    usuarioId
  }: {
    constatacionId: number;
    titulo: string;
    comentario: string;
    estado: EstadoExpediente;
    usuarioId: number;
  }) {
    if (!constatacionId) {
      throw new Exception('El id de la constatación es requerido');
    }

    const constatacionDB = await constatacionServices.findById(constatacionId);

    if (!constatacionDB) {
      throw new Exception('La constatación no existe');
    }

    if (!constatacionDB.fiscalizacionId) {
      throw new Exception(
        'La constatación no tiene una fiscalización asociada'
      );
    }

    const fiscalizacion = await fiscalizacionServices.findById(
      constatacionDB.fiscalizacionId
    );

    if (fiscalizacion?.estado === 'pendiente') {
      const constatacion = await constatacionServices.update({
        constatacionId,
        titulo,
        comentario,
        estado
      });

      if (constatacionDB.fiscalizacionId) {
        if (fiscalizacion) {
          await registroHistorial({
            titulo: 'Se editó una constatación',
            descripcion: `Se editó una constatación para la Fiscalización <strong>${fiscalizacion.titulo}</strong>`,
            usuarioId,
            expedienteId: fiscalizacion.expedienteId,
            info: {
              tipo: 'constatacion',
              constatacionId: constatacion.id,
              fiscalizacionId: fiscalizacion.id
            }
          });

          await registroHistorial({
            titulo: 'Se editó una constatación',
            descripcion: `Se editó una constatación para la Fiscalización <strong>${fiscalizacion.titulo}</strong>`,
            usuarioId,
            expedienteId: fiscalizacion.expedienteId,
            fiscalizacionId: fiscalizacion.id,
            info: {
              tipo: 'constatacion',
              constatacionId: constatacion.id,
              fiscalizacionId: fiscalizacion.id
            }
          });
        }
      }
      return constatacion;
    } else {
      throw new Exception(
        `La constatación no se puede editar porque la fiscalizacion se encuentra en estado ${fiscalizacion?.estado
          .split('_')
          .join(' ')}`
      );
    }
  }

  async eliminarConstatacion(constatacionId: number, usuarioId: number) {
    if (!constatacionId) {
      throw new Exception('El id de la constatación es requerido');
    }

    const constatacionDB = await constatacionServices.findById(constatacionId);

    if (!constatacionDB) {
      throw new Exception('La constatación no existe');
    }

    if (!constatacionDB.fiscalizacionId) {
      throw new Exception(
        'La constatación no tiene una fiscalización asociada'
      );
    }

    const fiscalizacion = await fiscalizacionServices.findById(
      constatacionDB.fiscalizacionId
    );

    if (fiscalizacion?.estado === 'pendiente') {
      for (const documento of constatacionDB.documento) {
        try {
          fs.unlinkSync(
            '.' + documento.archivoUbicacion.replace(process.env.SERVER_URL, '')
          );
        } catch (e) {
          console.log(e);
        }
        await documentoServices.delete(documento.id);
      }

      const constatacion = await constatacionServices.delete(constatacionId);

      if (constatacionDB.fiscalizacionId) {
        if (fiscalizacion) {
          await registroHistorial({
            titulo: 'Se eliminó una constatación',
            descripcion: `Se eliminó una constatación para la Fiscalización <strong>${fiscalizacion.titulo}</strong>`,
            usuarioId,
            expedienteId: fiscalizacion.expedienteId,
            info: {
              tipo: 'constatacion',
              constatacionId: constatacion.id,
              fiscalizacionId: fiscalizacion.id
            }
          });

          await registroHistorial({
            titulo: 'Se eliminó una constatación',
            descripcion: `Se eliminó una constatación para la Fiscalización <strong>${fiscalizacion.titulo}</strong>`,
            usuarioId,
            expedienteId: fiscalizacion.expedienteId,
            fiscalizacionId: fiscalizacion.id,
            info: {
              tipo: 'constatacion',
              constatacionId: constatacion.id,
              fiscalizacionId: fiscalizacion.id
            }
          });
        }
      }

      return constatacion;
    } else {
      throw new Exception(
        `La constatación no puede ser eliminada porque la fiscalizacion se encuentra en estado ${fiscalizacion?.estado
          .split('_')
          .join(' ')}`
      );
    }
  }

  async documento({
    constatacionId,
    usuarioId,
    filename,
    expedienteUserId,
    expedienteId,
    fiscalizacionId,
    documentoId
  }: {
    constatacionId: number;
    usuarioId: number;
    filename: string;
    expedienteUserId: number;
    expedienteId: number;
    fiscalizacionId: number;
    documentoId?: number;
  }) {
    if (!constatacionId) {
      throw new Exception('El id de la constatación es requerido');
    }

    if (!usuarioId) {
      throw new Exception('El id usuario es requerido');
    }
    if (!fiscalizacionId) {
      throw new Exception('El id de la fiscalización es requerido');
    }

    const empleado = await empleadoServices.findById(usuarioId);

    if (!empleado) {
      throw new Exception('El empleado no existe');
    }

    const documentoGuardado = await documentoServices.upsertConstatacion({
      constatacionId,
      filename,
      expedienteUserId,
      expedienteId,
      fiscalizacionId,
      documentoId
    });

    return documentoGuardado;
  }
}

export default new ConstatacionValidator();
