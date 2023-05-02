import { IInput, ISeccion, ITramite } from '../../interfaces/tramite.interface';
import { condicionTransaccion } from './condicionTransaccion';

const tramiteCheckGotoNextStep = (
  tramite: ITramite,
  turnoId?: number,
  usuarioEvento?: any
) => {
  const pasos = tramite.tipo.pasos;
  const nextConditions = pasos[tramite.pasoActual].nextConditions;
  let acc = 0;

  if (nextConditions) {
    for (const item of nextConditions) {
      const [nextCondition, tipo] = item.split('/');

      switch (nextCondition) {
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
          }
          break;

        case 'allInputsSent':
          let allSent = true;

          const iterateInputsSent = (inputs: IInput[]) => {
            inputs.forEach((input) => {
              const inputValue = input.InputValues;

              if (
                (inputValue &&
                  inputValue.estado !== 'sent' &&
                  inputValue.estado !== 'approved') ||
                (!inputValue && input.requerido[0])
              ) {
                allSent = false;
              }
            });
          };

          tramite.tipo.secciones
            .filter((s: any) => s.tipo === tramite.tipoSeccion || !s.tipo)
            .forEach((seccion: any) => {
              iterateInputsSent(seccion.inputs);
            });

          if (allSent) {
            acc++;
          }
          break;

        case 'allInputsApproved':
          let allApproved = true;

          const iterateInputsApproved = (inputs: IInput[]) => {
            inputs.forEach((input) => {
              const inputValue = input.InputValues;

              if (
                (inputValue && inputValue.estado !== 'approved') ||
                (!inputValue && input.requerido[0])
              ) {
                allApproved = false;
              }
            });
          };

          tramite.tipo.secciones
            .filter((s: any) => s.tipo === tramite.tipoSeccion || !s.tipo)
            .forEach((seccion: any) => {
              iterateInputsApproved(seccion.inputs);
            });

          if (allApproved) {
            acc++;
          }
          break;

        case 'sentTransaction':
          const parseSent = JSON.parse(tipo).filter((t: any) =>
            t.condicion
              ? condicionTransaccion(tramite, t.nombre, t.condicion)[0]
              : true
          );

          const transaccionesSent = tramite.transacciones.filter((t) =>
            parseSent.some(
              (n: { nombre: string; condicion?: string }) =>
                (n.nombre === 'matriculacion2'
                  ? n.nombre === t.tipoTransaccion.nombre ||
                    'matriculacion3' === t.tipoTransaccion.nombre
                  : n.nombre === 'infraccionAntesDeMatricularse1'
                  ? n.nombre === t.tipoTransaccion.nombre ||
                    'infraccionAntesDeMatricularse2' ===
                      t.tipoTransaccion.nombre ||
                    'infraccionAntesDeMatricularse3' ===
                      t.tipoTransaccion.nombre
                  : n.nombre === t.tipoTransaccion.nombre) &&
                (t.estado === 'sent' || t.estado === 'approved')
            )
          );

          if (transaccionesSent.length === parseSent.length) {
            acc++;
          }

          break;

        case 'transactionApproved':
          const parseApproved = JSON.parse(tipo).filter((t: any) =>
            t.condicion
              ? condicionTransaccion(tramite, t.nombre, t.condicion)[0]
              : true
          );

          const transaccionesApproved = tramite.transacciones.filter((t) =>
            parseApproved.some(
              (n: { nombre: string; condicion?: string }) =>
                (n.nombre === 'matriculacion2'
                  ? n.nombre === t.tipoTransaccion.nombre ||
                    'matriculacion3' === t.tipoTransaccion.nombre
                  : n.nombre === 'infraccionAntesDeMatricularse1'
                  ? n.nombre === t.tipoTransaccion.nombre ||
                    'infraccionAntesDeMatricularse2' ===
                      t.tipoTransaccion.nombre ||
                    'infraccionAntesDeMatricularse3' ===
                      t.tipoTransaccion.nombre
                  : n.nombre === t.tipoTransaccion.nombre) &&
                t.estado === 'approved'
            )
          );

          if (transaccionesApproved.length === parseApproved.length) {
            acc++;
          }
          break;

        case 'appointmentApproved':
          const turno = tramite.turno?.find(
            (turno) => turno.id === turnoId && turno.estado === 'approved'
          );

          if (turno) {
            acc++;
          }
          break;

        case 'allAreasApproved':
          const areas = tramite.areas.filter((area) => !area.deleted);
          let accArea = 0;

          areas.forEach((area) => {
            if (area.status === 'approved') {
              accArea++;
            }
          });

          if (accArea === areas.length) {
            acc++;
          }
          break;

        case 'asignedEmployee':
          if (tramite.empleadoId) {
            acc++;
          }
          break;

        case 'eventConfirm':
          if (
            usuarioEvento.evento.tipoEvento.nombre === tipo &&
            usuarioEvento.estado === 'confirmado'
          ) {
            acc++;
          }

          break;

        case 'eventApproved':
          if (
            usuarioEvento.evento.tipoEvento.nombre === tipo &&
            usuarioEvento.estado === 'aprobado'
          ) {
            acc++;
          }

          break;

        case 'hasDictamen':
          if (tramite.dictamen) {
            const tiene = tramite.dictamen.some(
              (d) => tramite.pasoActual === d.paso
            );

            if (tiene) {
              acc++;
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
            }
          }

          break;

        case 'hasInforme':
          if (tramite.informe) {
            const tiene = tramite.informe.some(
              (info) => tramite.pasoActual === info.paso
            );

            if (tiene) {
              acc++;
            }
          }

          break;

        case 'hasExpediente':
          if (tramite.expedientesHijos) {
            const tiene = tramite.expedientesHijos.length;

            if (tiene) {
              acc++;
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

        default:
          break;
      }
    }
  }

  return acc === nextConditions?.length;
};

export default tramiteCheckGotoNextStep;
