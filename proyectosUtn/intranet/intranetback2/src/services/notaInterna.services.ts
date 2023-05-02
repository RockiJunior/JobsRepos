import { NotaInterna } from '@prisma/client';
import { Exception } from 'handlebars';
import prisma from '../config/db';

class NotaInternaSercive {
  getById(id: number) {
    return prisma.notaInterna.findUnique({
      where: {
        id
      }
    });
  }

  create({
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
    const ids = [
      tramiteId,
      expedienteId,
      cedulaId,
      fiscalizacionId,
      procesoLegalesId
    ].filter((i) => i);

    if (!ids.length) {
      throw new Exception(
        'La nota debe pertenecer a un tramite, expediente o cedula'
      );
    }

    if (ids.length > 1) {
      throw new Exception(
        'La nota no puede pertenecer a muchos modelos al mismo tiempo'
      );
    }

    return prisma.notaInterna.create({
      data: {
        descripcion,
        tramiteId,
        expedienteId,
        empleadoId,
        cedulaId,
        fiscalizacionId,
        procesoLegalesId
      }
    });
  }

  update({ id, data }: { id: number; data: Partial<NotaInterna> }) {
    return prisma.notaInterna.update({
      where: {
        id
      },
      data
    });
  }

  delete(id: number) {
    return prisma.notaInterna.update({
      where: {
        id
      },
      data: {
        deletedAt: new Date()
      }
    });
  }
}

export default new NotaInternaSercive();
