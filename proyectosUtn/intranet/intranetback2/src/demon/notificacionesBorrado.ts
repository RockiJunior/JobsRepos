import dayjs from 'dayjs';
import prisma from '../config/db';

export const borrarNotificaciones = async () => {
  try {
    const notificaciones = await prisma.notificacion.findMany({
      where: {
        leido: {
          lte: dayjs().subtract(2, 'day').toDate()
        }
      }
    });
    await prisma.notificacion.deleteMany({
      where: {
        id: {
          in: notificaciones.map((notificacion) => notificacion.id)
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
};
