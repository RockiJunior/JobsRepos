import { IPaso } from '../../interfaces/pasos.interface';

const cedulaCheckGotoNextStep = (cedula: any) => {
  const pasos = cedula.pasos as any as IPaso[];
  const nextConditions = pasos[cedula.pasoActual].nextConditions;
  let acc = 0;

  if (nextConditions) {
    for (const item of nextConditions) {
      const [nextCondition, tipo] = item.split('/');

      switch (nextCondition) {
        case 'asignedEmployee':
          if (cedula.empleadoId) {
            acc++;
          }
          break;

        default:
          break;
      }
    }
  }

  return acc === nextConditions?.length;
};

export default cedulaCheckGotoNextStep;
