import prisma from '../../config/db';
import { IPaso } from '../../interfaces/pasos.interface';
import plazoServices from '../../services/plazo.services';

async function cedulaActionStep(cedula: any) {
  const pasos = cedula.pasos as any as IPaso[];
  const actions = pasos[cedula.pasoActual].actions;
  let deletePreviousAreas = true;

  if (actions) {
    for (const item of actions) {
      const [action, tipo] = item.split('/');
      switch (action) {
        case 'sendTo':
          const area = await prisma.area.findUnique({
            where: {
              id: Number(tipo)
            }
          });

          if (area) {
            const areasObj = deletePreviousAreas
              ? {
                  updateMany: {
                    where: {
                      cedulaId: cedula.id
                    },
                    data: {
                      deleted: new Date()
                    }
                  },
                  upsert: {
                    where: {
                      areaId_cedulaId: {
                        areaId: area.id,
                        cedulaId: cedula.id
                      }
                    },
                    update: {
                      deleted: null
                    },
                    create: {
                      areaId: area.id
                    }
                  }
                }
              : {
                  upsert: {
                    where: {
                      areaId_cedulaId: {
                        areaId: area.id,
                        cedulaId: cedula.id
                      }
                    },
                    update: {
                      deleted: null
                    },
                    create: {
                      areaId: area.id
                    }
                  }
                };

            await prisma.cedulaNotificacion.update({
              where: {
                id: cedula.id
              },
              data: {
                areas: areasObj
              }
            });

            deletePreviousAreas = false;
          }

          break;

        case 'startPlazo':
          const [dias, areas] = tipo.split('_');
          await plazoServices.create({
            areas,
            dias: Number(dias),
            cedulaId: cedula.id
          });
          break;

        default:
          break;
      }
    }
  }
}

export default cedulaActionStep;
