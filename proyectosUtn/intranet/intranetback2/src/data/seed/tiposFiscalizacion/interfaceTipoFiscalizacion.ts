import { InputName } from '../inputs/inputs';

export interface Input {
  nombre: InputName;
  requerido: (boolean | InputName)[];
  isDisabled?: boolean;
  padre?: InputName;
  multiple?: boolean;
  prefijo?: string;
}

export interface SeccionFiscalizacion {
  id: number;
  titulo: string;
  tipo?: string;
  inputs: Input[];
}

interface TipoFiscalizacion {
  id: number;
  secciones: SeccionFiscalizacion[];
}

export default TipoFiscalizacion;
