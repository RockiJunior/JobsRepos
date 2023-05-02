import { DespachoImputacion, Imputacion } from '@prisma/client';
import prisma from '../config/db';

export class DespachoImputacionServices {
  findById(id: number) {
    return prisma.despachoImputacion.findUnique({
      where: {
        id
      },
      include: {
        imputaciones: true,
        procesoLegales: true
      }
    });
  }

  findByExpedienteId(procesoLegalesId: number) {
    return prisma.despachoImputacion.findFirst({
      where: {
        procesoLegalesId
      },
      include: {
        imputaciones: true
      }
    });
  }

  create({
    titulo,
    motivo,
    imputaciones,
    procesoLegalesId,
    paso,
    empleadoId
  }: {
    titulo: string;
    motivo: string;
    imputaciones: number[];
    procesoLegalesId: number;
    paso: number;
    empleadoId: number;
  }) {
    return prisma.despachoImputacion.create({
      data: {
        titulo,
        motivo,
        paso,
        empleado: {
          connect: {
            usuarioId: empleadoId
          }
        },
        imputaciones: {
          createMany: {
            data: imputaciones.map((imputacionId) => ({
              imputacionId
            }))
          }
        },
        procesoLegales: {
          connect: {
            id: procesoLegalesId
          }
        }
      },
      include: {
        imputaciones: true
      }
    });
  }

  update({
    id,
    titulo,
    motivo,
    imputaciones
  }: {
    id: number;
    titulo: string;
    motivo: string;
    imputaciones: number[];
  }) {
    return prisma.despachoImputacion.update({
      where: {
        id
      },
      data: {
        titulo,
        motivo,
        imputaciones: {
          deleteMany: {
            despachoImputacionId: id
          },
          createMany: {
            data: imputaciones.map((imputacionId) => ({
              imputacionId
            }))
          }
        }
      },
      include: {
        imputaciones: true
      }
    });
  }

  async delete(id: number) {
    await prisma.despachoImputacionToImputacion.deleteMany({
      where: {
        despachoImputacionId: id
      }
    });

    return prisma.despachoImputacion.delete({
      where: {
        id
      }
    });
  }

  getImputaciones() {
    return prisma.padreImputacion.findMany({
      include: {
        imputaciones: true
      },
      orderBy: {
        titulo: 'asc'
      }
    });
  }
}

export default new DespachoImputacionServices();
