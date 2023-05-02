import {
  Archivo,
  AreaToTramite,
  CedulaNotificacion,
  Dictamen,
  Documento,
  Expediente,
  Informe,
  InputsValues,
  Intimacion,
  Plazo,
  TipoTransaccion,
  Tramite,
  Transaccion,
  Turno,
  Resolucion
} from '@prisma/client';
import TipoTramite, {
  Input,
  Seccion
} from '../data/seed/tiposTramites/interfaceTipoTramite';

interface ITransaccion extends Transaccion {
  tipoTransaccion: TipoTransaccion;
}

export interface IInputValue extends InputsValues {
  archivos: Documento[];
}

export interface IInput extends Input {
  titulo: string;
  InputValues: IInputValue;
}

export interface ISeccion extends Seccion {
  inputs: IInput[];
}

interface ITipoTramite extends TipoTramite {
  secciones: ISeccion[];
}

export interface ITramite extends Tramite {
  tipo: ITipoTramite;
  carpeta: { usuarioId: number } | null;
  transacciones: ITransaccion[];
  turno: Turno[];
  areas: AreaToTramite[];
  cedulas: CedulaNotificacion[];
  intimacion: Intimacion[];
  plazos: Plazo[];
  informe: Informe[];
  archivos: Archivo[];
  dictamen: Dictamen[];
  resoluciones: Resolucion[];
  expedientesHijos: Expediente[];
  info: { [key: string]: any };
}
