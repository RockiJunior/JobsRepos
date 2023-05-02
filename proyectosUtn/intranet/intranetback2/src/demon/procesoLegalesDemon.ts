import dayjs from 'dayjs';
import prisma from '../config/db';

export const procesoLegalesDemon = async (now: any) => {
  const ProcesoLegalIniciadoYExpiracion = await prisma.procesoLegales.findMany({
    where: {
      NOT: {
        AND: [
          { estado: 'finalizado' },
          { estado: 'cancelado' },
          { estado: 'desestimado' }
        ],
        expiracion: null
      }
    }
  });

  const ProcesoLegalesVencidos = ProcesoLegalIniciadoYExpiracion.filter(
    (procesolegal) => {
      const fechaVencimiento = dayjs(procesolegal.expiracion);
      return fechaVencimiento.isBefore(now);
    }
  );

  ProcesoLegalesVencidos.forEach(async (vencido) => {
    const proceso = vencido.id;
    await prisma.procesoLegales.update({
      where: {
        id: proceso
      },
      data: {
        estado: 'finalizado'
      }
    });
  });
};
