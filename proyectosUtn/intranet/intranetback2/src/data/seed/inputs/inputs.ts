import { EstadoFiscalizacion, InputRegex } from '@prisma/client';

export interface Opcion {
  value: string;
  label: string;
  descripcion?: string;
}

export interface Validaciones {
  regex?: InputRegex;
  min?: number;
  max?: number;
  number?: {
    min?: number;
    max?: number;
  };
}

export interface IInputSeed {
  nombre: string;
  titulo: string;
  tipo:
    | 'choose'
    | 'text'
    | 'textarea'
    | 'number'
    | 'date'
    | 'file'
    | 'select'
    | 'checkbox'
    | 'dateTime'
    | 'buscadorMatriculado';
  opciones: Opcion[] | undefined | { multimedia: boolean };
  ayuda: string | undefined;
  validaciones: Validaciones | undefined;
}

export const inputsSeed = {
  //TRAMITES:
  nombre: {
    nombre: 'nombre',
    titulo: 'Nombre',
    tipo: 'text',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  apellido: {
    nombre: 'apellido',
    titulo: 'Apellido',
    tipo: 'text',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  apellidoMaterno: {
    nombre: 'apellidoMaterno',
    tipo: 'text',
    titulo: 'Apellido Materno',
    validaciones: {
      min: 3,
      max: 20,
      regex: 'onlyLetters'
    },
    opciones: undefined,
    ayuda: undefined
  },
  fechaNacimiento: {
    nombre: 'fechaNacimiento',
    tipo: 'date',
    titulo: 'Fecha de Nacimiento',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  lugarNacimiento: {
    nombre: 'lugarNacimiento',
    tipo: 'text',
    titulo: 'Lugar de Nacimiento',
    validaciones: {
      min: 3,
      max: 20
    },
    opciones: undefined,
    ayuda: undefined
  },
  nacionalidad: {
    nombre: 'nacionalidad',
    tipo: 'text',
    titulo: 'Nacionalidad',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  dni: {
    nombre: 'dni',
    titulo: 'DNI',
    tipo: 'number',
    validaciones: {
      regex: 'onlyNumbers',
      min: 7,
      max: 8
    },
    opciones: undefined,
    ayuda: undefined
  },
  mailParticular: {
    nombre: 'mailParticular',
    titulo: 'Email',
    tipo: 'text',
    validaciones: {
      regex: 'email'
    },
    opciones: undefined,
    ayuda: undefined
  },
  mailAlterrnativo: {
    nombre: 'mailAlterrnativo',
    tipo: 'text',
    titulo: 'Mail Alternativo',
    validaciones: {
      regex: 'email'
    },
    opciones: undefined,
    ayuda: undefined
  },
  telefonoParticular: {
    nombre: 'telefonoParticular',
    titulo: 'Teléfono',
    tipo: 'number',
    validaciones: {
      regex: 'onlyNumbers'
    },
    opciones: undefined,
    ayuda: undefined
  },
  celularParticular: {
    nombre: 'celularParticular',
    titulo: 'Celular',
    tipo: 'number',
    validaciones: {
      regex: 'onlyNumbers'
    },
    opciones: undefined,
    ayuda: undefined
  },
  domicilioReal: {
    nombre: 'domicilioReal',
    titulo: 'Domicilio Real',
    tipo: 'text',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  codigoPostalReal: {
    nombre: 'codigoPostalReal',
    titulo: 'Código Postal Real',
    tipo: 'number',
    validaciones: {
      regex: 'onlyNumbers',
      min: 4,
      max: 4
    },
    opciones: undefined,
    ayuda: undefined
  },
  domicilioLegal: {
    nombre: 'domicilioLegal',
    titulo: 'Domicilio Legal',
    tipo: 'text',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  codigoPostalLegal: {
    nombre: 'codigoPostalLegal',
    titulo: 'Código Postal Legal',
    tipo: 'number',
    validaciones: {
      regex: 'onlyNumbers',
      min: 4,
      max: 4
    },
    opciones: undefined,
    ayuda: undefined
  },
  fotoCarnet: {
    nombre: 'fotoCarnet',
    tipo: 'file',
    titulo: 'Foto Carnet',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  frenteDNI: {
    nombre: 'frenteDNI',
    tipo: 'file',
    titulo: 'Frente de DNI',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  dorsoDNI: {
    nombre: 'dorsoDNI',
    tipo: 'file',
    titulo: 'Dorso de DNI',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  escaneoFirma: {
    nombre: 'escaneoFirma',
    tipo: 'file',
    titulo: 'Escaneo de Firma',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  acreditacionDomicilioCABA: {
    nombre: 'acreditacionDomicilioCABA',
    tipo: 'file',
    titulo: 'Acreditación de Domicilio en CABA',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  numeroMatricula: {
    nombre: 'numeroMatricula',
    titulo: 'Número de Matrícula',
    tipo: 'number',
    validaciones: {
      regex: 'onlyNumbers'
    },
    opciones: undefined,
    ayuda: undefined
  },
  libroMatricula: {
    nombre: 'libroMatricula',
    titulo: 'Libro',
    tipo: 'text',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  tomoMatricula: {
    nombre: 'tomoMatricula',
    titulo: 'Tomo',
    tipo: 'text',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  folioMatricula: {
    nombre: 'folioMatricula',
    titulo: 'Folio',
    tipo: 'text',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  legajoMatricula: {
    nombre: 'legajoMatricula',
    titulo: 'Legajo',
    tipo: 'text',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  motivoSolicitud: {
    nombre: 'motivoSolicitud',
    titulo: 'Motivo',
    tipo: 'textarea',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  fechaFallecimiento: {
    nombre: 'fechaFallecimiento',
    titulo: 'Fecha de Fallecimiento',
    tipo: 'date',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  nombreSolicitante: {
    nombre: 'nombreSolicitante',
    titulo: 'Nombre',
    tipo: 'text',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  apellidoSolicitante: {
    nombre: 'apellidoSolicitante',
    titulo: 'Apellido',
    tipo: 'text',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  dniSolicitante: {
    nombre: 'dniSolicitante',
    titulo: 'DNI',
    tipo: 'number',
    validaciones: {
      regex: 'onlyNumbers',
      min: 7,
      max: 8
    },
    opciones: undefined,
    ayuda: undefined
  },
  parentescoSolicitante: {
    nombre: 'parentescoSolicitante',
    titulo: 'Parentesco',
    tipo: 'text',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  mailParticularSolicitante: {
    nombre: 'mailParticularSolicitante',
    titulo: 'Email',
    tipo: 'text',
    validaciones: {
      regex: 'email'
    },
    opciones: undefined,
    ayuda: undefined
  },
  telefonoParticularSolicitante: {
    nombre: 'telefonoParticularSolicitante',
    titulo: 'Teléfono',
    tipo: 'number',
    validaciones: {
      regex: 'onlyNumbers'
    },
    opciones: undefined,
    ayuda: undefined
  },
  domicilioRealSolicitante: {
    nombre: 'domicilioRealSolicitante',
    titulo: 'Domicilio Real',
    tipo: 'text',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  ciudadSolicitante: {
    nombre: 'ciudadSolicitante',
    titulo: 'Ciudad',
    tipo: 'text',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  provinciaSolicitante: {
    nombre: 'provinciaSolicitante',
    titulo: 'Provincia',
    tipo: 'text',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  paisSolicitante: {
    nombre: 'paisSolicitante',
    titulo: 'País',
    tipo: 'text',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  codigoPostalRealSolicitante: {
    nombre: 'codigoPostalRealSolicitante',
    titulo: 'Código Postal',
    tipo: 'number',
    validaciones: {
      regex: 'onlyNumbers',
      min: 4,
      max: 4
    },
    opciones: undefined,
    ayuda: undefined
  },
  cotizacion: {
    nombre: 'cotizacion',
    tipo: 'file',
    titulo: 'Cotización Digital',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  certificadoMatriculaVigente: {
    nombre: 'certificadoMatriculaVigente',
    tipo: 'file',
    titulo: 'Certificado Vigente',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  cuitCuil: {
    nombre: 'cuitCuil',
    titulo: 'CUIT/CUIL',
    tipo: 'number',
    validaciones: {
      regex: 'onlyNumbers',
      min: 11,
      max: 11
    },
    ayuda: 'Sin guiones ni espacios',
    opciones: undefined
  },
  sexo: {
    nombre: 'sexo',
    tipo: 'select',
    titulo: 'Sexo',
    opciones: [
      {
        value: 'Masculino',
        label: 'Masculino'
      },
      {
        value: 'Femenino',
        label: 'Femenino'
      }
    ],
    ayuda: undefined,
    validaciones: undefined
  },
  estadoCivil: {
    nombre: 'estadoCivil',
    tipo: 'select',
    titulo: 'Estado Civil',
    opciones: [
      {
        value: 'Soltero/a',
        label: 'Soltero/a'
      },
      {
        value: 'Casado/a',
        label: 'Casado/a'
      },
      {
        value: 'Divorciado/a',
        label: 'Divorciado/a'
      },
      {
        value: 'Viudo/a',
        label: 'Viudo/a'
      },
      {
        value: 'Concubino/a',
        label: 'Concubino/a'
      }
    ],
    ayuda: undefined,
    validaciones: undefined
  },
  nombreFantasia: {
    nombre: 'nombreFantasia',
    titulo: 'Nombre de Fantasía',
    tipo: 'text',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  emailComercial: {
    nombre: 'emailComercial',
    titulo: 'Email Comercial',
    tipo: 'text',
    validaciones: {
      regex: 'email'
    },
    opciones: undefined,
    ayuda: undefined
  },
  telefonoComercial: {
    nombre: 'telefonoComercial',
    titulo: 'Teléfono Comercial',
    tipo: 'number',
    validaciones: {
      regex: 'onlyNumbers'
    },
    opciones: undefined,
    ayuda: undefined
  },
  domicilioComercial: {
    nombre: 'domicilioComercial',
    titulo: 'Domicilio Comercial',
    tipo: 'text',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  codigoPostalComercial: {
    nombre: 'codigoPostalComercial',
    titulo: 'Código Postal Comercial',
    tipo: 'number',
    validaciones: {
      regex: 'onlyNumbers',
      min: 4,
      max: 4
    },
    opciones: undefined,
    ayuda: undefined
  },
  domicilioCasaCentral: {
    nombre: 'domicilioCasaCentral',
    titulo: 'Domicilio Casa Central',
    tipo: 'text',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  telefonoCasaCentral: {
    nombre: 'telefonoCasaCentral',
    titulo: 'Teléfono Casa Central',
    tipo: 'number',
    validaciones: {
      regex: 'onlyNumbers'
    },
    opciones: undefined,
    ayuda: undefined
  },
  sucursal1: {
    nombre: 'sucursal1',
    titulo: '¿Tenés sucursal?',
    tipo: 'checkbox',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  domicilioSucursal1: {
    nombre: 'domicilioSucursal1',
    titulo: 'Domicilio Sucursal 1',
    tipo: 'text',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  telefonoSucursal1: {
    nombre: 'telefonoSucursal1',
    titulo: 'Teléfono Sucursal 1',
    tipo: 'number',
    validaciones: {
      regex: 'onlyNumbers'
    },
    opciones: undefined,
    ayuda: undefined
  },
  facturaDireccionSucursal1: {
    nombre: 'facturaDireccionSucursal1',
    titulo: 'Factura a domicilio de sucursal 1',
    tipo: 'file',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  sucursal2: {
    nombre: 'sucursal2',
    titulo: 'Agregar otra sucursal',
    tipo: 'checkbox',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  domicilioSucursal2: {
    nombre: 'domicilioSucursal2',
    titulo: 'Domicilio Sucursal 2',
    tipo: 'text',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  telefonoSucursal2: {
    nombre: 'telefonoSucursal2',
    titulo: 'Teléfono Sucursal 2',
    tipo: 'number',
    validaciones: {
      regex: 'onlyNumbers'
    },
    opciones: undefined,
    ayuda: undefined
  },
  facturaDireccionSucursal2: {
    nombre: 'facturaDireccionSucursal2',
    titulo: 'Factura a domicilio de sucursal 2',
    tipo: 'file',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  constanciaInscripcionAfip: {
    nombre: 'constanciaInscripcionAfip',
    titulo: 'Constancia de Inscripción en AFIP',
    tipo: 'file',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  comprobanteIngresosBrutos: {
    nombre: 'comprobanteIngresosBrutos',
    titulo: 'Comprobante de Ingresos Brutos',
    tipo: 'file',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  facturaElectronica: {
    nombre: 'facturaElectronica',
    titulo: 'Factura Electrónica emitida por $0.01',
    tipo: 'file',
    ayuda: `condition::sociedad??Debe figurar:
              ◦ Razón social
              ◦ Número de matrícula y nombre y apellido del matriculado responsable de la facturación
              ◦ Domicilio Profesional||Debe figurar:
              ◦ Nombre Profesional (Nombre y apellido / apellido del matriculado)
              ◦ Domicilio comercial
              ◦ Número de matrícula en la leyenda`,
    opciones: undefined,
    validaciones: undefined
  },
  marcaRegistrada: {
    nombre: 'marcaRegistrada',
    titulo: '¿Tenés marca registrada?',
    tipo: 'checkbox',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  marcaRegistradaNombre: {
    nombre: 'marcaRegistradaNombre',
    titulo: 'Nombre de la marca registrada',
    tipo: 'text',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  marcaRegistradaRegistroInpi: {
    nombre: 'marcaRegistradaRegistroInpi',
    titulo: 'Registro INPI',
    tipo: 'file',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  marcaRegistradaHojaBocba: {
    nombre: 'marcaRegistradaHojaBocba',
    titulo: 'Hoja del BOCBA',
    tipo: 'file',
    ayuda: 'Con número de acta y fecha del BOCBA',
    opciones: undefined,
    validaciones: undefined
  },
  marcaRegistradaCesion: {
    nombre: 'marcaRegistradaCesion',
    titulo: 'Copia certifica por escribano público de la cesión',
    tipo: 'file',
    ayuda: 'En caso de cesión de uso de marca',
    opciones: undefined,
    validaciones: undefined
  },
  sociedad: {
    nombre: 'sociedad',
    titulo: '¿Pertenecés a una sociedad?',
    tipo: 'checkbox',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  nombreSociedad: {
    nombre: 'nombreSociedad',
    titulo: 'Nombre de la sociedad',
    tipo: 'text',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  razónSocial: {
    nombre: 'razónSocial',
    titulo: 'Razón Social',
    tipo: 'text',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  porcentajeSociedad: {
    nombre: 'porcentajeSociedad',
    titulo: 'Porcentaje de la sociedad',
    tipo: 'number',
    validaciones: {
      number: {
        min: 1,
        max: 100
      }
    },
    opciones: undefined,
    ayuda: undefined
  },
  copiaEstatutoSociedad: {
    nombre: 'copiaEstatutoSociedad',
    titulo: 'Copia del Estatuto de la sociedad',
    tipo: 'file',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  libroRubricado: {
    nombre: 'libroRubricado',
    titulo: 'Necesito libro de rúbrica',
    tipo: 'checkbox',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  desafectacionSociedad: {
    nombre: 'desafectacionSociedad',
    titulo: 'Desafectación de la sociedad',
    tipo: 'checkbox',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  desafectacionSociedadNombre: {
    nombre: 'desafectacionSociedadNombre',
    titulo: 'Nombre de la sociedad a desafectar',
    tipo: 'text',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  motivoDenuncia: {
    nombre: 'motivoDenuncia',
    titulo: 'Motivo de la Denuncia',
    tipo: 'textarea',
    validaciones: {
      max: 3000
    },
    opciones: undefined,
    ayuda: undefined
  },
  archivoDenuncia: {
    nombre: 'archivoDenuncia',
    tipo: 'file',
    titulo: 'Incorporación de Archivo',
    opciones: { multimedia: true },
    ayuda: undefined,
    validaciones: undefined
  },
  cedulaElectronica: {
    nombre: 'cedulaElectronica',
    titulo: 'Adherirse al Sistema de Recepción de Cédula Electrónica',
    tipo: 'checkbox',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  matriculadoDenunciado: {
    nombre: 'matriculadoDenunciado',
    titulo: 'Elegir un Matriculado',
    tipo: 'buscadorMatriculado',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  matriculado: {
    nombre: 'matriculado',
    titulo: 'Elegir un Matriculado',
    tipo: 'buscadorMatriculado',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  checkNoMatriculado: {
    nombre: 'checkNoMatriculado',
    titulo: 'No lo encuentro en la lista',
    tipo: 'checkbox',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  nombreDenunciado: {
    nombre: 'nombreDenunciado',
    titulo: 'Nombre',
    tipo: 'text',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  apellidoDenunciado: {
    nombre: 'apellidoDenunciado',
    titulo: 'Apellido',
    tipo: 'text',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  dniDenunciado: {
    nombre: 'dniDenunciado',
    titulo: 'DNI',
    tipo: 'number',
    validaciones: {
      regex: 'onlyNumbers',
      min: 7,
      max: 8
    },
    opciones: undefined,
    ayuda: undefined
  },
  telefonoDenunciado: {
    nombre: 'telefonoDenunciado',
    titulo: 'Teléfono',
    tipo: 'number',
    validaciones: {
      regex: 'onlyNumbers'
    },
    opciones: undefined,
    ayuda: undefined
  },
  mailDenunciado: {
    nombre: 'mailDenunciado',
    titulo: 'Email',
    tipo: 'text',
    validaciones: {
      regex: 'email'
    },
    opciones: undefined,
    ayuda: undefined
  },
  domicilioDenunciado: {
    nombre: 'domicilioDenunciado',
    titulo: 'Domicilio',
    tipo: 'text',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  numeroMatriculaDenunciado: {
    nombre: 'numeroMatriculaDenunciado',
    titulo: 'Número de Matrícula',
    tipo: 'number',
    validaciones: {
      regex: 'onlyNumbers'
    },
    opciones: undefined,
    ayuda: undefined
  },
  nombreUniversidad: {
    nombre: 'nombreUniversidad',
    tipo: 'text',
    titulo: 'Nombre de la Universidad',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  localidadUniversidad: {
    nombre: 'localidadUniversidad',
    tipo: 'text',
    titulo: 'Localidad de la Universidad',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  fechaInicioCarrera: {
    nombre: 'fechaInicioCarrera',
    tipo: 'date',
    titulo: 'Fecha de Inicio de la Carrera',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  fechaFinCarrera: {
    nombre: 'fechaFinCarrera',
    tipo: 'date',
    titulo: 'Fecha de Fin de la Carrera',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  carreraUniversidad: {
    nombre: 'carreraUniversidad',
    tipo: 'text',
    titulo: 'Carrera Universitaria',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  tituloUniversitario: {
    nombre: 'tituloUniversitario',
    tipo: 'file',
    titulo: 'Título Universitario',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  certificadoAnalitico: {
    nombre: 'certificadoAnalitico',
    tipo: 'file',
    titulo: 'Certificado Analítico',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  certficadoEstadisticasReincidenciasCriminales: {
    nombre: 'certficadoEstadisticasReincidenciasCriminales',
    tipo: 'file',
    titulo: 'Certificado de Reincidencias',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  certificadoJuiciosUniversales: {
    nombre: 'certificadoJuiciosUniversales',
    tipo: 'file',
    titulo: 'Certificado Juicios Universales',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  logo: {
    nombre: 'logo',
    tipo: 'file',
    titulo: 'Logo',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  infraccionAntesDeMatricularse: {
    nombre: 'infraccionAntesDeMatricularse',
    titulo: '¿Posee Infracciones?',
    tipo: 'checkbox',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  arancelesFiscalizacion: {
    nombre: 'arancelesFiscalizacion',
    titulo: 'Aranceles de Fiscalización',
    tipo: 'number',
    validaciones: {
      regex: 'onlyNumbers'
    },
    opciones: undefined,
    ayuda: undefined
  },
  infraccionAntesDeMatricularseMonto: {
    nombre: 'infraccionAntesDeMatricularseMonto',
    titulo: 'Aranceles de Infracción',
    tipo: 'number',
    validaciones: {
      regex: 'onlyNumbers'
    },
    opciones: undefined,
    ayuda: undefined
  },
  motivoPresentacionReclamo: {
    nombre: 'motivoPresentacionReclamo',
    titulo: 'Motivo de la presentación/reclamo',
    tipo: 'textarea',
    validaciones: {
      max: 3000
    },
    opciones: undefined,
    ayuda: undefined
  },
  polizaSeguro: {
    nombre: 'polizaSeguro',
    tipo: 'file',
    titulo: 'Poliza Seguro de Caución',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  usuarioFidelitas: {
    nombre: 'usuarioFidelitas',
    tipo: 'text',
    titulo: 'Usuario',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  claveFidelitas: {
    nombre: 'claveFidelitas',
    tipo: 'text',
    titulo: 'Clave',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  montoSubsidio: {
    nombre: 'montoSubsidio',
    titulo: 'Monto del Subsidio',
    tipo: 'number',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },

  //EXPEDIENTES:
  tipoExpedienteFiscalizacion: {
    nombre: 'tipoExpedienteFiscalizacion',
    tipo: 'select',
    titulo: 'Tipo Expediente',
    opciones: [
      {
        value: 'Cartel en Infracción',
        label: 'Cartel en Infracción'
      },
      {
        value: 'De Oficio',
        label: 'De Oficio'
      },
      {
        value: 'Denuncia',
        label: 'Denuncia'
      },
      {
        value: 'Denuncia Damnificado',
        label: 'Denuncia Damnificado'
      },
      {
        value: 'Denuncia Matriculado',
        label: 'Denuncia Matriculado'
      },
      {
        value: 'Denuncia Whatsapp',
        label: 'Denuncia Whatsapp'
      },
      {
        value: 'Denuncia via e-Mail',
        label: 'Denuncia via e-Mail'
      },
      {
        value: 'Inspección',
        label: 'Inspección'
      },
      {
        value: 'Inspección a Matriculado',
        label: 'Inspección a Matriculado'
      },
      {
        value: 'Oficina Inspeccionada',
        label: 'Oficina Inspeccionada'
      },
      {
        value: 'Via Internet',
        label: 'Via Internet'
      }
    ],
    ayuda: undefined,
    validaciones: undefined
  },
  condicion: {
    nombre: 'condicion',
    tipo: 'select',
    titulo: 'Condición',
    opciones: [
      {
        value: 'Presunto Ilegal',
        label: 'Presunto Ilegal'
      },
      {
        value: 'Presunto Infractor',
        label: 'Presunto Infractor'
      },
      {
        value: 'Presunto Infractor de extrana jurisdicción',
        label: 'Presunto Infractor de extrana jurisdicción'
      }
    ],
    ayuda: undefined,
    validaciones: undefined
  },
  selectTipoActa: {
    nombre: 'selectTipoActa',
    tipo: 'select',
    titulo: 'Acta',
    opciones: [
      {
        value: 'Inspección',
        label: 'Inspección'
      },
      {
        value: 'Comprobación',
        label: 'Comprobación'
      },
      {
        value: 'Administrativo',
        label: 'Administrativo'
      }
    ],
    ayuda: undefined,
    validaciones: undefined
  },
  numeroActa: {
    nombre: 'numeroActa',
    titulo: 'Número de Acta',
    tipo: 'number',
    validaciones: {
      regex: 'onlyNumbers'
    },
    opciones: undefined,
    ayuda: undefined
  },
  numeroExpediente: {
    nombre: 'numeroExpediente',
    titulo: 'Expediente',
    tipo: 'number',
    validaciones: {
      regex: 'onlyNumbers'
    },
    opciones: undefined,
    ayuda: undefined
  },
  fechaActa: {
    nombre: 'fechaActa',
    tipo: 'dateTime',
    titulo: 'Fecha',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  denominacion: {
    nombre: 'denominacion',
    tipo: 'text',
    titulo: 'Denominación',
    validaciones: {
      min: 3,
      max: 100
    },
    opciones: undefined,
    ayuda: undefined
  },
  ubicado: {
    nombre: 'ubicado',
    tipo: 'text',
    titulo: 'Ubicado/a',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  ubicadoNumero: {
    nombre: 'ubicadoNumero',
    tipo: 'number',
    titulo: 'Nro.',
    validaciones: {
      max: 9,
      regex: 'onlyNumbers'
    },
    opciones: undefined,
    ayuda: undefined
  },
  ubicadoSelect: {
    nombre: 'ubicadoSelect',
    tipo: 'select',
    titulo: '',
    opciones: [
      {
        value: 'A la Calle',
        label: 'A la Calle'
      },
      {
        value: 'En Altura',
        label: 'En Altura'
      }
    ],
    ayuda: undefined,
    validaciones: undefined
  },
  piso: {
    nombre: 'piso',
    tipo: 'text',
    titulo: 'Piso',
    validaciones: {
      min: 1,
      max: 10
    },
    opciones: undefined,
    ayuda: undefined
  },
  oficinaDpto: {
    nombre: 'oficinaDpto',
    tipo: 'text',
    titulo: 'Ofic./Dpto.',
    validaciones: {
      min: 1,
      max: 10
    },
    opciones: undefined,
    ayuda: undefined
  },
  barrio: {
    nombre: 'barrio',
    tipo: 'text',
    titulo: 'Barrio',
    validaciones: {
      min: 1,
      max: 50
    },
    opciones: undefined,
    ayuda: undefined
  },
  barrioCodigoPostal: {
    nombre: 'barrioCodigoPostal',
    tipo: 'text',
    titulo: 'Código Postal',
    validaciones: {
      min: 1,
      max: 10
    },
    opciones: undefined,
    ayuda: undefined
  },
  atendido: {
    nombre: 'atendido',
    tipo: 'text',
    titulo: 'Atendido',
    validaciones: {
      min: 1,
      max: 50
    },
    opciones: undefined,
    ayuda: undefined
  },
  seleccionarDNIAtendido: {
    nombre: 'seleccionarDNIAtendido',
    tipo: 'select',
    titulo: 'Tipo de Documento',
    opciones: [
      {
        value: 'D.N.I',
        label: 'D.N.I'
      },
      {
        value: 'Libreta Cívica',
        label: 'Libreta Cívica'
      },
      {
        value: 'Pasaporte',
        label: 'Pasaporte'
      }
    ],
    ayuda: undefined,
    validaciones: undefined
  },
  numeroDNIAtendido: {
    nombre: 'numeroDNIAtendido',
    tipo: 'text',
    titulo: 'Nro.',
    validaciones: {
      min: 1,
      max: 9
    },
    opciones: undefined,
    ayuda: undefined
  },
  caracterDe: {
    nombre: 'caracterDe',
    tipo: 'text',
    titulo: 'Carácter de',
    validaciones: {
      min: 1,
      max: 50
    },
    opciones: undefined,
    ayuda: undefined
  },
  responsables: {
    nombre: 'responsables',
    tipo: 'text',
    titulo: 'Responsable/s',
    validaciones: {
      min: 1,
      max: 50
    },
    opciones: undefined,
    ayuda: undefined
  },
  seleccionarDNIResponsable: {
    nombre: 'seleccionarDNIResponsable',
    tipo: 'select',
    titulo: 'Tipo de Documento',
    opciones: [
      {
        value: 'D.N.I',
        label: 'D.N.I'
      },
      {
        value: 'Libreta Cívica',
        label: 'Libreta Cívica'
      },
      {
        value: 'Pasaporte',
        label: 'Pasaporte'
      }
    ],
    ayuda: undefined,
    validaciones: undefined
  },
  numeroDNIResponsable: {
    nombre: 'numeroDNIResponsable',
    tipo: 'text',
    titulo: 'Nro.',
    validaciones: {
      min: 1,
      max: 9,
      regex: 'onlyNumbers'
    },
    opciones: undefined,
    ayuda: undefined
  },
  esMatriculado: {
    nombre: 'esMatriculado',
    tipo: 'select',
    titulo: 'Matriculado',
    opciones: [
      {
        value: 'Si',
        label: 'Si'
      },
      {
        value: 'No',
        label: 'No'
      },
      {
        value: 'En Trámite',
        label: 'En Trámite'
      }
    ],
    ayuda: undefined,
    validaciones: undefined
  },
  fechaInicioTramite: {
    nombre: 'fechaInicioTramite',
    tipo: 'date',
    titulo: 'Fecha Inicio del Trámite',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  domicilioElectronico: {
    nombre: 'domicilioElectronico',
    tipo: 'text',
    titulo: 'Domicilio Electrónico',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  domicilioProfesional: {
    nombre: 'domicilioProfesional',
    tipo: 'text',
    titulo: 'Domicilio Profesional',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  paginaWeb: {
    nombre: 'paginaWeb',
    tipo: 'text',
    titulo: 'Página Web',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  habilitacionMunicipalTitular: {
    nombre: 'habilitacionMunicipalTitular',
    tipo: 'text',
    titulo: 'Habilitación Municipal Titular',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  caracterHabilitacion: {
    nombre: 'caracterHabilitacion',
    tipo: 'text',
    titulo: 'Carácter de la Habilitación',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  colegiados: {
    nombre: 'colegiados',
    tipo: 'text',
    titulo: 'Colegiados',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  librosRubricados: {
    nombre: 'librosRubricados',
    tipo: 'text',
    titulo: 'Libros Rubricados',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  fechaRubricacion: {
    nombre: 'fechaRubricacion',
    tipo: 'date',
    titulo: 'Fecha de Rubricación',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  fianza: {
    nombre: 'fianza',
    tipo: 'text',
    titulo: 'Fianza (Art. 4, inc. 4 y Art. 6 Ley 2.340)',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  cuotaAnual: {
    nombre: 'cuotaAnual',
    tipo: 'text',
    titulo: 'Cuota Anual',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  observaciones: {
    nombre: 'observaciones',
    tipo: 'textarea',
    titulo: 'Observaciones',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  fechaConcurrir: {
    nombre: 'fechaConcurrir',
    tipo: 'dateTime',
    titulo: 'Fecha a Concurrir',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  estadoFiscalizacion: {
    nombre: 'estadoFiscalizacion',
    tipo: 'select',
    titulo: 'Estado',
    opciones: [
      {
        value: 'archivada',
        label: 'Archivada'
      },
      {
        value: 'causa_penal',
        label: 'Causa Penal'
      },
      {
        value: 'pendiente',
        label: 'Pendiente'
      }
    ],
    ayuda: undefined,
    validaciones: undefined
  },
  checkInvitado: {
    nombre: 'checkInvitado',
    tipo: 'checkbox',
    titulo: 'LLevaras Invitados',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  nombreInvitado1: {
    nombre: 'nombreInvitado1',
    tipo: 'text',
    titulo: 'Nombre del Invitado 1',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  nombreInvitado2: {
    nombre: 'nombreInvitado2',
    tipo: 'text',
    titulo: 'Nombre del Invitado 2',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  apellidoInvitado1: {
    nombre: 'apellidoInvitado1',
    tipo: 'text',
    titulo: 'Apellido del Invitado 1',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  apellidoInvitado2: {
    nombre: 'apellidoInvitado2',
    tipo: 'text',
    titulo: 'Apellido del Invitado 2',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  dniInvitado1: {
    nombre: 'dniInvitado1',
    tipo: 'number',
    titulo: 'DNI del Invitado 1',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  dniInvitado2: {
    nombre: 'dniInvitado2',
    tipo: 'number',
    titulo: 'DNI del Invitado 2',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  firmaInmobiliaria: {
    nombre: 'firmaInmobiliaria',
    tipo: 'text',
    titulo: 'Firma Inmobiliaria',
    opciones: undefined,
    ayuda: undefined,
    validaciones: undefined
  },
  formaPago: {
    nombre: 'formaPago',
    tipo: 'select',
    titulo: 'Forma de Pago',
    opciones: [
      {
        value: 'efectivo',
        label: 'Efectivo'
      },
      {
        value: 'cheque',
        label: 'Cheque'
      },
      {
        value: 'transferencia',
        label: 'Transferencia'
      }
    ],
    ayuda: undefined,
    validaciones: undefined
  }
}; /* satisfies { [key: string]: IInputSeed } */

export type InputName = keyof typeof inputsSeed;
