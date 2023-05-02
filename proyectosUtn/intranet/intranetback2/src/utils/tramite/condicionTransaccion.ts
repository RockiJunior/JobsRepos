import { ITramite } from '../../interfaces/tramite.interface';

export const condicionTransaccion = (
  tramite: ITramite,
  transaccionNombre: string,
  condicion: string
): [boolean, number | undefined] => {
  const [tipoCondicion, info] = condicion.split(':');

  switch (tipoCondicion) {
    case 'input':
      const secciones = tramite.tipo.secciones;
      for (const seccion of secciones) {
        for (const input of seccion.inputs) {
          if (input.nombre === info) {
            if (input.InputValues?.value === 'true') {
              if (transaccionNombre === 'infraccionAntesDeMatricularse1') {
                const montoInfraccionAntesMatricularse = secciones
                  .find((secc) => secc.tipo === 'infraccion')
                  ?.inputs.find(
                    (input) =>
                      input.nombre === 'infraccionAntesDeMatricularseMonto'
                  )?.InputValues?.value;
                const montoArancelFiscalizacion = secciones
                  .find((secc) => secc.tipo === 'infraccion')
                  ?.inputs.find(
                    (input) => input.nombre === 'arancelesFiscalizacion'
                  )?.InputValues?.value;

                const sumaTotal =
                  Number(montoInfraccionAntesMatricularse) +
                  Number(montoArancelFiscalizacion);

                return [true, isNaN(sumaTotal) ? undefined : sumaTotal];
              } else {
                return [true, undefined];
              }
            }
          }
        }
      }
      break;
    default:
      break;
  }

  return [false, undefined];
};
