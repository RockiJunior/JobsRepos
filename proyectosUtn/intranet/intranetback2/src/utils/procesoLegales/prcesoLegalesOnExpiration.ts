import { EstadoProcesoLegales } from '@prisma/client';
import prisma from '../../config/db';
import procesoLegalesPasos from '../../data/procesoLegales';
import {
  IExpediente,
  IProcesoLegales
} from '../../interfaces/expediente.interface';
import expedienteServices from '../../services/expediente.services';
import procesoLegalesServices from '../../services/procesoLegales.services';
import expedienteValidators from '../../validators/expediente.validators';
import ProcesolegalActionStep from './procesoLegalesActionStep';

export const procesoLegalesOnExpiration = async (
  procesoLegales: IProcesoLegales
) => {
  // const pasos = expediente.tipo.pasos;
  // const actions = pasos[expediente.pasoActual].onExpiration;
  const actions = procesoLegalesPasos[procesoLegales.pasoActual].onExpiration;

  if (actions) {
    for (const item of actions) {
      const [action, tipo] = item.split('/');
      switch (action) {
        // case 'startExpediente':
        //   await expedienteValidators.create(
        //     Number(tipo),
        //     expediente.carpetaId,
        //     expediente.id
        //   );
        //   break;

        case 'goTo':
          await procesoLegalesServices.update(procesoLegales.id, {
            pasoActual: Number(tipo)
          });

          const procesoLegalesDB = await procesoLegalesServices.findById(
            procesoLegales.id
          );

          if (procesoLegalesDB) {
            await ProcesolegalActionStep(procesoLegalesDB);
          }

          break;

        case 'changeStatus':
          const estado = tipo as EstadoProcesoLegales;
          await prisma.procesoLegales.update({
            where: {
              id: procesoLegales.id
            },
            data: {
              estado
            }
          });
          break;

        default:
          break;
      }
    }
  }
};
