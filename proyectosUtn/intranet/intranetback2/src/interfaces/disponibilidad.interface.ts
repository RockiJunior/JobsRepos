interface Intervalo {
  inicio: string;
  fin: string;
}

export interface Dia {
  abierto: boolean;
  intervalos: Intervalo[];
}

export interface Disponibilidad {
  id: number;
  nombre: string;
  areaId: number;
  lun: Dia;
  mar: Dia;
  mie: Dia;
  jue: Dia;
  vie: Dia;
  sab: Dia;
  dom: Dia;
  inicio: Date;
  fin: Date;
}
