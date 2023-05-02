import { Evento, TipoEvento } from '@prisma/client';

export interface IEventoConTipoEvento extends Evento {
  tipoEvento: TipoEvento;
}
