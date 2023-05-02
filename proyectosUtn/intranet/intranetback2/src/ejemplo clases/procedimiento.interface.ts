import { EstadoExpediente, EstadoTramite } from '@prisma/client';

interface Procedimiento {
  changeState(state: EstadoTramite | EstadoExpediente): void;
}

export default Procedimiento;
