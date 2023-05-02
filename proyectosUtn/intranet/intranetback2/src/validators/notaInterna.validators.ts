import { NotaInterna } from '@prisma/client';
import notaInternaServices from '../services/notaInterna.services';
import Exception from '../utils/Exception';

class NotaInternaValidator {
  async getById(id: number) {
    if (!id) {
      throw new Exception('El id de usuario es requerido');
    }

    const notaInternaDB = await notaInternaServices.getById(id);

    if (!notaInternaDB) {
      throw new Exception('Nota interna no encontrada');
    }

    return notaInternaDB;
  }

  async create({
    descripcion,
    empleadoId,
    tramiteId,
    expedienteId,
    cedulaId,
    fiscalizacionId,
    procesoLegalesId
  }: {
    descripcion: string;
    empleadoId: number;
    tramiteId?: number;
    expedienteId?: number;
    cedulaId?: number;
    fiscalizacionId?: number;
    procesoLegalesId?: number;
  }) {
    if (!descripcion) {
      throw new Exception('La descripción es requerido');
    }

    if (!empleadoId) {
      throw new Exception('El id del empleado es requerido');
    }

    const notaInterna = await notaInternaServices.create({
      descripcion,
      empleadoId,
      tramiteId,
      expedienteId,
      cedulaId,
      fiscalizacionId,
      procesoLegalesId
    });

    return notaInterna;
  }

  async update({ id, data }: { id: number; data: Partial<NotaInterna> }) {
    if (!id) {
      throw new Exception('El id es requerido');
    }

    if (!data) {
      throw new Exception('Los datos son requeridos');
    }

    const notaInterna = await notaInternaServices.getById(id);

    if (!notaInterna) {
      throw new Exception('Nota interna no encontrado');
    }

    const notaUpdated = await notaInternaServices.update({ id, data });

    return notaUpdated;
  }

  async delete(id: number, usuarioId: number) {
    if (!id) {
      throw new Exception('El id de usuario es requerido');
    }
    const notaInterna = await notaInternaServices.getById(id);

    if (!notaInterna) {
      throw new Exception('Nota no encontrada');
    }

    if (notaInterna.empleadoId !== usuarioId) {
      throw new Exception('No tienes permisos para eliminar esta nota');
    }

    const notaDelete = await notaInternaServices.delete(id);

    return notaDelete;
  }
}

export default new NotaInternaValidator();
