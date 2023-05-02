import { IInput, ISeccion, ITramite } from '../interfaces/tramite.interface';
import empleadoServices from '../services/empleado.services';
import usersValidator from '../validators/users.validator';
import Exception from './Exception';

export const checkPasoSiguiente = async (
  tramite: ITramite,
  usuarioId: number
) => {
  const paso = tramite.tipo.pasos[tramite.pasoActual];
  const action = paso.actions?.find((a) => a.startsWith('canGoNextStep/'));

  if (action) {
    const [_, info] = action.split('/');
    const [areaId, condition] = info.split('_');
    const conditions = condition?.split(':');

    const empleado = await empleadoServices.findById(usuarioId);

    if (!empleado || empleado.areaId !== Number(areaId)) {
      throw new Exception('No tiene permisos para realizar esta acción');
    }

    if (conditions) {
      let acc = 0;
      for (const condicion of conditions) {
        switch (condicion) {
          case 'allRequiredFilled':
            let allRequiredFilled = true;

            const iterateInputsRequired = (
              inputs: IInput[],
              seccion: ISeccion
            ) => {
              inputs.forEach((input) => {
                const requerido = input.requerido;
                const inputValue = input.InputValues;

                if (
                  (!inputValue &&
                    requerido.some(
                      (r: any) =>
                        r === true ||
                        seccion.inputs.some(
                          (i: any) =>
                            i.nombre === r &&
                            i.InputValues?.value &&
                            i.InputValues.value !== 'false'
                        )
                    )) ||
                  (inputValue &&
                    !inputValue.value &&
                    !inputValue.archivos.length &&
                    requerido.some(
                      (r: any) =>
                        r === true ||
                        seccion.inputs.some(
                          (i: any) =>
                            i.nombre === r &&
                            i.InputValues?.value &&
                            i.InputValues.value !== 'false'
                        )
                    ))
                ) {
                  allRequiredFilled = false;
                }
              });
            };

            tramite.tipo.secciones
              .filter((s: any) => s.tipo === tramite.tipoSeccion || !s.tipo)
              .forEach((seccion: any) => {
                iterateInputsRequired(seccion.inputs, seccion);
              });

            if (allRequiredFilled) {
              acc++;
            } else {
              throw new Exception(
                'Debes completar todos los campos requeridos'
              );
            }
            break;

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
              } else {
                throw new Exception(
                  'Debes agregar una o más resoluciones en este paso'
                );
              }
            }
            break;

          case 'cedulaElectronica':
            if (tramite.carpeta?.usuarioId) {
              const usuario = await usersValidator.getById(
                tramite.carpeta.usuarioId
              );
              if (usuario.recepcionCedula === 'electronica') {
                acc++;
              } else {
                throw new Exception(
                  'No se puede continuar, el matriculado debe estar adherido a la cédula electrónica'
                );
              }
            }
            break;

          default:
            break;
        }
      }
      if (acc !== conditions.length) {
        throw new Exception('No puedes ir al siguiente paso');
      }
    }
  } else {
    throw new Exception('No tiene permisos para realizar esta acción');
  }
};
