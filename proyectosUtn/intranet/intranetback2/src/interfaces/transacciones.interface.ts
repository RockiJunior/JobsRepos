import {
  Concepto,
  TipoTransaccion,
  TipoTransaccionConcepto
} from '@prisma/client';

export interface IOpcionCuotas {
  id: number;
  activo: boolean;
  cantidad: number;
  monto: number;
  interes: number;
  cuotas: { id: number; monto: number }[];
}

interface ITipoTransaccionConcepto extends TipoTransaccionConcepto {
  concepto: Concepto;
}

export interface ITipoTransaccion extends TipoTransaccion {
  TipoTransaccionConcepto: ITipoTransaccionConcepto;
}
