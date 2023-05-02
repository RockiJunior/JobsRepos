import { TipoTramiteInicio } from '@prisma/client';
import { InputName } from '../inputs/inputs';

interface Paso {
  id: number;
  variant: 'success' | 'info' | 'warning' | 'danger';
  title: string;
  description: string;
  prevConditions?: string[];
  nextConditions?: string[];
  actions?: string[];
  onRejectActions?: string[];
  intraTitle: string;
  goto?: string[];
  onExpiration?: string[];
  onRequestChanges?: string[];
  intraDescription?: string;
}

export interface Opcion {
  value: string;
  label: string;
  descripcion?: string;
}

export interface Validaciones {
  regex?: 'onlyLetters' | 'onlyNumbers' | 'email';
  min?: number;
  max?: number;
  number?: {
    min?: number;
    max?: number;
  };
}

export interface Input {
  nombre: InputName;
  requerido: (boolean | InputName)[];
  isDisabled?: boolean;
  padre?: string;
  multiple?: boolean;
  prefijo?: string;
}

export interface Seccion {
  id: number;
  titulo: string;
  tipo?: string;
  inputs: Input[];
}

type Requiere =
  | 'matricula'
  | 'noMatricula'
  | 'matriculaCesante'
  | 'actividadComercial'
  | 'oculto';

interface TipoTramite {
  id: number;
  titulo: string;
  plazo: number;
  areaId: number;
  pasos: Paso[];
  secciones: Seccion[];
  tipo: 'tramite' | 'declaracion_jurada' | 'certificado' | 'denuncia';
  puedeIniciar: TipoTramiteInicio;
  requiere: Requiere;
  descripcion?: string | null;
}

export default TipoTramite;
