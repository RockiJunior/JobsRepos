export interface IUsuario {
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  contrasenia: string;
  verificado: boolean;
}

export interface IDatos {
  [prop: string]: { value?: string; archivos?: string[] };
}
