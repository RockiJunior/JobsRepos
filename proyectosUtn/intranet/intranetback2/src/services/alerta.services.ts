import prisma from '../config/db';

class AlertaService {
  create({
    mensaje,
    fecha,
    areaId,
    empleadoId
  }: {
    mensaje: string;
    fecha: Date;
    areaId?: number;
    empleadoId?: number;
  }) {
    return prisma.alerta.create({
      data: {
        mensaje,
        fecha,
        areaId,
        empleadoId
      }
    });
  }
}

export default new AlertaService();
