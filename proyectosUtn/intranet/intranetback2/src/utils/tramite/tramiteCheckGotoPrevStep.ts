import { ITramite } from '../../interfaces/tramite.interface';

const tramiteCheckGotoPrevStep = (tramite: ITramite, usuarioEvento?: any) => {
  const pasos = tramite.tipo.pasos;
  const prevConditions = pasos[tramite.pasoActual].prevConditions;
  let acc = 0;

  if (prevConditions) {
    for (const item of prevConditions) {
      const [prevCondition, tipo] = item.split('/');

      switch (prevCondition) {
        case 'requestTransaction':
          const transaccion1 = tramite.transacciones.find((t: any) =>
            tipo === 'matriculacion2'
              ? t.tipoTransaccion.nombre === tipo ||
                t.tipoTransaccion.nombre === 'matriculacion3'
              : t.tipoTransaccion.nombre === tipo
          );

          if (
            transaccion1 &&
            (transaccion1.estado === 'request' ||
              transaccion1.estado === 'approved')
          ) {
            acc++;
          }
          break;

        case 'someInputsRequest':
          let someRequest = false;

          const interateRequestInputs = (inputs: any) => {
            inputs.forEach((input: any) => {
              const inputValue = input.InputValues as any;

              if (inputValue && inputValue.estado === 'request') {
                someRequest = true;
              }

              if (input.hijos) {
                interateRequestInputs(input.hijos);
              }
            });
          };

          tramite.tipo.secciones.forEach((seccion: any) => {
            interateRequestInputs(seccion.inputs);
          });

          if (someRequest) {
            acc++;
          }

          break;

        case 'someTransactionsRequest':
          let someRequest2 = false;

          tramite.transacciones.forEach((t: any) => {
            if (t.estado === 'request') {
              someRequest2 = true;
            }
          });

          if (someRequest2) {
            acc++;
          }
          break;

        case 'eventRejected':
          if (
            usuarioEvento.evento.tipoEvento.nombre === tipo &&
            usuarioEvento.estado === 'postergado'
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

        default:
          break;
      }
    }
  }

  return acc === prevConditions?.length;
};

export default tramiteCheckGotoPrevStep;
