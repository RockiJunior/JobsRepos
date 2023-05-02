import { log } from 'console';
import prisma from '../config/db';
import { InputName } from '../data/seed/inputs/inputs';
import { tiposTramites } from '../data/seed/tipos';
import { IDatos } from '../interfaces/users.interface';
import empleadoServices from '../services/empleado.services';
import tipoTramiteServices from '../services/tipoTramite.services';
import usersServices from '../services/users.services';
import Exception from '../utils/Exception';

export interface IInput {
  titulo: string;
  nombre: InputName;
  requerido: (boolean | InputName)[];
  isDisabled?: boolean;
  padre?: string;
  multiple?: boolean;
  prefijo?: string;
}

const buscarPadre = (inputs: any, padre: string) => {
  const result = inputs.find((i: any) => i.nombre === padre);

  if (result) {
    return result;
  }

  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];

    if (input.hijos) {
      const result: any = buscarPadre(input.hijos, padre);

      if (result) {
        return result;
      }
    }
  }
};

class TipoTramiteValidator {
  async findByIdExterno(id: number) {
    if (!id) {
      throw new Exception('El id es requerido');
    }

    const tipoTramite = await tipoTramiteServices.findByIdExterno(id);

    if (!tipoTramite) {
      throw new Exception('El tipo de trámite no existe');
    }

    if (tipoTramite.puedeIniciar !== 'externo') {
      throw new Exception('No estás autorizado para realizar esta acción');
    }

    const tipo = tiposTramites.find((t) => t.id === tipoTramite.id);

    if (tipo) {
      const seccionesDB = tipoTramite.secciones;

      const sortSecciones = seccionesDB.map((seccion) => {
        const seccionTipo = tipo.secciones.find((s) => s.id === seccion.id);

        if (seccionTipo) {
          let newInputs: IInput[] = [];
          const inputsDB = seccion.inputs;
          const inputsTipo = seccionTipo.inputs;

          inputsTipo.forEach((input) => {
            const newInput = inputsDB.find((i) => i.nombre === input.nombre);
            if (newInput) {
              const objInput = {
                ...newInput,
                requerido: input.requerido,
                padre: input.padre,
                multiple: input.multiple,
                isDisabled: input.isDisabled,
                prefijo: input.prefijo,
                nombre: input.nombre
              };
              if (input.padre) {
                const padre = buscarPadre(newInputs, input.padre) as any;

                if (padre) {
                  padre.hijos = padre.hijos
                    ? [...padre.hijos, objInput]
                    : [objInput];
                }
              } else {
                newInputs.push(objInput);
              }
            }
          });

          return {
            ...seccion,
            inputs: newInputs
          };
        } else {
          return seccion;
        }
      });

      return {
        ...tipoTramite,
        secciones: sortSecciones
      };
    } else {
      throw new Exception('El tipo de trámite no existe');
    }
  }

  async findAllUsuario(userId: number) {
    if (!userId) {
      throw new Exception('El id del usuario es requerido');
    }

    const matricula = await prisma.matricula.findFirst({
      where: {
        usuarioId: userId,
        NOT: {
          OR: [{ estado: 'baja' }, { estado: 'pendiente' }]
        }
      }
    });

    const matriculaCesante = await prisma.matricula.findFirst({
      where: {
        usuarioId: userId,
        estado: 'cesante'
      }
    });

    const tipoTramites = await tipoTramiteServices.findAllUsuario({
      hasMatricula: !!matricula,
      actividadComercial: matricula?.estado === 'activo',
      matriculaCesante: !!matriculaCesante
    });

    if (!tipoTramites) {
      throw new Exception('No hay tipos de trámite');
    }

    return tipoTramites;
  }

  async findAllEmpleado(userId: number) {
    if (!userId) {
      throw new Exception('El id del usuario es requerido');
    }

    const empleado = await empleadoServices.findById(userId);

    if (!empleado) {
      throw new Exception('No es un empleado');
    }

    const { areaId } = empleado;

    if (!areaId) {
      throw new Exception('No tiene área asignada');
    }

    const tipoTramites = await tipoTramiteServices.findAllEmpleado(areaId);

    if (!tipoTramites) {
      throw new Exception('No hay tipos de trámite');
    }

    return tipoTramites;
  }
}

export default new TipoTramiteValidator();
