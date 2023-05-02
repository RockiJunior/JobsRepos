import tramites from '../../data/tramites';
import { ITramite } from '../../interfaces/tramite.interface';
import Exception from '../Exception';

export const tramiteCheckHasBeforeApprove = async (tramite: ITramite) => {
  const paso = tramite.tipo.pasos[tramite.pasoActual];
  const nextConditions = paso.nextConditions?.filter((c) => c.includes('has'));

  if (nextConditions) {
    let acc = 0;

    for (const condicion of nextConditions) {
      const [splitCondition, type] = condicion.split('/');

      switch (splitCondition) {
        case 'hasCedula':
          if (tramite.cedulas) {
            const tiene = tramite.cedulas.some(
              (cedula) => tramite.pasoActual === cedula.pasoCreacion
            );
            if (tiene) {
              acc++;
            } else {
              throw new Exception(
                'Debes agregar una o más cédulas en este paso'
              );
            }
          }
          break;

        case 'hasIntimacion':
          if (tramite.intimacion) {
            const tiene = tramite.intimacion.some(
              (intimacion) => tramite.pasoActual === intimacion.paso
            );

            // Arreglo temporal DEMO:______________________________
            if (
              tramite.tipoId === tramites.ddjjActividadComercial &&
              tramite.pasoActual === 7
            ) {
              return true;
            }
            //____________________________________________________

            if (tiene) {
              acc++;
            } else {
              throw new Exception(
                'Debes agregar una o más intimaciones en este paso'
              );
            }
          }

          break;

        case 'hasInforme':
          if (tramite.informe) {
            const tiene = tramite.informe.some(
              (informe) => tramite.pasoActual === informe.paso
            );

            if (tiene) {
              acc++;
            } else {
              throw new Exception(
                'Debes agregar uno o más informes en este paso'
              );
            }
          }
          break;

        case 'hasArchivo':
          if (tramite.archivos) {
            const tiene = tramite.archivos.some(
              (archivo) => tramite.pasoActual === archivo.paso
            );
            if (tiene) {
              acc++;
            } else {
              throw new Exception(
                'Debes agregar uno o más archivos en este paso'
              );
            }
          }
          break;

        case 'hasDictamen':
          if (tramite.dictamen) {
            const tiene = tramite.dictamen.some(
              (d) => tramite.pasoActual === d.paso
            );
            if (tiene) {
              acc++;
            } else {
              throw new Exception(
                'Debes agregar uno o más dictamenes en este paso'
              );
            }
          }
          break;

        case 'hasExpediente':
          if (tramite.expedientesHijos) {
            const tiene = tramite.expedientesHijos.length;

            if (tiene) {
              acc++;
            } else {
              throw new Exception('Debes iniciar un expediente en este paso');
            }
          }

          break;

        case 'hasResolucion':
          if (tramite.resoluciones) {
            const tiene = tramite.resoluciones.some(
              (resolucion) => tramite.pasoActual === resolucion.paso
            );
            if (tiene) {
              acc++;
            }
          }
          break;
      }

      if (acc !== nextConditions.length) {
        throw new Exception('No puedes approbar el area');
      }
    }
  } else {
    return true;
  }
};
