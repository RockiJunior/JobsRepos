import prisma from '../../config/db';
import { ITramite } from '../../interfaces/tramite.interface';
import tramiteValidators from '../../validators/tramite.validators';
import usersValidator from '../../validators/users.validator';
import tramiteActionStep from './tramiteActionStep';

async function tramiteGoTo(tramite: ITramite, usuarioEvento?: any) {
  const pasos = tramite.tipo.pasos;
  const conditions = pasos[tramite.pasoActual].goto;

  if (conditions) {
    for (const item of conditions) {
      const [action, info] = item.split('/');
      switch (action) {
        case 'interno':
          const seccion = tramite.tipo.secciones.find(
            (seccion: any) => seccion.tipo === 'interno'
          );
          if (seccion) {
            const inputs = seccion.inputs;
            const [nombre, valor, paso] = info.split('_');
            const input = inputs.find((input: any) => input.nombre === nombre);
            if (input) {
              if (input.InputValues?.value === valor) {
                await prisma.tramite.update({
                  where: {
                    id: tramite.id
                  },
                  data: {
                    pasoActual: Number(paso)
                  }
                });

                const newTramite = await tramiteValidators.getByIdForAction(
                  tramite.id
                );

                await tramiteActionStep(newTramite);

                break;
              }
            }
          }
          break;

        case 'allRequiredFilled':
          let allRequiredFilled = true;

          tramite.tipo.secciones
            .filter((s: any) => s.tipo === tramite.tipoSeccion || !s.tipo)
            .forEach((seccion: any) => {
              seccion.inputs.forEach((input: any) => {
                const requerido = input.requerido as any;
                const inputValue = input.InputValues as any;

                if (
                  (!inputValue &&
                    requerido.some(
                      (r: any) =>
                        r === true ||
                        seccion.inputs.some(
                          (i: any) => i.nombre === r && i.InputValues?.value
                        )
                    )) ||
                  (inputValue &&
                    !inputValue.value &&
                    !inputValue.archivo.archivoUbicacion &&
                    requerido.some(
                      (r: any) =>
                        r === true ||
                        seccion.inputs.some(
                          (i: any) => i.nombre === r && i.InputValues?.value
                        )
                    ))
                ) {
                  allRequiredFilled = false;
                }
              });
            });

          if (allRequiredFilled) {
            await prisma.tramite.update({
              where: {
                id: tramite.id
              },
              data: {
                pasoActual: Number(info)
              }
            });

            const newTramite = await tramiteValidators.getByIdForAction(
              tramite.id
            );

            await tramiteActionStep(newTramite);
          }

          break;

        case 'allAreasApproved':
          const areas = tramite.areas.filter((area: any) => !area.deleted);
          let accArea = 0;

          areas.forEach((area: any) => {
            if (area.status === 'approved') {
              accArea++;
            }
          });

          if (accArea === areas.length) {
            await prisma.tramite.update({
              where: {
                id: tramite.id
              },
              data: {
                pasoActual: Number(info)
              }
            });

            const newTramite = await tramiteValidators.getByIdForAction(
              tramite.id
            );

            await tramiteActionStep(newTramite);
          }
          break;

        case 'allInputsApproved':
          let allApproved = true;
          const iterateInputsApproved = (inputs: any) => {
            inputs.forEach((input: any) => {
              const inputValue = input.InputValues as any;

              if (inputValue && inputValue.estado !== 'approved') {
                allApproved = false;
              }

              if (input.hijos) {
                iterateInputsApproved(input.hijos);
              }
            });
          };

          tramite.tipo.secciones
            .filter((s: any) => s.tipo === tramite.tipoSeccion || !s.tipo)
            .forEach((seccion: any) => {
              iterateInputsApproved(seccion.inputs);
            });

          if (allApproved) {
            await prisma.tramite.update({
              where: {
                id: tramite.id
              },
              data: {
                pasoActual: Number(info)
              }
            });
            const newTramite = await tramiteValidators.getByIdForAction(
              tramite.id
            );

            await tramiteActionStep(newTramite);
          }
          break;

        case 'tipoCedula':
          if (tramite.carpeta?.usuarioId) {
            const usuario = await usersValidator.getById(
              tramite.carpeta.usuarioId
            );
            if (usuario) {
              const tipoCedula = usuario.recepcionCedula;
              const [cedulaRequerida, paso] = info.split('_');
              if (tipoCedula === cedulaRequerida) {
                await prisma.tramite.update({
                  where: {
                    id: tramite.id
                  },
                  data: {
                    pasoActual: Number(paso)
                  }
                });
                const newTramite = await tramiteValidators.getByIdForAction(
                  tramite.id
                );
                await tramiteActionStep(newTramite);
              }
            }
          } else {
            ('Es Usuario externo a CUCICBA');
          }

          break;

        case 'eventApproved':
          const [tipo, paso] = info.split('_');
          if (
            usuarioEvento.evento.tipoEvento.nombre === tipo &&
            usuarioEvento.estado === 'aprobado'
          )
            await prisma.tramite.update({
              where: {
                id: tramite.id
              },
              data: {
                pasoActual: Number(paso)
              }
            });
          const newTramite = await tramiteValidators.getByIdForAction(
            tramite.id
          );
          await tramiteActionStep(newTramite);
          break;
        default:
          break;
      }
    }
  }
}

export default tramiteGoTo;
