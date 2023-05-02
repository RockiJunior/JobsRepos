import { CobroFiscalizacion } from '@prisma/client';
import cobroFiscalizacionServices from '../services/cobroFiscalizacion.services';

class CobroFiscalizacionValidator {
  create(fiscalizacionId: number) {
    if (!fiscalizacionId) {
      throw new Error('El id de la fiscalización es requerido');
    }

    return cobroFiscalizacionServices.create(fiscalizacionId);
  }

  update({ id, conceptos }: { id: number; conceptos: number[] }) {
    if (!id) {
      throw new Error('El id del cobro es requerido');
    }

    return cobroFiscalizacionServices.update({ id, conceptos });
  }

  delete(id: number) {
    if (!id) {
      throw new Error('El id del cobro es requerido');
    }

    return cobroFiscalizacionServices.delete(id);
  }
}

export default new CobroFiscalizacionValidator();
