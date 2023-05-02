import despachoImputacionServices from '../services/despachoImputacion.services';
import descpahoImputacionServices from '../services/despachoImputacion.services';
import empleadoServices from '../services/empleado.services';
import procesoLegalesServices from '../services/procesoLegales.services';
import Exception from '../utils/Exception';
import { denunciasPdf } from '../utils/pdf';
import { registroHistorial } from '../utils/registrarHistorial';

class DespachoImputacionValidator {
  async getById(id: number) {
    if (!id) {
      throw new Exception('El id del despacho de imputación es requerido');
    }

    const despachoImputacionDB = await descpahoImputacionServices.findById(id);

    if (!despachoImputacionDB) {
      throw new Exception('El despacho de imputación no existe');
    }

    return despachoImputacionDB;
  }

  async getByProcesoLegalesId(procesoLegalesId: number) {
    if (!procesoLegalesId) {
      throw new Exception('El id del expediente es requerido');
    }

    const despachoImputacionDB =
      await descpahoImputacionServices.findByExpedienteId(procesoLegalesId);

    if (!despachoImputacionDB) {
      throw new Exception('El despacho de imputación no existe');
    }

    return despachoImputacionDB;
  }

  async create({
    titulo,
    motivo,
    imputaciones,
    procesoLegalesId,
    usuarioId
  }: {
    titulo: string;
    motivo: string;
    imputaciones: number[];
    procesoLegalesId: number;
    usuarioId: number;
  }) {
    if (!titulo) {
      throw new Exception('El título es requerido');
    }

    if (!motivo) {
      throw new Exception('El motivo es requerido');
    }

    if (!imputaciones) {
      throw new Exception('Las imputaciones son requeridas');
    }

    if (!procesoLegalesId) {
      throw new Exception('El id del proceso es requerido');
    }

    if (!usuarioId) {
      throw new Exception('El id del empleado es requerido');
    }

    const empleado = await empleadoServices.findById(usuarioId);

    if (!empleado) {
      throw new Exception('El empleado no existe');
    }

    const procesoLegal = await procesoLegalesServices.findById(
      procesoLegalesId
    );

    if (!procesoLegal) {
      throw new Exception('El proceso legal no existe');
    }

    const despachoImputacionDB = await descpahoImputacionServices.create({
      titulo,
      motivo,
      imputaciones,
      procesoLegalesId,
      paso: procesoLegal.pasoActual,
      empleadoId: usuarioId
    });

    if (procesoLegal) {
      await registroHistorial({
        titulo: 'Imputaciones creadas',
        descripcion: `Se han creado las imputaciones en el Proceso Legal Nro <strong>${despachoImputacionDB.procesoLegalesId}</strong> en el área <strong>${empleado?.area?.nombre}</strong>`,
        usuarioId,
        expedienteId: procesoLegal.expedienteId,
        info: {
          procesoLegalId: procesoLegal.id,
          tipo: 'despachoImputacion'
        }
      });

      await registroHistorial({
        titulo: 'Imputaciones creadas',
        descripcion: `Se han creado las imputaciones en el Proceso Legal Nro <strong>${despachoImputacionDB.procesoLegalesId}</strong> en el área <strong>${empleado?.area?.nombre}</strong>`,
        usuarioId,
        expedienteId: procesoLegal.expedienteId,
        procesoLegalId: procesoLegal.id,
        info: {
          procesoLegalId: procesoLegal.id,
          tipo: 'despachoImputacion'
        }
      });

      await denunciasPdf(procesoLegal.id, 'imputaciones');
    }

    return despachoImputacionDB;
  }

  async update({
    id,
    titulo,
    motivo,
    imputaciones,
    usuarioId
  }: {
    id: number;
    titulo: string;
    motivo: string;
    imputaciones: number[];
    usuarioId: number;
  }) {
    if (!id) {
      throw new Exception('El id del despacho de imputación es requerido');
    }

    if (!titulo) {
      throw new Exception('El titulo es requerido');
    }

    if (!motivo) {
      throw new Exception('El motivo es requerido');
    }

    if (!imputaciones) {
      throw new Exception('Las imputaciones son requeridas');
    }

    if (!usuarioId) {
      throw new Exception('El id del empleado es requerido');
    }

    const empleado = await empleadoServices.findById(usuarioId);

    if (!empleado) {
      throw new Exception('El empleado no existe');
    }

    const imputacion = await descpahoImputacionServices.findById(id);
    if (!imputacion) {
      throw new Exception('El despacho de imputación no existe');
    }
    const procesoLegal = await procesoLegalesServices.findById(
      imputacion.procesoLegalesId
    );

    if (imputacion.paso === procesoLegal?.pasoActual) {
      const despachoImputacionDB = await descpahoImputacionServices.update({
        id,
        titulo,
        motivo,
        imputaciones
      });

      if (procesoLegal) {
        await registroHistorial({
          titulo: 'Imputaciones actualizadas',
          descripcion: `Se han actualizado las imputaciones en el Proceso Legal Nro <strong>${despachoImputacionDB.procesoLegalesId}</strong> en el área <strong>${empleado?.area?.nombre}</strong>`,
          usuarioId,
          expedienteId: procesoLegal.expedienteId,
          info: {
            procesoLegalId: procesoLegal.id,
            tipo: 'despachoImputacion'
          }
        });
      }
      await denunciasPdf(procesoLegal.id, 'imputaciones');
      return despachoImputacionDB;
    } else {
      throw new Exception(
        'No se puede actualizar el despacho de imputación porque el proceso legal ha avanzado de paso'
      );
    }
  }

  async delete(id: number) {
    if (!id) {
      throw new Exception('El id del despacho de imputación es requerido');
    }
    const imputacion = await despachoImputacionServices.findById(id);
    if (!imputacion) {
      throw new Exception('El despacho de imputación no existe');
    }
    const procesoLegal = await procesoLegalesServices.findById(
      imputacion.procesoLegalesId
    );
    if (imputacion.paso === procesoLegal?.pasoActual) {
      const despachoImputacionDB = await descpahoImputacionServices.delete(id);

      return despachoImputacionDB;
    } else {
      throw new Exception(
        'No se puede eliminar el despacho de imputación porque el proceso legal ha avanzado de paso'
      );
    }
  }

  async getImputaciones() {
    const imputaciones = await descpahoImputacionServices.getImputaciones();
    return imputaciones;
  }
}

export default new DespachoImputacionValidator();
