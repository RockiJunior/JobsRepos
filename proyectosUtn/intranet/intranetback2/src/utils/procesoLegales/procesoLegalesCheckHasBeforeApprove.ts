import procesoLegalesPasos from '../../data/procesoLegales';
import tramites from '../../data/tramites';
import { IProcesoLegales } from '../../interfaces/expediente.interface';
import Exception from '../Exception';

export const procesoLegalesCheckHasBeforeApprove = async (
  procesoLegales: IProcesoLegales
) => {
  const paso = procesoLegalesPasos[procesoLegales.pasoActual];
  const nextConditions = paso.nextConditions?.filter((c) => c.includes('has'));

  if (nextConditions) {
    let acc = 0;

    for (const condicion of nextConditions) {
      const [splitCondition, type] = condicion.split('/');

      switch (splitCondition) {
        case 'hasCedula':
          if (procesoLegales.cedulas) {
            const tiene = procesoLegales.cedulas.some(
              (cedula) => procesoLegales.pasoActual === cedula.pasoCreacion
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

        case 'hasArchivo':
          if (procesoLegales.archivos) {
            const tiene = procesoLegales.archivos.some(
              (archivo) => procesoLegales.pasoActual === archivo.paso
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
          if (procesoLegales.dictamen) {
            const tiene = procesoLegales.dictamen.some(
              (d) => procesoLegales.pasoActual === d.paso
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

        case 'hasResolucion':
          if (procesoLegales.resoluciones) {
            const tiene = procesoLegales.resoluciones.some(
              (resolucion) => procesoLegales.pasoActual === resolucion.paso
            );
            if (tiene) {
              acc++;
            } else {
              throw new Exception(
                'Debes agregar una o más resoluciones en este paso'
              );
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
