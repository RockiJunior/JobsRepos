import { ProcesoLegales } from '@prisma/client';
import prisma from '../config/db';

class ProcesoLegalesService {
  findById(id: number) {
    return prisma.procesoLegales.findUnique({
      where: {
        id
      },
      include: {
        expediente: true,
        cedulas: true,
        resoluciones: true,
        fallos: true,
        notas: true,
        archivos: true,
        dictamen: true,
        despachoImputacion: true,
        turnos: {
          orderBy: {
            inicio: 'desc'
          }
        },
        historial: true 
      }
    });
  }

  create(expedienteId: number) {
    return prisma.procesoLegales.create({
      data: {
        expedienteId
      }
    });
  }

  update(procesoLegalesId: number, data: Partial<ProcesoLegales>) {
    return prisma.procesoLegales.update({
      where: {
        id: procesoLegalesId
      },
      data: {
        pasoActual: data.pasoActual
      }
    });
  }

  cancelarProcesoLegales(procesoLegalesId: number) {
    return prisma.procesoLegales.update({
      where: {
        id: procesoLegalesId
      },
      data: {
        estado: 'cancelado',
        fechaFin: new Date()
      }
    });
  }

  deleteAllAreas(id: number) {
    return prisma.expediente.update({
      where: {
        id
      },
      data: {
        areas: {
          updateMany: {
            where: {
              expedienteId: id
            },
            data: {
              deleted: new Date()
            }
          }
        }
      }
    });
  }

  findFamilia(id: number) {
    return prisma.procesoLegales.findUnique({
      where: {
        id
      },
      include: {
        expediente: true
      }
    });
  }
}

export default new ProcesoLegalesService();
