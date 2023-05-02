import prisma from '../../config/db';
import procesoLegalesPasos from '../../data/procesoLegales';
import { IProcesoLegales } from '../../interfaces/expediente.interface';
import empleadoServices from '../../services/empleado.services';
import usersValidator from '../../validators/users.validator';
import Exception from '../Exception';

export const ProcesoLcheckPasoSiguiente = async (
  procesoLegales: IProcesoLegales,
  usuarioId: number
) => {
  const paso = procesoLegalesPasos[procesoLegales.pasoActual];
  const action = paso.actions?.find((a: any) => a.startsWith('canGoNextStep/'));

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
          case 'hasCedula':
            if (procesoLegales.cedulas) {
              const tiene = procesoLegales.cedulas.some(
                (cedula) => procesoLegales.pasoActual === cedula.pasoCreacion
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

          case 'hasArchivo':
            if (procesoLegales.archivos) {
              const tiene = procesoLegales.archivos.some(
                (archivo) => procesoLegales.pasoActual === archivo.paso
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
            if (procesoLegales.dictamen) {
              const tiene = procesoLegales.dictamen.some(
                (d) => procesoLegales.pasoActual === d.paso
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

          case 'hasResolucion':
            if (procesoLegales.resoluciones) {
              const tiene = procesoLegales.resoluciones.some(
                (resolucion) => procesoLegales.pasoActual === resolucion.paso
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

          case 'hasFallo':
            if (procesoLegales.fallos) {
              const tiene = procesoLegales.fallos.some(
                (fallo) => procesoLegales.pasoActual === fallo.paso
              );
              if (tiene) {
                acc++;
              } else {
                throw new Exception(
                  'Debes agregar uno o más fallos en este paso'
                );
              }
            }
            break;

          case 'cedulaElectronica':
            const expediente = await prisma.expediente.findUnique({
              where: {
                id: procesoLegales.expedienteId
              },
              include: {
                carpeta: true
              }
            });
            if (expediente?.carpeta?.usuarioId) {
              const usuario = await usersValidator.getById(
                expediente.carpeta.usuarioId
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
