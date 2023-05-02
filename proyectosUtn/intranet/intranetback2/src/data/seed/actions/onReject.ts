import { EstadoProcesoLegales, EstadoTramite } from '@prisma/client';
import { notifyMailtype } from './types';

export const onReject = {
  goTo: (paso: number) => `goTo/${paso}`,
  sendTo: (area: number) => `sendTo/${area}`,
  changeStatus: (status: any) => `changeStatus/${status}`,
  startExpediente: (areaInicial: number) => `startExpediente/${areaInicial}`,
  notifyMail: (tipo: notifyMailtype) => `notifyMail/${tipo}`,
  generarCedula: (area: number, mail: 'mail' | 'nomail') =>
    `generarCedula/${area}_${mail}`
};
