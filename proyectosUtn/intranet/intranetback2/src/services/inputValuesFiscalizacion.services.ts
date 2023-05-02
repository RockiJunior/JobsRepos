import { EstadoInput, InputsValueFiscalizacion } from '@prisma/client';
import prisma from '../config/db';

class InputsValuesFiscalizacionService {
  upsert(
    { fiscalizacionId, inputNombre, ...data }: InputsValueFiscalizacion,
    esAdmin: boolean
  ) {
    return prisma.inputsValueFiscalizacion.upsert({
      where: {
        fiscalizacionId_inputNombre: {
          fiscalizacionId,
          inputNombre
        }
      },
      update: {
        ...data,
        comentario: esAdmin ? data.comentario : ''
      },
      create: {
        fiscalizacionId,
        inputNombre,
        ...data,
        comentario: esAdmin ? data.comentario : ''
      }
    });
  }

  archivo(inputNombre: string, fiscalizacionId: number, estado: EstadoInput) {
    return prisma.inputsValueFiscalizacion.upsert({
      where: {
        fiscalizacionId_inputNombre: {
          fiscalizacionId,
          inputNombre
        }
      },
      update: {
        estado
      },
      create: {
        fiscalizacionId,
        inputNombre,
        estado
      }
    });
  }
}

export default new InputsValuesFiscalizacionService();
