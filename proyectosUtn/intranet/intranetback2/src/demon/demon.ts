import schedule from 'node-schedule';
import dayjs from 'dayjs';
import { tramiteDemon } from './tramiteDemon';
import { borrarNotificaciones } from './notificacionesBorrado';
import { procesoLegalesDemon } from './procesoLegalesDemon';

const demon = async () => {
  const startTime = performance.now();
  const now = dayjs();
  try {
    await tramiteDemon(now);
    await borrarNotificaciones();
    await procesoLegalesDemon(now);
  } catch (error) {
    console.log(error);
  }

  const endTime = performance.now();

  console.log(
    `Call to checkDeadline took ${Math.floor(endTime - startTime)} milliseconds`
  );
};

schedule.scheduleJob('* * */1 * *', () => {
  demon();
});
