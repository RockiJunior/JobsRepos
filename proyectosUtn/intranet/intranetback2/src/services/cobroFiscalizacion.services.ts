import { CobroFiscalizacion } from '@prisma/client';
import prisma from '../config/db';

class CobroFiscalizacionService {
  findById(id: number) {
    return prisma.cobroFiscalizacion.findUnique({
      where: {
        id
      },
      include: {
        CobroConcepto: {
          include: {
            concepto: true
          }
        }
      }
    });
  }

  create(fiscalizacionId: number) {
    return prisma.cobroFiscalizacion.create({
      data: {
        fiscalizacionId
      }
    });
  }

  async update({ id, conceptos }: { id: number; conceptos: number[] }) {
    const cobroFiscalizacion = await this.findById(id);

    if (!cobroFiscalizacion) {
      throw new Error('El cobro no existe');
    }

    const conceptosToDelete = cobroFiscalizacion.CobroConcepto.filter(
      (concepto) => !conceptos.includes(concepto.conceptoId)
    );

    const conceptosToCreate = conceptos.reduce(
      (acc: { id: number; cantidad: number }[], concepto) => {
        const conceptoExistente = acc.find((c) => c.id === concepto);
        if (conceptoExistente) {
          conceptoExistente.cantidad += 1;
        } else {
          acc.push({ id: concepto, cantidad: 1 });
        }
        return acc;
      },
      []
    );

    if (conceptosToDelete.length) {
      await prisma.cobroFiscalizacion.update({
        where: {
          id
        },
        data: {
          CobroConcepto: {
            deleteMany: {
              cobroFiscalizacionId: id,
              conceptoId: {
                in: conceptosToDelete.map((concepto) => concepto.conceptoId)
              }
            }
          }
        }
      });
    }

    if (conceptosToCreate.length) {
      await prisma.cobroFiscalizacion.update({
        where: {
          id
        },
        data: {
          CobroConcepto: {
            upsert: conceptosToCreate.map((concepto) => ({
              create: {
                conceptoId: concepto.id
              },
              update: {
                conceptoId: concepto.id,
                cantidad: concepto.cantidad
              },
              where: {
                cobroFiscalizacionId_conceptoId: {
                  cobroFiscalizacionId: id,
                  conceptoId: concepto.id
                }
              }
            }))
          }
        }
      });
    }

    return this.findById(id);
  }

  delete(id: number) {
    return prisma.cobroFiscalizacion.delete({
      where: {
        id
      }
    });
  }
}

export default new CobroFiscalizacionService();
