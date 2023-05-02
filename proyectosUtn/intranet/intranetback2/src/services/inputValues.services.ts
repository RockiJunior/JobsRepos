import { EstadoInput, InputsValues } from '@prisma/client';
import prisma from '../config/db';

class InputsValuesService {
  findOne({
    inputNombre,
    tramiteId
  }: {
    inputNombre: string;
    tramiteId: number;
  }) {
    return prisma.inputsValues.findFirst({
      where: {
        inputNombre,
        tramiteId
      }
    });
  }

  upsert({ tramiteId, inputNombre, ...data }: InputsValues, esAdmin: boolean) {
    return prisma.inputsValues.upsert({
      where: {
        tramiteId_inputNombre: {
          tramiteId,
          inputNombre
        }
      },
      update: {
        ...data,
        comentario: esAdmin ? data.comentario : ''
      },
      create: {
        tramiteId,
        inputNombre,
        ...data,
        comentario: esAdmin ? data.comentario : ''
      }
    });
  }

  upsertEmpleados(
    { tramiteId, inputNombre, ...data }: InputsValues,
    esAdmin: boolean
  ) {
    return prisma.inputsValues.upsert({
      where: {
        tramiteId_inputNombre: {
          tramiteId,
          inputNombre
        }
      },
      update: {
        ...data,
        comentario: esAdmin ? data.comentario : null
      },
      create: {
        tramiteId,
        inputNombre,
        ...data,
        comentario: esAdmin ? data.comentario : null
      }
    });
  }

  archivo(inputNombre: string, tramiteId: number, estado: EstadoInput) {
    return prisma.inputsValues.upsert({
      where: {
        tramiteId_inputNombre: {
          tramiteId,
          inputNombre
        }
      },
      update: {
        estado
      },
      create: {
        tramiteId,
        inputNombre,
        estado
      }
    });
  }
}

export default new InputsValuesService();
