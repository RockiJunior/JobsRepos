import tramites from '../../data/tramites';
import { ITramite } from '../../interfaces/tramite.interface';
import carpetaServices from '../../services/carpeta.services';
import expedienteValidators from '../../validators/expediente.validators';
import { createDenuncia } from './createDenuncia';
import areasObj from '../../data/areas';

export const tramiteOnExpiration = async (tramite: ITramite) => {
  const pasos = tramite.tipo.pasos;
  const actions = pasos[tramite.pasoActual].onExpiration;

  if (actions) {
    for (const item of actions) {
      const [action, tipo] = item.split('/');
      switch (action) {
        case 'startExpediente':
          let expediente;
          if (tramite.tipo.tipo === 'denuncia') {
            const denuncia = await createDenuncia({
              tramite: tramite,
              esCucicba:
                tramite.tipoId === tramites.denunciaCucicbaFiscalizacion
            });

            if (tramite.info.denunciado) {
              let carpetaDenunciado = await carpetaServices.findCarpetaActiva(
                tramite.info.denunciado
              );

              if (!carpetaDenunciado) {
                carpetaDenunciado = await carpetaServices.create({
                  usuarioId: tramite.info.denunciado,
                  descripcion: 'Carpeta de trámites'
                });
              }

              if (carpetaDenunciado) {
                expediente = await expedienteValidators.create({
                  areaId: areasObj.legales,
                  carpetaId: carpetaDenunciado.id,
                  tramitePadreId: tramite.id,
                  denunciaId: denuncia.id,
                  isDenuncia: true
                });
              } else {
                expediente = await expedienteValidators.create({
                  areaId: areasObj.fiscalizacion,
                  tramitePadreId: tramite.id,
                  denunciaId: denuncia.id,
                  isDenuncia: true
                });
              }
            } else {
              expediente = await expedienteValidators.create({
                areaId: areasObj.fiscalizacion,
                tramitePadreId: tramite.id,
                denunciaId: denuncia.id,
                isDenuncia: true
              });
            }
          } else {
            const denuncia = await createDenuncia({
              tramite: tramite,
              esCucicba: true
            });

            if (tramite.carpetaId) {
              expediente = await expedienteValidators.create({
                areaId: areasObj.legales,
                carpetaId: tramite.carpetaId,
                tramitePadreId: tramite.id,
                denunciaId: denuncia.id,
                isDenuncia: false
              });
            } else {
              expediente = await expedienteValidators.create({
                areaId: areasObj.fiscalizacion,
                tramitePadreId: tramite.id,
                isDenuncia: false,
                denunciaId: denuncia.id
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
