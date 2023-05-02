import {
  AreaToExpediente,
  CedulaNotificacion,
  Expediente,
  Informe,
  Archivo,
  Dictamen,
  Plazo,
  Fallo,
  Caratula,
  Resolucion,
  Carpeta,
  Usuario,
  InputsValueFiscalizacion,
  Documento,
  Fiscalizacion,
  ProcesoLegales,
  NotaInterna,
  DespachoImputacion,
  Empleado,
  Denuncia
} from '@prisma/client';

import TipoFiscalizacion, {
  Input,
  SeccionFiscalizacion
} from '../data/seed/tiposFiscalizacion/interfaceTipoFiscalizacion';

export interface IInputsValueFiscalizacion extends InputsValueFiscalizacion {
  archivos: Documento[];
}

export interface IIInput extends Input {
  titulo: string;
  tipo: string;
  inputValueFiscalizacion?: IInputsValueFiscalizacion;
}

export interface ISeccion extends SeccionFiscalizacion {
  inputs: IIInput[];
}

interface ITipoFiscalizacion extends TipoFiscalizacion {
  secciones: ISeccion[];
}

export interface IFiscalizacion extends Fiscalizacion {
  tipo: ITipoFiscalizacion;
}

export interface IProcesoLegales extends ProcesoLegales {
  notas: NotaInterna[];
  archivos: Archivo[];
  fallos: Fallo[];
  dictamen: Dictamen[];
  resoluciones: Resolucion[];
  despachoImputacion: DespachoImputacion | null;
  cedulas: CedulaNotificacion[];
  pasoActualLabel?: { label: string; title: string };
}

export interface ICarpeta extends Carpeta {
  usuario: Usuario;
}

export interface IExpediente extends Expediente {
  fiscalizaciones: IFiscalizacion[];
  procesosLegales: IProcesoLegales[];
  areas: AreaToExpediente[];
  plazos: Plazo[];
  informes: Informe[];
  archivos: Archivo[];
  carpeta?: ICarpeta;
  caratula: Caratula | null;
  empleadosAsignados: Empleado[];
  numero: string;
  denuncia: Denuncia | null;
}
