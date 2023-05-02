import prisma from '../config/db';

class DisponibilidadService {
  async byAreaId(areaId: number) {
    return prisma.disponibilidad.findMany({
      where: {
        areaId
      }
    });
  }

  async create(
    areaId: number,
    nombre: string,
    inicio: Date,
    fin: Date,
    lun: any,
    mar: any,
    mie: any,
    jue: any,
    vie: any,
    sab: any,
    dom: any
  ) {
    return prisma.disponibilidad.create({
      data: {
        nombre,
        areaId,
        inicio,
        fin,
        lun,
        mar,
        mie,
        jue,
        vie,
        sab,
        dom
      }
    });
  }

  async update(id: number, data: any) {
    return prisma.disponibilidad.update({
      where: {
        id: id
      },
      data
    });
  }

  async delete(id: number) {
    return prisma.disponibilidad.delete({
      where: {
        id
      }
    });
  }

  async getDisponibilidadBetweenDates({ areaId, inicio, fin }: { areaId: number, inicio: Date, fin: Date }) {
    return prisma.disponibilidad.findMany({
      where: {
        areaId,
        OR: [
          {
            AND: [
              {
                inicio: {
                  lte: inicio
                }
              },
              {
                inicio: {
                  lte: fin
                }
              },
              {
                fin: {
                  gte: inicio
                }
              },
              {
                fin: {
                  gte: fin
                }
              }
            ]
          },
          {
            AND: [
              {
                inicio: {
                  gte: inicio
                }
              },
              {
                inicio: {
                  lte: fin
                }
              },
              {
                fin: {
                  gte: inicio
                }
              },
              {
                fin: {
                  lte: fin
                }
              }
            ]
          },
          {
            AND: [
              {
                inicio: {
                  lte: inicio
                }
              },
              {
                inicio: {
                  lte: fin
                }
              },
              {
                fin: {
                  gte: inicio
                }
              },
              {
                fin: {
                  lte: fin
                }
              }
            ]
          },
          {
            AND: [
              {
                inicio: {
                  gte: inicio
                }
              },
              {
                inicio: {
                  lte: fin
                }
              },
              {
                fin: {
                  gte: inicio
                }
              },
              {
                fin: {
                  gte: fin
                }
              }
            ]
          }
        ]
      }
    });
  }
}

export default new DisponibilidadService();
