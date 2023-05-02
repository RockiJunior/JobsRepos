import procesoLegalesPasos from '../../data/procesoLegales';
import { IProcesoLegales } from '../../interfaces/expediente.interface';
import expedienteServices from '../../services/expediente.services';

const procesoLegalesCheckGotoNextStep = async (
  procesoLegales: IProcesoLegales
) => {
  const nextConditions =
    procesoLegalesPasos[procesoLegales.pasoActual].nextConditions;
  let acc = 0;

  if (nextConditions) {
    for (const item of nextConditions) {
      const [nextCondition, tipo] = item.split('/');

      switch (nextCondition) {
        case 'allAreasApproved':
          const expediente = await expedienteServices.findById(
            procesoLegales.expedienteId
          );
          if (!expediente) {
            throw new Error('Expediente no encontrado');
          }
          const areas = expediente.areas.filter((area: any) => !area.deleted);
          let accArea = 0;

          areas.forEach((area: any) => {
            if (area.status === 'approved') {
              accArea++;
            }
          });

          if (accArea === areas.length) {
            acc++;
          }
          break;

        case 'hasCedula':
          if (procesoLegales.cedulas) {
            const tiene = procesoLegales.cedulas.some(
              (cedula: any) => procesoLegales.pasoActual === cedula.pasoCreacion
            );
            if (tiene) {
              acc++;
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
            }
          }
          break;

        //   case 'allInputsApproved':
        //     let allApproved = true;

        //     const iterateInputsApproved = (inputs: IInput[]) => {
        //       inputs.forEach((input) => {
        //         const inputValue = input.inputValueExpediente;

        //         if (
        //           (inputValue && inputValue.estado !== 'approved') ||
        //           (!inputValue && input.requerido[0])
        //         ) {
        //           allApproved = false;
        //         }
        //       });
        //     };

        // expediente.tipo.seccionesExpediente.forEach((seccion: any) => {
        //   iterateInputsApproved(seccion.inputs);
        // });

        // if (allApproved) {
        //   acc++;
        // }
        // break;

        case 'hasFallo':
          if (procesoLegales.fallos) {
            const tiene = procesoLegales.fallos.some(
              (fallo) => procesoLegales.pasoActual === fallo.paso
            );
            if (tiene) {
              acc++;
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
            }
          }
          break;

        case 'hasImputacion':
          if (procesoLegales.despachoImputacion) {
            acc++;
          }

          break;

        case 'hasArchivo':
          if (procesoLegales.archivos) {
            const tiene = procesoLegales.archivos.some(
              (archivo) => procesoLegales.pasoActual === archivo.paso
            );
            if (tiene) {
              acc++;
            }
          }
          break;

        default:
          break;
      }
    }
  }

  return acc === nextConditions?.length;
};

export default procesoLegalesCheckGotoNextStep;
