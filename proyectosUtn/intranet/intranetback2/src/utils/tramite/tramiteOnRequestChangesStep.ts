import { ITramite } from '../../interfaces/tramite.interface';
import tramiteServices from '../../services/tramite.services';
import tramiteValidators from '../../validators/tramite.validators';
import { notificacionMail } from '../enviarEmail';
import tramiteActionStep from './tramiteActionStep';

export const tramiteOnRequestChangesStep = async (tramite: ITramite) => {
  const pasos = tramite.tipo.pasos;
  const actions = pasos[tramite.pasoActual].onRequestChanges;

  if (actions) {
    for (const item of actions) {
      const [action, tipo] = item.split('/');
      switch (action) {
        case 'goTo':
          await tramiteServices.update(tramite.id, {
            pasoActual: Number(tipo)
          });

          const tramiteDB = await tramiteValidators.getByIdForAction(
            tramite.id
          );

          if (tramiteDB) {
            await tramiteActionStep(tramiteDB);
          }

          break;

        default:
          break;
      }
    }
  }
};
