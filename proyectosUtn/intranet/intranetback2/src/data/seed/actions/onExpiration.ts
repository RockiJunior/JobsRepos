import { EstadoProcesoLegales } from '@prisma/client';

export const onExpiration = {
  goTo: (paso: number) => `goTo/${paso}`,
  startExpediente: (areaInicial: number) => `startExpediente/${areaInicial}`,
  changeStatus: (estado: EstadoProcesoLegales) => `changeStatus/${estado}`
};
