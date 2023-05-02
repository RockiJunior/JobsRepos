import prisma from '../../config/db';
import procesoLegalesPasos from '../../data/procesoLegales';
import { IProcesoLegales } from '../../interfaces/expediente.interface';
import expedienteServices from '../../services/expediente.services';

export const procesoLegalesVolverAtras = async (
  procesoLegales: IProcesoLegales
) => {
  const pasos = procesoLegalesPasos;
  const onGoPrevStep = pasos[procesoLegales.pasoActual].onGoPrevStep;

  if (onGoPrevStep) {
    for (const action of onGoPrevStep) {
      const [condicion, paso] = action.split('/');
      switch (condicion) {
        case 'cucicba':
          const expediente = await expedienteServices.findById(
            procesoLegales.expedienteId
          );
          if (expediente) {
            if (expediente.denuncia?.nombreDenunciante === 'Cucicba') {
              await prisma.procesoLegales.update({
                where: {
                  id: procesoLegales.id
                },
                data: {
                  pasoActual: Number(paso)
                }
              });
            }
          }
          break;

        case 'noCucicba':
          const expte = await expedienteServices.findById(
            procesoLegales.expedienteId
          );
          if (expte) {
            if (expte.denuncia?.nombreDenunciante !== 'Cucicba') {
              await prisma.procesoLegales.update({
                where: {
                  id: procesoLegales.id
                },
                data: {
                  pasoActual: Number(paso)
                }
              });
            }
          }
          break;
        default:
          break;
      }
    }
  }
};
