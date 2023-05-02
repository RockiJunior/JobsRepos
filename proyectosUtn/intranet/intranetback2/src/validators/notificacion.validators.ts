import {
  EstadoInput,
  InputsValueFiscalizacion,
  InputsValues
} from '@prisma/client';
import { JsonObject } from 'swagger-ui-express';
import notificacionServices from '../services/notificacion.services';
import usersServices from '../services/users.services';
import Exception from '../utils/Exception';
import {
  getNotificationDescription,
  getNotificationDescriptionExpediente
} from '../utils/getNotificationInfo';
import { IInputsValues } from './inputValues.validator';
import { IInputsValuesFiscalizacion } from './inputValuesFiscalizacion.validator';

class NotificacionValidator {
  async create({
    titulo,
    descripcion,
    usuarioId,
    info
  }: {
    titulo: string;
    descripcion: string;
    usuarioId: number;
    info?: JsonObject;
  }) {
    if (!titulo) {
      throw new Exception('El título es requerido');
    }

    if (!descripcion) {
      throw new Exception('La descripción es requerido');
    }

    if (!usuarioId) {
      throw new Exception('El id del usuario es requerido');
    }

    const notificacion = await notificacionServices.create({
      titulo,
      descripcion,
      usuarioId,
      info
    });

    return notificacion;
  }

  async findNotificacionByUserId(usuarioId: number) {
    if (!usuarioId) {
      throw new Exception('El id del usuario es requerido');
    }
    const notificacionDB = await notificacionServices.findNotificacionByUserId(
      usuarioId
    );

    return notificacionDB;
  }

  async updateMarcarNotifLeida(usuarioId: number) {
    if (!usuarioId) {
      throw new Exception('El id del usuario es requerido');
    }
    const notificacionDB = await notificacionServices.updateMarcarNotifLeida(
      usuarioId
    );

    return notificacionDB;
  }
  async updateMarcarNotifVista(usuarioId: number) {
    if (!usuarioId) {
      throw new Exception('El id del usuario es requerido');
    }
    const notificacionDB = await notificacionServices.updateMarcarNotifVista(
      usuarioId
    );

    return notificacionDB;
  }
  async updateMarcarNotifByNotifId(id: number) {
    if (!id) {
      throw new Exception('El id de la notificación es requerido');
    }
    const notificacionDB =
      await notificacionServices.updateMarcarNotifByNotifId(id);

    return notificacionDB;
  }

  async notificacionInputs({
    usuarioId,
    arrInputs,
    tituloSeccion,
    tramiteId,
    esAdmin
  }: {
    usuarioId: number;
    arrInputs: IInputsValues[];
    tituloSeccion: string;
    tramiteId: number;
    esAdmin: boolean;
  }) {
    if (!usuarioId) {
      throw new Exception('El id del usuario es requerido');
    }
    if (!arrInputs) {
      throw new Exception('El estado del input es requerido');
    }
    if (!tituloSeccion) {
      throw new Exception('El titulo es requerido');
    }
    if (!tramiteId) {
      throw new Exception('El id del trámite es requerido');
    }

    let flag: EstadoInput = EstadoInput.pending;
    let approvedCount = 0;

    for (let j = 0; j < arrInputs.length; j++) {
      const input = arrInputs[j];

      const inputStatus = input.estado;

      if (inputStatus === 'rejected') {
        flag = EstadoInput.rejected;
        break;
      }

      if (inputStatus === 'request') {
        flag = 'request';
      }

      if (inputStatus === 'sent' && flag !== 'request') {
        flag = 'sent';
      }

      if (inputStatus === 'approved') {
        approvedCount++;
      }
    }

    if (approvedCount === arrInputs.length) {
      flag = EstadoInput.approved;
    }

    if (esAdmin) {
      await this.create({
        titulo: 'Un trámite necesita aprobación',
        descripcion: `Un usuario modificó la información de la sección ${tituloSeccion} del trámite ${tramiteId}`,
        usuarioId,
        info: {
          tipo: 'tramite',
          tramiteId
        }
      });
    } else {
      await this.create({
        titulo: 'Trámite revisado',
        descripcion: getNotificationDescription({
          estado: flag,
          tituloSeccion,
          tramiteId
        }),
        usuarioId,
        info: {
          tipo: 'tramite',
          tramiteId
        }
      });
    }
  }

  async notificacionInputsExpediente({
    usuarioId,
    arrInputs,
    tituloSeccion,
    expedienteId,
    esAdmin
  }: {
    usuarioId: number;
    arrInputs: IInputsValuesFiscalizacion[];
    tituloSeccion: string;
    expedienteId: number;
    esAdmin: boolean;
  }) {
    if (!usuarioId) {
      throw new Exception('El id del usuario es requerido');
    }
    if (!arrInputs) {
      throw new Exception('El estado del input es requerido');
    }
    if (!tituloSeccion) {
      throw new Exception('El título es requerido');
    }
    if (!expedienteId) {
      throw new Exception('El id del expediente es requerido');
    }

    let flag: EstadoInput = EstadoInput.pending;
    let approvedCount = 0;

    for (let j = 0; j < arrInputs.length; j++) {
      const input = arrInputs[j];

      const inputStatus = input.estado;

      if (inputStatus === 'rejected') {
        flag = EstadoInput.rejected;
        break;
      }

      if (inputStatus === 'request') {
        flag = 'request';
      }

      if (inputStatus === 'sent' && flag !== 'request') {
        flag = 'sent';
      }

      if (inputStatus === 'approved') {
        approvedCount++;
      }
    }

    if (approvedCount === arrInputs.length) {
      flag = EstadoInput.approved;
    }

    if (esAdmin) {
      await this.create({
        titulo: 'Un trámite necesita aprobacián',
        descripcion: `Un usuario modificó la información de la sección ${tituloSeccion} del expediente ${expedienteId}`,
        usuarioId,
        info: {
          tipo: 'expediente',
          expedienteId
        }
      });
    } else {
      await this.create({
        titulo: 'Trámite revisado',
        descripcion: getNotificationDescriptionExpediente({
          estado: flag,
          tituloSeccion,
          expedienteId
        }),
        usuarioId,
        info: {
          tipo: 'tramite',
          expedienteId
        }
      });
    }
  }

  async notificarEmpleado({
    jefeId,
    encargadoId,
    tramiteId,
    esJefe
  }: {
    jefeId: number;
    encargadoId: number;
    tramiteId: number;
    esJefe: boolean;
  }) {
    if (!jefeId) {
      throw new Exception('El id del jefe es requerido');
    }

    if (!encargadoId) {
      throw new Exception('El id del encargado es requerido');
    }
    if (!tramiteId) {
      throw new Exception('El id del trámite es requerido');
    }

    let jefe = await usersServices.findById(jefeId);

    if (!jefe) {
      throw new Exception('No se encontró al jefe');
    }

    let empleado = await usersServices.findById(encargadoId);

    if (!empleado) {
      throw new Exception('No se encontró al empleado');
    }

    if (esJefe) {
      await this.create({
        titulo: 'Se te ha asignado un trámite',
        descripcion: `${jefe.nombre} ${jefe.apellido} te ha asignado el trámite ${tramiteId}.`,
        usuarioId: encargadoId,
        info: {
          tipo: 'tramite',
          tramiteId
        }
      });
    } else {
      await this.create({
        titulo: 'Se ha devuelto un trámite asignado',
        descripcion: `${empleado.nombre} ${empleado.apellido} ha devuelto el trámite ${tramiteId}.`,
        usuarioId: jefeId,
        info: {
          tipo: 'tramite',
          tramiteId
        }
      });
    }
  }

  async notificarEmpleadoExpediente({
    jefeId,
    encargadoId,
    expedienteId,
    esJefe
  }: {
    jefeId: number;
    encargadoId: number;
    expedienteId: number;
    esJefe: boolean;
  }) {
    if (!jefeId) {
      throw new Exception('El id del jefe es requerido');
    }

    if (!encargadoId) {
      throw new Exception('El id del encargado es requerido');
    }
    if (!expedienteId) {
      throw new Exception('El id del expediente es requerido');
    }

    let jefe = await usersServices.findById(jefeId);

    if (!jefe) {
      throw new Exception('No se encontró al jefe');
    }

    let empleado = await usersServices.findById(encargadoId);

    if (!empleado) {
      throw new Exception('No se encontró al empleado');
    }

    if (esJefe) {
      await this.create({
        titulo: 'Se te ha asignado un expediente',
        descripcion: `${jefe.nombre} ${jefe.apellido} te ha asignado el expediente ${expedienteId}.`,
        usuarioId: encargadoId,
        info: {
          tipo: 'tramite',
          expedienteId
        }
      });
    } else {
      await this.create({
        titulo: 'Se ha devuelto un expediente asignado',
        descripcion: `${empleado.nombre} ${empleado.apellido} ha devuelto el expediente ${expedienteId}.`,
        usuarioId: jefeId,
        info: {
          tipo: 'expediente',
          expedienteId
        }
      });
    }
  }
}

export default new NotificacionValidator();
