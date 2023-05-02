/* model Tramite {
  id              Int             @id @default(autoincrement())
  estado          EstadoTramite   @default(pendiente)
  numero          Int
  createdAt       DateTime        @default(now())
  pasoActual      Int             @default(0)
  tramitePadreId Int?
  expedientePadreId Int?
} */

import { EstadoExpediente, EstadoTramite } from '@prisma/client';
import Procedimiento from './procedimiento.interface';

class ProcedimientoClass {
  changeState(
    procedimiento: Procedimiento,
    state: EstadoTramite | EstadoExpediente
  ) {
    procedimiento.changeState(state);
  }
}

export default ProcedimientoClass;
