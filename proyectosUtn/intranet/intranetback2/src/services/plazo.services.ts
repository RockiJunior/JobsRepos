import dayjs from 'dayjs';
import prisma from '../config/db';
import { getDiasLaborales } from '../utils/getDiasLaborales';

class PlazoServices {
  async create({
    areas,
    dias,
    tramiteId,
    expedienteId,
    cedulaId
  }: {
    areas: string;
    dias: number;
    tramiteId?: number;
    expedienteId?: number;
    cedulaId?: number;
  }) {
    const hoy = new Date();
    return prisma.plazo.create({
      data: {
        fechaInicio: hoy,
        fechaVencimiento: dayjs()
          .add(await getDiasLaborales(dias, hoy), 'day')
          .toDate(),
        areas,
        tramiteId,
        expedienteId,
        cedulaId
      }
    });
  }

  finish(id: number) {
    return prisma.plazo.update({
      where: {
        id
      },
      data: {
        fechaFinalizacion: new Date()
      }
    });
  }
}

export default new PlazoServices();
