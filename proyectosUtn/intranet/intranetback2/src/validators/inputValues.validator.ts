import { EstadoInput, InputsValues } from '@prisma/client';
import { InputName } from '../data/seed/inputs/inputs';
import tramites from '../data/tramites';
import documentoServices from '../services/documento.services';
import inputValuesServices from '../services/inputValues.services';
import plazoServices from '../services/plazo.services';
import tramiteServices from '../services/tramite.services';
import usersServices from '../services/users.services';
import { notificacionMail } from '../utils/enviarEmail';
import Exception from '../utils/Exception';
import { registroHistorial } from '../utils/registrarHistorial';
import tramiteActionStep from '../utils/tramite/tramiteActionStep';
import checkGotoNextStep from '../utils/tramite/tramiteCheckGotoNextStep';
import checkGotoPrevStep from '../utils/tramite/tramiteCheckGotoPrevStep';
import tramiteGoTo from '../utils/tramite/tramiteGoTo';
import notificacionValidators from './notificacion.validators';
import tramiteValidators from './tramite.validators';
import prisma from '../config/db';
import { IPaso } from '../interfaces/pasos.interface';

export interface IInputsValues extends InputsValues {
  inputNombre: InputName;
}

class InputsValuesValidator {
  async upsertManyExternos({
    arrInputs,
    tramiteId,
    tituloSeccion
  }: {
    arrInputs: IInputsValues[];
    tramiteId: number;
    tituloSeccion: string;
  }) {
    if (!tramiteId) {
      throw new Exception('El tramiteId es requerido');
    }

    const tramite = await tramiteServices.findByIdCarpeta(tramiteId);

    if (!tramite) {
      throw new Exception('El trámite no existe');
    }

    const datosUsuario: { [key: string]: string | null } = {};

    for (const input of arrInputs) {
      switch (input.inputNombre) {
        case 'nombre':
          datosUsuario['nombre'] = input.value;
          break;
        case 'apellido':
          datosUsuario['apellido'] = input.value;
          break;
        case 'dni':
          datosUsuario['dni'] = input.value;
          break;

        default:
          break;
      }
    }

    if (datosUsuario) {
      await prisma.datosUsuario.update({
        where: {
          id: tramite.datosUsuarioId
        },
        data: {
          ...datosUsuario
        }
      });
    }

    if (tramite.empleadoId && tituloSeccion) {
      notificacionValidators.notificacionInputs({
        usuarioId: tramite.empleadoId,
        arrInputs,
        tituloSeccion,
        tramiteId,
        esAdmin: true
      });
    }

    await registroHistorial({
      titulo: `Envío datos para el trámite`,
      descripcion: `Subió datos para la sección <strong>${tituloSeccion}</strong>`,
      tramiteId
    });

    for (const input of arrInputs) {
      await inputValuesServices.upsert(input, false);
    }

    const tramiteActions = await tramiteValidators.getByIdForAction(tramiteId);

    if (checkGotoNextStep(tramiteActions)) {
      await tramiteServices.update(tramiteId, {
        pasoActual: tramiteActions.pasoActual + 1
      });
      const newTramite = await tramiteValidators.getByIdForAction(tramiteId);

      await tramiteActionStep(newTramite);

      const tramitecontransaccion = await tramiteValidators.getById(tramiteId);

      return tramitecontransaccion;
    } else {
      await tramiteGoTo(tramiteActions);
    }

    const tramiteDB = await tramiteValidators.getById(tramiteId);
    return tramiteDB;
  }

  async upsertMany({
    arrInputs,
    tramiteId,
    usuarioId,
    tituloSeccion
  }: {
    arrInputs: IInputsValues[];
    tramiteId: number;
    usuarioId: number;
    tituloSeccion: string;
  }) {
    if (!tramiteId) {
      throw new Exception('El tramiteId es requerido');
    }
    if (!usuarioId) {
      throw new Exception('El usuarioId es requerido');
    }

    const tramite = await tramiteServices.findByIdCarpeta(tramiteId);

    if (!tramite) {
      throw new Exception('El trámite no existe');
    }

    if (tramite.empleadoId && tituloSeccion) {
      notificacionValidators.notificacionInputs({
        usuarioId: tramite.empleadoId,
        arrInputs,
        tituloSeccion,
        tramiteId,
        esAdmin: true
      });
    }

    await registroHistorial({
      titulo: `Envío datos para el trámite`,
      descripcion: `Subió datos para la sección <strong>${tituloSeccion}</strong>`,
      usuarioId,
      tramiteId
    });

    const datosUsuario: { [key: string]: string | null } = {};

    for (const input of arrInputs) {
      switch (input.inputNombre) {
        case 'nombre':
          datosUsuario['nombre'] = input.value;
          break;
        case 'apellido':
          datosUsuario['apellido'] = input.value;
          break;
        case 'dni':
          datosUsuario['dni'] = input.value;
          break;

        default:
          break;
      }
    }

    if (datosUsuario) {
      await prisma.datosUsuario.update({
        where: {
          id: tramite.datosUsuarioId
        },
        data: {
          ...datosUsuario
        }
      });
    }

    arrInputs.forEach((input) => {
      if (!input.inputNombre) {
        throw new Exception('El nombre del input es requerido');
      }
    });

    for (const input of arrInputs) {
      await inputValuesServices.upsert(input, false);

      if (input.inputNombre === 'matriculadoDenunciado') {
        const info = tramite.info as any;
        await tramiteServices.update(tramiteId, {
          info: {
            ...info,
            denunciado: Number(input.value)
          }
        });
      }
    }

    const tramiteActions = await tramiteValidators.getByIdForAction(tramiteId);

    if (checkGotoNextStep(tramiteActions)) {
      await tramiteServices.update(tramiteId, {
        pasoActual: tramiteActions.pasoActual + 1
      });
      const newTramite = await tramiteValidators.getByIdForAction(tramiteId);

      await tramiteActionStep(newTramite);

      const tramitecontransaccion = await tramiteValidators.getById(tramiteId);

      return tramitecontransaccion;
    } else {
      await tramiteGoTo(tramiteActions);
    }

    const tramiteDB = await tramiteValidators.getById(tramiteId);
    return tramiteDB;
  }

  async upsertManyEmpleados({
    arrInputs,
    tramiteId,
    usuarioId,
    tituloSeccion
  }: {
    arrInputs: IInputsValues[];
    tramiteId: number;
    usuarioId: number;
    tituloSeccion: string;
  }) {
    if (!tramiteId) {
      throw new Exception('El tramiteId es requerido');
    }
    if (!usuarioId) {
      throw new Exception('El usuarioId es requerido');
    }

    const tramite = await tramiteServices.findByIdCarpeta(tramiteId);

    if (!tramite) {
      throw new Exception('El trámite no existe');
    }

    let usuario = await usersServices.findById(usuarioId);

    if (!usuario) {
      throw new Exception('Usuario no encontrado');
    }

    if (!usuario.empleado) {
      throw new Exception('Empleado no encontrado');
    }
    if (tramite.carpeta?.usuarioId) {
      await notificacionValidators.notificacionInputs({
        usuarioId: tramite.carpeta.usuarioId,
        arrInputs,
        tituloSeccion,
        tramiteId,
        esAdmin: false
      });
    }
    for (const input of arrInputs) {
      await inputValuesServices.upsertEmpleados(input, true);
    }
    const tramiteActions = await tramiteValidators.getByIdForAction(tramiteId);

    if (arrInputs.some((input) => input.estado === 'rejected')) {
      await registroHistorial({
        titulo: `Rechazó datos para el trámite`,
        descripcion: `Rechazó la sección <strong>${tituloSeccion}</strong>`,
        usuarioId,
        tramiteId
      });
    } else if (arrInputs.some((input) => input.estado === 'request')) {
      await registroHistorial({
        titulo: `Solicitó modificación para el trámite`,
        descripcion: `Solicitó modificación de datos en la sección <strong>${tituloSeccion}</strong>`,
        usuarioId,
        tramiteId
      });
      if (
        tramite.tipoId === tramites.altaMatriculacion ||
        tramite.tipoId === tramites.ddjjActividadComercial ||
        tramite.tipoId === tramites.ddjjNoActividadComercial
      ) {
        await notificacionMail({
          type: 'requestChange',
          tramite: tramiteActions,
          condition: 'withEmployee'
        });
      }
    } else {
      await registroHistorial({
        titulo: `Aprobó datos para el trámite`,
        descripcion: `Aprobó la sección <strong>${tituloSeccion}</strong>`,
        usuarioId,
        tramiteId
      });
    }

    if (tramiteActions) {
      if (checkGotoPrevStep(tramiteActions)) {
        await tramiteServices.update(tramiteActions.id, {
          pasoActual: tramiteActions.pasoActual - 1
        });

        const plazo = tramiteActions.plazos.find((p) => !p.fechaFinalizacion);

        if (plazo) {
          await plazoServices.finish(plazo.id);
        }
      } else if (checkGotoNextStep(tramiteActions)) {
        await tramiteServices.update(tramiteId, {
          pasoActual: tramiteActions.pasoActual + 1
        });

        const plazo = tramiteActions.plazos.find((p) => !p.fechaFinalizacion);
        if (plazo) {
          await plazoServices.finish(plazo.id);
        }

        const newTramite = await tramiteValidators.getByIdForAction(tramiteId);

        await tramiteActionStep(newTramite);

        const tramitecontransaccion = await tramiteValidators.getById(
          tramiteId
        );

        return tramitecontransaccion;
      }
    }

    const tramiteDB = await tramiteValidators.getById(tramiteId);

    return tramiteDB;
  }

  async upsertManyEmpleadosNoNotification({
    arrInputs,
    tramiteId
  }: {
    arrInputs: IInputsValues[];
    tramiteId: number;
  }) {
    if (!tramiteId) {
      throw new Exception('El tramiteId es requerido');
    }

    const tramite = await tramiteServices.findByIdCarpeta(tramiteId);

    if (!tramite) {
      throw new Exception('El trámite no existe');
    }

    const datosUsuario: { [key: string]: string | null } = {};

    for (const input of arrInputs) {
      switch (input.inputNombre) {
        case 'nombre':
          datosUsuario['nombre'] = input.value;
          break;
        case 'apellido':
          datosUsuario['apellido'] = input.value;
          break;
        case 'dni':
          datosUsuario['dni'] = input.value;
          break;

        default:
          break;
      }
    }

    if (datosUsuario) {
      await prisma.datosUsuario.update({
        where: {
          id: tramite.datosUsuarioId
        },
        data: {
          ...datosUsuario
        }
      });
    }

    for (const input of arrInputs) {
      await inputValuesServices.upsertEmpleados(input, true);

      if (input.inputNombre === 'matriculadoDenunciado') {
        const info = tramite.info as any;
        await tramiteServices.update(tramiteId, {
          info: {
            ...info,
            denunciado: Number(input.value)
          }
        });
      }
    }

    const tramiteActions = await tramiteValidators.getByIdForAction(tramiteId);
    if (tramite.tipoId === tramites.altaMatriculacion) {
      const paso = tramiteActions.tipo.pasos[tramite.pasoActual] as IPaso;
      if (paso.actions?.includes('tipoSeccion/matricula')) {
        const inputsAsiento: { [key: string]: string | null } = {};
        for (const input of arrInputs) {
          switch (input.inputNombre) {
            case 'libroMatricula':
              inputsAsiento.libro = input.value;
              break;
            case 'folioMatricula':
              inputsAsiento.folio = input.value;
              break;
            case 'tomoMatricula':
              inputsAsiento.tomo = input.value;
              break;
          }
        }

        const matricula = await prisma.matricula.findFirst({
          where: {
            usuarioId: tramiteActions.carpeta?.usuarioId,
            estado: 'pendiente'
          }
        });
        if (matricula) {
          await prisma.matricula.update({
            where: {
              id: matricula.id
            },
            data: {
              ...inputsAsiento
            }
          });
        }
      }
      if (tramiteActions) {
        if (checkGotoPrevStep(tramiteActions)) {
          await tramiteServices.update(tramiteActions.id, {
            pasoActual: tramiteActions.pasoActual - 1
          });

          const plazo = tramiteActions.plazos.find((p) => !p.fechaFinalizacion);

          if (plazo) {
            await plazoServices.finish(plazo.id);
          }
        } else if (checkGotoNextStep(tramiteActions)) {
          await tramiteServices.update(tramiteActions.id, {
            pasoActual: tramiteActions.pasoActual + 1
          });

          const newTramite = await tramiteValidators.getByIdForAction(
            tramiteActions.id
          );
          await tramiteActionStep(newTramite);

          const plazo = tramiteActions.plazos.find((p) => !p.fechaFinalizacion);
          if (plazo) {
            await plazoServices.finish(plazo.id);
          }
        } else {
          await tramiteGoTo(tramiteActions);
          const newTramite = await tramiteValidators.getByIdForAction(
            tramiteActions.id
          );
          await tramiteActionStep(newTramite);
        }
      }

      const tramiteDB = await tramiteValidators.getById(tramiteId);
      return tramiteDB;
    }
  }

  async archivo(
    inputNombre: string,
    tramiteId: number,
    userId: number,
    estado: string,
    filename: string,
    borrarAnteriores: boolean = false
  ) {
    if (!inputNombre) {
      throw new Exception('El id del input es requerido');
    }

    if (!tramiteId) {
      throw new Exception('El id trámite es requerido');
    }

    if (!userId) {
      throw new Exception('El userId es requerido');
    }

    if (!estado) {
      throw new Exception('El estado es requerido');
    }

    await inputValuesServices.findOne({ inputNombre, tramiteId });

    if (borrarAnteriores) {
      await documentoServices.deleteByInputValue(inputNombre, tramiteId);
    }

    const archivoGuardado = await inputValuesServices.archivo(
      inputNombre,
      tramiteId,
      estado as EstadoInput
    );

    await documentoServices.createInput({
      userId,
      filename,
      inputNombre,
      tramiteId
    });

    return archivoGuardado;
  }

  async archivoExterno(
    inputNombre: string,
    tramiteId: number,
    estado: string,
    filename: string,
    borrarAnteriores: boolean = false
  ) {
    if (!inputNombre) {
      throw new Exception('El id del input es requerido');
    }

    if (!tramiteId) {
      throw new Exception('El id trámite es requerido');
    }

    if (!estado) {
      throw new Exception('El estado es requerido');
    }

    const tramite = await tramiteServices.findById(tramiteId);

    if (!tramite) {
      throw new Exception('El trámite no existe');
    }

    if (tramite.tipo.puedeIniciar !== 'externo') {
      throw new Exception('No estás autorizado para realizar esta acción');
    }

    await inputValuesServices.findOne({ inputNombre, tramiteId });

    if (borrarAnteriores) {
      await documentoServices.deleteByInputValue(inputNombre, tramiteId);
    }

    const archivoGuardado = await inputValuesServices.archivo(
      inputNombre,
      tramiteId,
      estado as EstadoInput
    );

    await documentoServices.createInputSinUsuario({
      filename,
      inputNombre,
      tramiteId
    });

    return archivoGuardado;
  }
}

export default new InputsValuesValidator();
