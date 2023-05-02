import { Fiscalizacion } from '@prisma/client';
import prisma from '../config/db';

class FiscalizacionService {
  create(titulo: string, tipoId: number, expedienteId: number) {
    return prisma.fiscalizacion.create({
      data: {
        titulo,
        tipoId,
        expedienteId
      },
      include: {
        tipo: {
          include: {
            secciones: {
              include: {
                inputs: true
              }
            }
          }
        },
        archivos: true
      }
    });
  }

  findById(id: number) {
    return prisma.fiscalizacion.findUnique({
      where: {
        id
      },
      include: {
        transaccion: true,
        informeFiscalizacion: true,
        expediente: true,
        declaracionJurada: true
      }
    });
  }

  update({ id, data }: { id: number; data: Partial<Fiscalizacion> }) {
    return prisma.fiscalizacion.update({
      where: {
        id
      },
      data
    });
  }
}

export default new FiscalizacionService();
