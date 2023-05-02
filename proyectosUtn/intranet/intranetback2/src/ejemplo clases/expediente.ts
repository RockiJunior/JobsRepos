import { EstadoExpediente } from '@prisma/client';
import Procedimiento from './procedimiento.interface';

class ExpedienteClass implements Procedimiento {
  estado: EstadoExpediente | undefined;

  changeState(state: EstadoExpediente) {
    this.estado = state;
  }
}

export default ExpedienteClass;
