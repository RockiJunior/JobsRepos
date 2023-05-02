import prisma from '../../config/db';
import procesoLegalesPasos from '../../data/procesoLegales';
import { IProcesoLegales } from '../../interfaces/expediente.interface';
import denunciaServices from '../../services/denuncia.services';
import procesoLegalesServices from '../../services/procesoLegales.services';
import ProcesolegalActionStep from './procesoLegalesActionStep';

async function procesoLegalGoTo(procesoLegales: IProcesoLegales) {
  const pasos = procesoLegalesPasos;
  const conditions = pasos[procesoLegales.pasoActual].goto;

  const expediente = await prisma.expediente.findUnique({
    where: {
      id: procesoLegales.expedienteId
    },
    include: {
      denuncia: true,
      areas: true
    }
  });

  if (conditions) {
    for (const item of conditions) {
      const [action, info] = item.split('/');
      switch (action) {
        case 'allAreasApproved':
          if (expediente) {
            const areas = expediente.areas.filter((area: any) => !area.deleted);
            let accArea = 0;

            areas.forEach((area: any) => {
              if (area.status === 'approved') {
                accArea++;
              }
            });

            if (accArea === areas.length) {
              await prisma.procesoLegales.update({
                where: {
                  id: procesoLegales.id
                },
                data: {
                  pasoActual: Number(info)
                }
              });

              const newProcesoLegal = await procesoLegalesServices.findById(
                procesoLegales.id
              );

              if (newProcesoLegal) {
                await ProcesolegalActionStep(newProcesoLegal);
              }
            }
          }
          break;
        // denunciante/cucicba_paso
        case 'denunciante':
          if (expediente) {
            const denuncia = await denunciaServices.findById(
              expediente.denunciaId
            );
            if (denuncia) {
              const denunciante = denuncia.nombreDenunciante;
              const [denuncianteRequerido, paso] = info.split('_');
              if (
                denuncianteRequerido === 'cucicba' &&
                denunciante === 'Cucicba'
              ) {
                await prisma.procesoLegales.update({
                  where: {
                    id: procesoLegales.id
                  },
                  data: {
                    pasoActual: Number(paso)
                  }
                });
                const newProcesoLegal = await procesoLegalesServices.findById(
                  procesoLegales.id
                );

                if (newProcesoLegal) {
                  await ProcesolegalActionStep(newProcesoLegal);
                }
              } else if (
                denuncianteRequerido === 'noCucicba' &&
                denunciante !== 'Cucicba'
              ) {
                await prisma.procesoLegales.update({
                  where: {
                    id: procesoLegales.id
                  },
                  data: {
                    pasoActual: Number(paso)
                  }
                });
                const newProcesoLegal = await procesoLegalesServices.findById(
                  procesoLegales.id
                );

                if (newProcesoLegal) {
                  await ProcesolegalActionStep(newProcesoLegal);
                }
              }
            }
          }
          break;

        default:
          break;
      }
    }
  }
}

export default procesoLegalGoTo;
