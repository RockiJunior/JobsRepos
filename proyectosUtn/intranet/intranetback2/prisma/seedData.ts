import {
  Area,
  Concepto,
  Permiso,
  PermisoRol,
  Rol,
  TipoTransaccion
} from '@prisma/client';
import CryptoJS from 'crypto-js';
import dayjs from 'dayjs';
import objPermisos from '../src/data/permisos';
import rol from '../src/data/roles';
import getKeys from '../src/utils/getKeys';
import area from '../src/data/areas';

//IMPORTACION PDF:
import actividadComercial from '../src/data/pdf/ddjj/actividadComercial';
import altaMatriculacionCesantiaText from '../src/data/pdf/ddjj/altaMatriculaCesantia';
import bajaMatriculaProfesional from '../src/data/pdf/ddjj/bajaMatriculaProfesional';
import noActividadComercial from '../src/data/pdf/ddjj/noActividadComercial';
import solicitudLicenciaPasividad from '../src/data/pdf/ddjj/solicitudLicenciaPasividad';
import citacionRatificacion from '../src/data/pdf/denuncia/citacionRatificacion';
import descargoParticular from '../src/data/pdf/denuncia/decargoParticular';
import descargoOficio from '../src/data/pdf/denuncia/descargoOficio';
import imputacion from '../src/data/pdf/denuncia/imputaciones';
import cedula from '../src/data/pdf/cedula/cedulaPlantilla';

declare const process: {
  env: {
    CRYPTO_SECRET: string;
    LOCAL: boolean;
  };
};

export const conceptosTransacciones: { [key: string]: Concepto } = {
  gastosAdministrativos: {
    id: 1,
    nombre: 'Gastos Administrativos',
    nombreMontoPorcentaje: null,
    monto: null,
    porcentaje: null,
    padre: null,
    tipo: 'tramite'
  },
  matricula: {
    id: 2,
    nombre: 'Matrícula Anual',
    nombreMontoPorcentaje: null,
    monto: null,
    porcentaje: null,
    padre: null,
    tipo: 'tramite'
  },
  adelantoMatricula: {
    id: 3,
    nombre: 'Adelanto de Matrícula Anual',
    nombreMontoPorcentaje: null,
    monto: null,
    porcentaje: null,
    padre: null,
    tipo: 'tramite'
  },
  inscripcion: {
    id: 4,
    nombre: 'Inscripción',
    nombreMontoPorcentaje: null,
    monto: null,
    porcentaje: null,
    padre: null,
    tipo: 'tramite'
  },
  fianzaFiduciaria: {
    id: 5,
    nombre: 'Fianza Fiduciaria',
    nombreMontoPorcentaje: null,
    monto: null,
    porcentaje: null,
    padre: null,
    tipo: 'tramite'
  },
  libroRubricado: {
    id: 6,
    nombre: 'Libro Rubricado',
    nombreMontoPorcentaje: null,
    monto: null,
    porcentaje: null,
    padre: null,
    tipo: 'tramite'
  },
  certificadoCotizaciones: {
    id: 7,
    nombre: 'Certificado Cotizaciones',
    nombreMontoPorcentaje: null,
    monto: null,
    porcentaje: null,
    padre: null,
    tipo: 'tramite'
  },
  multaInfraccionesAntesDeMatricularse: {
    id: 8,
    nombre: 'Multa por infracciones cometidas antes de matricularse',
    nombreMontoPorcentaje: null,
    monto: null,
    porcentaje: null,
    padre: null,
    tipo: 'tramite'
  },
  arancelesDeFiscalizacion: {
    id: 9,
    nombre: 'Aranceles de Fiscalización',
    nombreMontoPorcentaje: null,
    monto: null,
    porcentaje: null,
    padre: null,
    tipo: 'tramite'
  },

  aperturaArmadoExpteAdministrativo: {
    id: 10,
    nombre: 'Apertura y armado de expediente administrativo',
    nombreMontoPorcentaje: 'sueldoVitalMovil',
    monto: null,
    porcentaje: 18.15,
    padre: 'arancelesFiscalizacionNoMatriculado',
    tipo: 'fiscalizacion'
  },
  busquedaInternetImpresionesRelativas: {
    id: 11,
    nombre: 'Búsqueda en internet e impresiones relativas',
    nombreMontoPorcentaje: 'sueldoVitalMovil',
    monto: null,
    porcentaje: 10,
    padre: 'arancelesFiscalizacionNoMatriculado',
    tipo: 'fiscalizacion'
  },
  actaInspeccion: {
    id: 12,
    nombre: 'Acta de inspección c/u',
    nombreMontoPorcentaje: 'sueldoVitalMovil',
    monto: null,
    porcentaje: 12,
    padre: 'arancelesFiscalizacionNoMatriculado',
    tipo: 'fiscalizacion'
  },
  cdIntimacion: {
    id: 13,
    nombre: 'CD de intimación c/u',
    nombreMontoPorcentaje: 'sueldoVitalMovil',
    monto: null,
    porcentaje: 9,
    padre: 'arancelesFiscalizacionNoMatriculado',
    tipo: 'fiscalizacion'
  },
  avisoVisitaIntimacionCitacion: {
    id: 14,
    nombre: 'Aviso de visita-intimación-citación c/u',
    nombreMontoPorcentaje: 'sueldoVitalMovil',
    monto: null,
    porcentaje: 8.9,
    padre: 'arancelesFiscalizacionNoMatriculado',
    tipo: 'fiscalizacion'
  },
  cedulaNotificacion: {
    id: 15,
    nombre: 'Cédula de notificación',
    nombreMontoPorcentaje: 'sueldoVitalMovil',
    monto: null,
    porcentaje: 6.6,
    padre: 'arancelesFiscalizacionNoMatriculado',
    tipo: 'fiscalizacion'
  },
  fajaInfractorColocacionOVista: {
    id: 16,
    nombre: 'Faja de infractor con colocación o vista c/u',
    nombreMontoPorcentaje: 'sueldoVitalMovil',
    monto: null,
    porcentaje: 9,
    padre: 'arancelesFiscalizacionNoMatriculado',
    tipo: 'fiscalizacion'
  },
  notaSimpleIntimacionORespuesta: {
    id: 17,
    nombre: 'Nota simple de intimación o respuesta c/u',
    nombreMontoPorcentaje: 'sueldoVitalMovil',
    monto: null,
    porcentaje: 6.6,
    padre: 'arancelesFiscalizacionNoMatriculado',
    tipo: 'fiscalizacion'
  },
  distribucionVolantes: {
    id: 18,
    nombre: 'Distribución de volantes x 500 unidades',
    nombreMontoPorcentaje: 'sueldoVitalMovil',
    monto: null,
    porcentaje: 40,
    padre: 'arancelesFiscalizacionNoMatriculado',
    tipo: 'fiscalizacion'
  },
  actaComparencia: {
    id: 19,
    nombre: 'Acta de comparecencia c/u',
    nombreMontoPorcentaje: 'sueldoVitalMovil',
    monto: null,
    porcentaje: 8.25,
    padre: 'arancelesFiscalizacionNoMatriculado',
    tipo: 'fiscalizacion'
  },
  cartaCertificada: {
    id: 20,
    nombre: 'Carta certificada c/u',
    nombreMontoPorcentaje: 'sueldoVitalMovil',
    monto: null,
    porcentaje: 7,
    padre: 'arancelesFiscalizacionNoMatriculado',
    tipo: 'fiscalizacion'
  },
  aperturaArmadoExpteAdministrativoMatriculado: {
    id: 21,
    nombre: 'Apertura y armado de expediente administrativo',
    nombreMontoPorcentaje: 'sueldoVitalMovil',
    monto: null,
    porcentaje: 18.15,
    padre: 'arancelesFiscalizacionNoMatriculado',
    tipo: 'fiscalizacion'
  },
  busquedaInternetImpresionesRelativasMatriculado: {
    id: 22,
    nombre: 'Búsqueda en internet e impresiones relativas',
    nombreMontoPorcentaje: 'sueldoVitalMovil',
    monto: null,
    porcentaje: 10,
    padre: 'arancelesFiscalizacionMatriculado',
    tipo: 'fiscalizacion'
  },
  actaInspeccionMatriculado: {
    id: 23,
    nombre: 'Acta de inspección',
    nombreMontoPorcentaje: 'sueldoVitalMovil',
    monto: null,
    porcentaje: 12,
    padre: 'arancelesFiscalizacionMatriculado',
    tipo: 'fiscalizacion'
  },
  avisoVisitaIntimacionCitacionMatriculado: {
    id: 24,
    nombre: 'Aviso de visita, intimación y citación',
    nombreMontoPorcentaje: 'sueldoVitalMovil',
    monto: null,
    porcentaje: 8.9,
    padre: 'arancelesFiscalizacionMatriculado',
    tipo: 'fiscalizacion'
  },
  cedulaNotificacionMatriculado: {
    id: 25,
    nombre: 'Cédula de notificación',
    nombreMontoPorcentaje: 'sueldoVitalMovil',
    monto: null,
    porcentaje: 6.6,
    padre: 'arancelesFiscalizacionMatriculado',
    tipo: 'fiscalizacion'
  },
  notaSimple: {
    id: 26,
    nombre: 'Nota simple',
    nombreMontoPorcentaje: 'sueldoVitalMovil',
    monto: null,
    porcentaje: 6.6,
    padre: 'arancelesFiscalizacionMatriculado',
    tipo: 'fiscalizacion'
  },
  cartaDocumento: {
    id: 27,
    nombre: 'Carta documento',
    nombreMontoPorcentaje: 'sueldoVitalMovil',
    monto: null,
    porcentaje: 9,
    padre: 'arancelesFiscalizacionMatriculado',
    tipo: 'fiscalizacion'
  },
  cartaCertificadaMatriculado: {
    id: 28,
    nombre: 'Carta certificada',
    nombreMontoPorcentaje: 'sueldoVitalMovil',
    monto: null,
    porcentaje: 7,
    padre: 'arancelesFiscalizacionMatriculado',
    tipo: 'fiscalizacion'
  },
  actaComparenciaMatriculado: {
    id: 29,
    nombre: 'Acta de comparecencia',
    nombreMontoPorcentaje: 'sueldoVitalMovil',
    monto: null,
    porcentaje: 8.25,
    padre: 'arancelesFiscalizacionMatriculado',
    tipo: 'fiscalizacion'
  },
  faltaObleaActualizada: {
    id: 30,
    nombre:
      'Falta de colocacion de oblea actualizada en vidriera o lugar visible',
    nombreMontoPorcentaje: 'sueldoVitalMovil',
    monto: null,
    porcentaje: 8.4,
    padre: 'arancelesInfraccionMatriculado',
    tipo: 'fiscalizacion'
  },
  faltaIdentificacionMatriculado: {
    id: 31,
    nombre:
      'Falta de identificación del matriculado en cartelería por cada cartel',
    nombreMontoPorcentaje: 'sueldoVitalMovil',
    monto: null,
    porcentaje: 4.2,
    padre: 'arancelesInfraccionMatriculado',
    tipo: 'fiscalizacion'
  },
  faltaIdentificacionPublicidad: {
    id: 32,
    nombre:
      'Falta de identificación en publicidad (web, public. gráficas) p/c aviso',
    nombreMontoPorcentaje: 'sueldoVitalMovil',
    monto: null,
    porcentaje: 4.2,
    padre: 'arancelesInfraccionMatriculado',
    tipo: 'fiscalizacion'
  },
  faltaPresentacionActualizacionDatos: {
    id: 33,
    nombre:
      'Falta de presentación de actualización de datos declaracion Jurada Prof.',
    nombreMontoPorcentaje: 'sueldoVitalMovil',
    monto: null,
    porcentaje: 10,
    padre: 'arancelesInfraccionMatriculado',
    tipo: 'fiscalizacion'
  },
  faltaLibroRubricado: {
    id: 34,
    nombre: 'Falta de libro rubricado Art. 14 Ley 2340',
    nombreMontoPorcentaje: 'sueldoVitalMovil',
    monto: null,
    porcentaje: 10,
    padre: 'arancelesInfraccionMatriculado',
    tipo: 'fiscalizacion'
  },
  publicacionOPromocionSinComision: {
    id: 35,
    nombre: 'Publicación o promoción de sin Comisión y/o Tasaciones sin cargo',
    nombreMontoPorcentaje: 'sueldoVitalMovil',
    monto: null,
    porcentaje: 13.5,
    padre: 'arancelesInfraccionMatriculado',
    tipo: 'fiscalizacion'
  },
  identificacionesNODeclaradasEnAvisos: {
    id: 36,
    nombre: 'Identificaciones no declaradas en avisos c/u',
    nombreMontoPorcentaje: 'sueldoVitalMovil',
    monto: null,
    porcentaje: 10,
    padre: 'arancelesInfraccionMatriculado',
    tipo: 'fiscalizacion'
  },
  hastaMaximoUnAñoSinRegularizar: {
    id: 37,
    nombre: 'Hasta máximo 1 año sin regularizar',
    nombreMontoPorcentaje: 'matriculaAnual',
    monto: null,
    porcentaje: 150,
    padre: 'arancelesInfraccionNoMatriculado',
    tipo: 'fiscalizacion'
  },
  masUnAñoYHastaDosSinRegularizar: {
    id: 38,
    nombre: 'Con más de 1 año y hasta un máximo de 2 años sin regularizar',
    nombreMontoPorcentaje: 'matriculaAnual',
    monto: null,
    porcentaje: 300,
    padre: 'arancelesInfraccionNoMatriculado',
    tipo: 'fiscalizacion'
  },
  masDosYHastaTresSinRegularizar: {
    id: 39,
    nombre: 'Con más de 2 años y hasta un máximo de 3 años sin regularizar',
    nombreMontoPorcentaje: 'matriculaAnual',
    monto: null,
    porcentaje: 400,
    padre: 'arancelesInfraccionNoMatriculado',
    tipo: 'fiscalizacion'
  },
  masTresYHastaCuatroSinRegularizar: {
    id: 40,
    nombre: 'Con más de 3 años y hasta un máximo de 4 años sin regularizar',
    nombreMontoPorcentaje: 'matriculaAnual',
    monto: null,
    porcentaje: 500,
    padre: 'arancelesInfraccionNoMatriculado',
    tipo: 'fiscalizacion'
  },
  masCuatroYHastaCincoSinRegularizar: {
    id: 41,
    nombre: 'Con más de 4 años y hasta un máximo de 5 años sin regularizar',
    nombreMontoPorcentaje: 'matriculaAnual',
    monto: null,
    porcentaje: 600,
    padre: 'arancelesInfraccionNoMatriculado',
    tipo: 'fiscalizacion'
  },
  masCincoYHastaSieteSinRegularizar: {
    id: 42,
    nombre: 'Con más de 5 años y hasta un máximo de 7 años sin regularizar',
    nombreMontoPorcentaje: 'matriculaAnual',
    monto: null,
    porcentaje: 800,
    padre: 'arancelesInfraccionNoMatriculado',
    tipo: 'fiscalizacion'
  },
  masSieteYHastaOchoSinRegularizar: {
    id: 43,
    nombre: 'Con más de 7 años y hasta un máximo de 8 años sin regularizar',
    nombreMontoPorcentaje: 'matriculaAnual',
    monto: null,
    porcentaje: 900,
    padre: 'arancelesInfraccionNoMatriculado',
    tipo: 'fiscalizacion'
  },
  masOchoYHastaNueveSinRegularizar: {
    id: 44,
    nombre: 'Con más de 8 años y hasta un máximo de 9 años sin regularizar',
    nombreMontoPorcentaje: 'matriculaAnual',
    monto: null,
    porcentaje: 1000,
    padre: 'arancelesInfraccionNoMatriculado',
    tipo: 'fiscalizacion'
  }
};

interface IOpcionCuotas {
  activo: boolean;
  cantidad: number;
  monto: number;
  cuotas: { id: number; monto: number }[];
  interes: number;
}

interface ITipoTransaccion {
  conceptos: Concepto[];
  opcionesCuotas: IOpcionCuotas[];
  nombre: string;
}

export const tiposTransaccion: ITipoTransaccion[] = [
  {
    nombre: 'matriculacion1',
    conceptos: [conceptosTransacciones.gastosAdministrativos],
    opcionesCuotas: [
      {
        activo: true,
        cantidad: 1,
        monto: 15000,
        cuotas: [{ id: 1, monto: 1000 }],
        interes: 0
      }
    ]
  },
  {
    nombre: 'matriculacion2',
    conceptos: [
      conceptosTransacciones.matricula,
      conceptosTransacciones.inscripcion,
      conceptosTransacciones.fianzaFiduciaria
    ],
    opcionesCuotas: [
      {
        activo: true,
        cantidad: 1,
        monto: 169000,
        cuotas: [{ id: 1, monto: 169000 }],
        interes: 0
      },
      {
        activo: true,
        cantidad: 3,
        monto: 184000,
        cuotas: [
          { id: 1, monto: 62000 },
          { id: 2, monto: 61000 },
          { id: 3, monto: 61000 }
        ],
        interes: 0
      },
      {
        activo: true,
        cantidad: 6,
        monto: 184000,
        cuotas: [
          { id: 1, monto: 31500 },
          { id: 2, monto: 30500 },
          { id: 3, monto: 30500 },
          { id: 4, monto: 30500 },
          { id: 5, monto: 30500 },
          { id: 6, monto: 30500 }
        ],
        interes: 0
      },
      {
        activo: true,
        cantidad: 10,
        monto: 184000,
        cuotas: [
          { id: 1, monto: 18400 },
          { id: 2, monto: 18400 },
          { id: 3, monto: 18400 },
          { id: 4, monto: 18400 },
          { id: 5, monto: 18400 },
          { id: 6, monto: 18400 },
          { id: 7, monto: 18400 },
          { id: 8, monto: 18400 },
          { id: 9, monto: 18400 },
          { id: 10, monto: 18400 }
        ],
        interes: 0
      }
    ]
  },
  {
    nombre: 'matriculacion3',
    conceptos: [
      conceptosTransacciones.adelantoMatricula,
      conceptosTransacciones.inscripcion,
      conceptosTransacciones.fianzaFiduciaria
    ],
    opcionesCuotas: [
      {
        activo: true,
        cantidad: 1,
        monto: 169000,
        cuotas: [{ id: 1, monto: 169000 }],
        interes: 0
      },
      {
        activo: true,
        cantidad: 3,
        monto: 184000,
        cuotas: [
          { id: 1, monto: 62000 },
          { id: 2, monto: 61000 },
          { id: 3, monto: 61000 }
        ],
        interes: 0
      },
      {
        activo: true,
        cantidad: 6,
        monto: 184000,
        cuotas: [
          { id: 1, monto: 31500 },
          { id: 2, monto: 30500 },
          { id: 3, monto: 30500 },
          { id: 4, monto: 30500 },
          { id: 5, monto: 30500 },
          { id: 6, monto: 30500 }
        ],
        interes: 0
      },
      {
        activo: true,
        cantidad: 10,
        monto: 184000,
        cuotas: [
          { id: 1, monto: 18400 },
          { id: 2, monto: 18400 },
          { id: 3, monto: 18400 },
          { id: 4, monto: 18400 },
          { id: 5, monto: 18400 },
          { id: 6, monto: 18400 },
          { id: 7, monto: 18400 },
          { id: 8, monto: 18400 },
          { id: 9, monto: 18400 },
          { id: 10, monto: 18400 }
        ],
        interes: 0
      }
    ]
  },
  {
    nombre: 'libroRubricado',
    conceptos: [conceptosTransacciones.libroRubricado],
    opcionesCuotas: [
      {
        activo: true,
        cantidad: 1,
        monto: 1000,
        cuotas: [
          {
            id: 1,
            monto: 1000
          }
        ],
        interes: 0
      }
    ]
  },
  {
    nombre: 'certificadoCotizaciones',
    conceptos: [conceptosTransacciones.certificadoCotizaciones],
    opcionesCuotas: [
      {
        activo: true,
        cantidad: 1,
        monto: 1000,
        cuotas: [
          {
            id: 1,
            monto: 1000
          }
        ],
        interes: 0
      }
    ]
  },
  {
    nombre: 'infraccionAntesDeMatricularse1',
    conceptos: [
      conceptosTransacciones.multaInfraccionesAntesDeMatricularse,
      conceptosTransacciones.arancelesDeFiscalizacion
    ],
    opcionesCuotas: [
      {
        activo: true,
        cantidad: 1,
        monto: 0,
        cuotas: [{ id: 1, monto: 0 }],
        interes: 0
      }
    ]
  },
  {
    nombre: 'infraccionAntesDeMatricularse2',
    conceptos: [
      conceptosTransacciones.multaInfraccionesAntesDeMatricularse,
      conceptosTransacciones.arancelesDeFiscalizacion
    ],
    opcionesCuotas: [
      {
        activo: true,
        cantidad: 1,
        monto: 0,
        cuotas: [{ id: 1, monto: 0 }],
        interes: 0
      },
      {
        activo: true,
        cantidad: 3,
        monto: 0,
        cuotas: [
          { id: 1, monto: 0 },
          { id: 2, monto: 0 },
          { id: 3, monto: 0 }
        ],
        interes: 10
      }
    ]
  },
  {
    nombre: 'infraccionAntesDeMatricularse3',
    conceptos: [
      conceptosTransacciones.multaInfraccionesAntesDeMatricularse,
      conceptosTransacciones.arancelesDeFiscalizacion
    ],
    opcionesCuotas: [
      {
        activo: true,
        cantidad: 1,
        monto: 0,
        cuotas: [{ id: 1, monto: 0 }],
        interes: 0
      },
      {
        activo: true,
        cantidad: 3,
        monto: 0,
        cuotas: [
          { id: 1, monto: 0 },
          { id: 2, monto: 0 },
          { id: 3, monto: 0 }
        ],
        interes: 10
      },
      {
        activo: true,
        cantidad: 6,
        monto: 0,
        cuotas: [
          { id: 1, monto: 0 },
          { id: 2, monto: 0 },
          { id: 3, monto: 0 },
          { id: 4, monto: 0 },
          { id: 5, monto: 0 },
          { id: 6, monto: 0 }
        ],
        interes: 10
      }
    ]
  }
];

const mapPermisos = (): Permiso[] => {
  const permisos: Permiso[] = [];

  getKeys(objPermisos).forEach((key) => {
    getKeys(objPermisos[key]).forEach((key2) => {
      permisos.push({
        id: objPermisos[key][key2],
        nombre: key2
      });
    });
  });
  return permisos;
};

export const permisos: Permiso[] = mapPermisos();

export const roles: Rol[] = [
  {
    id: 1,
    nombre: 'administrador',
    deletedAt: null
  },
  {
    id: 2,
    nombre: 'supervisor',
    deletedAt: null
  },
  {
    id: 3,
    nombre: 'jefe_Area',
    deletedAt: null
  },
  {
    id: 4,
    nombre: 'empleado',
    deletedAt: null
  }
];

const objPermisoRol: { rol: number; permisos: number[] }[] = [
  {
    rol: rol.administrador,
    permisos: [
      objPermisos.tramites.ver_tramites_todos,
      objPermisos.expedientes.ver_expedientes_todos,
      objPermisos.cedulas.ver_cedulas_todas,
      objPermisos.turnos.ver_turnos_todos,
      objPermisos.eventos.ver_eventos,
      objPermisos.eventos.crear_eventos,
      objPermisos.empleados.ver_empleados,
      objPermisos.empleados.crear_empleados,
      objPermisos.empleados.modificar_empleados,
      objPermisos.empleados.eliminar_empleados,
      objPermisos.roles.ver_roles,
      objPermisos.roles.crear_roles,
      objPermisos.roles.modificar_roles,
      objPermisos.roles.eliminar_roles,
      objPermisos.usuarios.ver_usuarios,
      objPermisos.transacciones.ver_transacciones_todas
    ]
  },
  {
    rol: rol.supervisor,
    permisos: [
      objPermisos.tramites.ver_tramites_todos,
      objPermisos.expedientes.ver_expedientes_todos,
      objPermisos.turnos.ver_turnos_todos,
      objPermisos.eventos.ver_eventos,
      objPermisos.empleados.ver_empleados,
      objPermisos.roles.ver_roles,
      objPermisos.usuarios.ver_usuarios,
      objPermisos.transacciones.ver_transacciones_todas,
      objPermisos.cedulas.ver_cedulas_todas
    ]
  },
  {
    rol: rol.jefe_Area,
    permisos: [
      objPermisos.tramites.crear_tramite,
      objPermisos.tramites.ver_tramites_area,
      objPermisos.expedientes.crear_expediente,
      objPermisos.expedientes.ver_expedientes_area,
      objPermisos.cedulas.ver_cedulas_area,
      objPermisos.area.asignar_empleados,
      objPermisos.area.ver_disponibilidad,
      objPermisos.area.modificar_disponibilidad,
      objPermisos.notificaciones.notificacion_plazos_vencidos,
      objPermisos.eventos.ver_eventos,
      objPermisos.eventos.crear_eventos,
      objPermisos.eventos.modificar_eventos,
      objPermisos.eventos.eliminar_eventos,
      objPermisos.eventos.ver_lista_espera,
      objPermisos.turnos.ver_turnos_reservados_area,
      objPermisos.usuarios.ver_usuarios,
      objPermisos.transacciones.ver_transacciones_todas
    ]
  },
  {
    rol: rol.empleado,
    permisos: [
      objPermisos.tramites.crear_tramite,
      objPermisos.tramites.ver_tramites_area,
      objPermisos.expedientes.crear_expediente,
      objPermisos.expedientes.ver_expedientes_area,
      objPermisos.turnos.ver_turnos_reservados_area,
      objPermisos.eventos.ver_eventos,
      objPermisos.usuarios.ver_usuarios,
      objPermisos.transacciones.ver_transacciones
    ]
  }
];

const mapPermisosRoles = (): PermisoRol[] => {
  const permisosRoles: PermisoRol[] = [];

  objPermisoRol.forEach((obj) => {
    obj.permisos.forEach((permiso) => {
      permisosRoles.push({
        rolId: obj.rol,
        permisoId: permiso
      });
    });
  });
  return permisosRoles;
};

export const permisosRoles: PermisoRol[] = mapPermisosRoles();

export const areas: Area[] = [
  {
    id: 1,
    nombre: 'Matriculación'
  },
  {
    id: 2,
    nombre: 'Finanzas'
  },
  {
    id: 3,
    nombre: 'Legales'
  },
  {
    id: 4,
    nombre: 'Comisión de Matriculación'
  },
  {
    id: 5,
    nombre: 'Fiscalización'
  },
  {
    id: 6,
    nombre: 'Honorable Consejo Directivo'
  },
  {
    id: 7,
    nombre: 'Tesorero'
  },
  {
    id: 8,
    nombre: 'Secretario'
  },
  {
    id: 9,
    nombre: 'Presidente'
  },
  {
    id: 10,
    nombre: 'Inspección'
  },
  {
    id: 11,
    nombre: 'Comisión de Fiscalización'
  },
  {
    id: 12,
    nombre: 'Administración'
  },
  {
    id: 13,
    nombre: 'Mesa de Entrada'
  },
  {
    id: 14,
    nombre: 'Tribunal de Ética'
  }
];

const encryptPassword = CryptoJS.AES.encrypt(
  '123456',
  process.env.CRYPTO_SECRET
).toString();

const encryptPasswordAdmin = CryptoJS.AES.encrypt(
  'cucicba2023',
  process.env.CRYPTO_SECRET
).toString();

/* interface UsuarioSeed {
  nombre: string;
  apellido: string;
  email: string;
  contrasenia: string;
  dni: string;
  verificado: boolean;
  datos?: { [key: string]: { value?: string; archivo?: string } };
} */

export const usuarios = {
  aspiranteUno: {
    nombre: 'Aspirante',
    apellido: 'Uno',
    email: 'aspirante@uno.com',
    contrasenia: encryptPassword,
    dni: '38597510',
    verificado: true,
    datos: {
      nombre: { value: 'Aspirante' },
      apellido: { value: 'Uno' },
      mailParticular: { value: 'aspirante@uno.com' },
      dni: { value: '38597510' },
      cuitCuil: { value: '20385975109' },
      domicilioLegal: { value: 'Calle falsa 123' },
      codigoPostalLegal: { value: '1234' },
      domicilioReal: { value: 'Calle falsa 123' },
      codigoPostalReal: { value: '1234' },
      telefonoParticular: { value: '1234567891' },
      celularParticular: { value: '1234567891' }
    }
  },
  aspiranteDos: {
    nombre: 'Aspirante',
    apellido: 'Dos',
    email: 'aspirante@dos.com',
    contrasenia: encryptPassword,
    dni: '41128795',
    verificado: true,
    datos: {
      nombre: { value: 'Aspirante' },
      apellido: { value: 'Dos' },
      mailParticular: { value: 'aspirante@dos.com' },
      dni: { value: '41128795' }
    }
  },
  aspiranteTres: {
    nombre: 'Aspirante',
    apellido: 'Tres',
    email: 'aspirante@tres.com',
    contrasenia: encryptPassword,
    dni: '40128695',
    verificado: true,
    datos: {
      nombre: { value: 'Aspirante' },
      apellido: { value: 'Tres' },
      mailParticular: { value: 'aspirante@tres.com' },
      dni: { value: '40128695' }
    }
  },
  aspiranteCuatro: {
    nombre: 'Aspirante',
    apellido: 'Cuatro',
    email: 'aspirante@cuatro.com',
    contrasenia: encryptPassword,
    dni: '40128595',
    verificado: true,
    datos: {
      nombre: { value: 'Aspirante' },
      apellido: { value: 'Cuatro' },
      mailParticular: { value: 'aspirante@cuatro.com' },
      dni: { value: '40128595' }
    }
  },
  aspiranteCinco: {
    nombre: 'Aspirante',
    apellido: 'Cinco',
    email: 'aspirante@cinco.com',
    contrasenia: encryptPassword,
    dni: '40128495',
    verificado: true,
    datos: {
      nombre: { value: 'Aspirante' },
      apellido: { value: 'Cinco' },
      mailParticular: { value: 'aspirante@cinco.com' },
      dni: { value: '40128495' }
    }
  },
  aspiranteSeis: {
    nombre: 'Aspirante',
    apellido: 'Seis',
    email: 'aspirante@seis.com',
    contrasenia: encryptPassword,
    dni: '40128395',
    verificado: true,
    datos: {
      nombre: { value: 'Aspirante' },
      apellido: { value: 'Seis' },
      mailParticular: { value: 'aspirante@seis.com' },
      dni: { value: '40128395' }
    }
  },
  aspiranteSiete: {
    nombre: 'Aspirante',
    apellido: 'Siete',
    email: 'aspirante@siete.com',
    contrasenia: encryptPassword,
    dni: '40128295',
    verificado: true,
    datos: {
      nombre: { value: 'Aspirante' },
      apellido: { value: 'Siete' },
      mailParticular: { value: 'aspirante@siete.com' },
      dni: { value: '40128295' }
    }
  },
  aspiranteOcho: {
    nombre: 'Aspirante',
    apellido: 'Ocho',
    email: 'aspirante@ocho.com',
    contrasenia: encryptPassword,
    dni: '40128195',
    verificado: true,
    datos: {
      nombre: { value: 'Aspirante' },
      apellido: { value: 'Ocho' },
      mailParticular: { value: 'aspirante@ocho.com' },
      dni: { value: '40128195' }
    }
  },
  aspiranteNueve: {
    nombre: 'Aspirante',
    apellido: 'Nueve',
    email: 'aspirante@nueve.com',
    contrasenia: encryptPassword,
    dni: '40128095',
    verificado: true,
    datos: {
      nombre: { value: 'Aspirante' },
      apellido: { value: 'Nueve' },
      mailParticular: { value: 'aspirante@nueve.com' },
      dni: { value: '40128095' }
    }
  },
  aspiranteDiez: {
    nombre: 'Aspirante',
    apellido: 'Diez',
    email: 'aspirante@diez.com',
    contrasenia: encryptPassword,
    dni: '40128096',
    verificado: true,
    datos: {
      nombre: { value: 'Aspirante' },
      apellido: { value: 'Diez' },
      mailParticular: { value: 'aspirante@diez.com' },
      dni: { value: '40128096' }
    }
  },
  jefeMatriculacion: {
    nombre: 'Jefe',
    apellido: 'Matriculación',
    email: 'jefe@matriculacion.com',
    contrasenia: encryptPassword,
    dni: '12345678',
    verificado: true
  },
  empleadoMatriculacion: {
    nombre: 'Empleado',
    apellido: 'Matriculación',
    email: 'empleado@matriculacion.com',
    contrasenia: encryptPassword,
    dni: '39548456',
    verificado: true
  },
  jefeFinanzas: {
    nombre: 'Jefe',
    apellido: 'Finanzas',
    email: 'jefe@finanzas.com',
    contrasenia: encryptPassword,
    dni: '54848548',
    verificado: true
  },
  empleadoFinanzas: {
    nombre: 'Empleado',
    apellido: 'Finanzas',
    email: 'empleado@finanzas.com',
    contrasenia: encryptPassword,
    dni: '40128015',
    verificado: true
  },
  jefeComisionMatriculacion: {
    nombre: 'Jefe',
    apellido: 'Comisión',
    email: 'jefe@comisionmatriculacion.com',
    contrasenia: encryptPassword,
    dni: '42128097',
    verificado: true
  },
  jefeFiscalizacion: {
    nombre: 'Jefe',
    apellido: 'Fiscalización',
    email: 'jefe@fiscalizacion.com',
    contrasenia: encryptPassword,
    dni: '43128097',
    verificado: true
  },
  jefeHcd: {
    nombre: 'Honorable Consejo',
    apellido: 'Directivo',
    email: 'jefe@hcd.com',
    contrasenia: encryptPassword,
    dni: '44128097',
    verificado: true
  },
  jefeTesorero: {
    nombre: 'Jefe',
    apellido: 'Tesorero',
    email: 'jefe@tesorero.com',
    contrasenia: encryptPassword,
    dni: '45128097',
    verificado: true
  },
  jefeSecretario: {
    nombre: 'Jefe',
    apellido: 'Secretario',
    email: 'jefe@secretario.com',
    contrasenia: encryptPassword,
    dni: '46128097',
    verificado: true
  },
  jefePresidente: {
    nombre: 'Jefe',
    apellido: 'Presidente',
    email: 'jefe@presidente.com',
    contrasenia: encryptPassword,
    dni: '47128097',
    verificado: true
  },
  jefeLegales: {
    nombre: 'Jefe',
    apellido: 'Legales',
    email: 'jefe@legales.com',
    contrasenia: encryptPassword,
    dni: '48128097',
    verificado: true
  },
  jefeInspeccion: {
    nombre: 'Jefe',
    apellido: 'Inspección',
    email: 'jefe@inspeccion.com',
    contrasenia: encryptPassword,
    dni: '49128097',
    verificado: true
  },
  jefeComisionFiscalizacion: {
    nombre: 'Jefe',
    apellido: 'Comisión de Fiscalización',
    email: 'jefe@comisionfiscalizacion.com',
    contrasenia: encryptPassword,
    dni: '50128097',
    verificado: true
  },
  empleadoInspeccion: {
    nombre: 'Empleado',
    apellido: 'Inspeccion',
    email: 'empleado@inspeccion.com',
    contrasenia: encryptPassword,
    dni: '51128097',
    verificado: true
  },
  supervisor: {
    nombre: 'Supervisor',
    apellido: 'Areas',
    email: 'supervisor@areas.com',
    contrasenia: encryptPassword,
    dni: '59128090',
    verificado: true
  },
  superAdmin: {
    nombre: 'Super',
    apellido: 'Admin',
    email: 'administrador@sitio.com',
    contrasenia: encryptPasswordAdmin,
    dni: '52222090',
    verificado: true
  },
  jefeMesaEntrada: {
    nombre: 'Jefe',
    apellido: 'Mesa Entrada',
    email: 'jefe@mesaentrada.com',
    contrasenia: encryptPassword,
    dni: '52220987',
    verificado: true
  },
  empleadoMesaEntrada: {
    nombre: 'Empleado',
    apellido: 'Mesa Entrada',
    email: 'empleado@mesaentrada.com',
    contrasenia: encryptPassword,
    dni: '52223091',
    verificado: true
  },
  federicoConte: {
    nombre: 'Federico',
    apellido: 'Conte',
    email: 'fconte@colegioinmobiliario.org.ar',
    contrasenia: encryptPassword,
    dni: '25248666',
    verificado: true
  },
  deboraEsquiroz: {
    nombre: 'Debora Agata',
    apellido: 'Esquiroz',
    email: 'desquiroz@colegioinmobiliario.org.ar',
    contrasenia: encryptPassword,
    dni: '25029765',
    verificado: true
  },
  yaninaRudelli: {
    nombre: 'Yanina',
    apellido: 'Rudelli',
    email: 'yrudelli@colegioinmobiliario.org.ar',
    contrasenia: encryptPassword,
    dni: '28076669',
    verificado: true
  },
  jorgelinaGonzalez: {
    nombre: 'Jorgelina',
    apellido: 'González',
    email: 'jgonzalez@colegioinmobiliario.org.ar',
    contrasenia: encryptPassword,
    dni: '28460039',
    verificado: true
  },
  jessicaMassa: {
    nombre: 'Jessica',
    apellido: 'Massa',
    email: 'jmassa@colegioinmobiliario.org.ar',
    contrasenia: encryptPassword,
    dni: '22493925',
    verificado: true
  },
  jefeTribunalEtica: {
    nombre: 'Jefe',
    apellido: 'Tribunal de Ética',
    email: 'jefe@tribunaletica.com',
    contrasenia: encryptPassword,
    dni: '22490300',
    verificado: true
  }
};

interface EmpleadoSeed {
  usuarioEmail: string;
  areaId: number;
  roles: number[];
}

export const empleados: EmpleadoSeed[] = [
  {
    usuarioEmail: usuarios.jefeMatriculacion.email,
    areaId: area.matriculacion,
    roles: [rol.jefe_Area]
  },
  {
    usuarioEmail: usuarios.empleadoMatriculacion.email,
    areaId: area.matriculacion,
    roles: [rol.empleado]
  },
  {
    usuarioEmail: usuarios.jefeFinanzas.email,
    areaId: area.finanzas,
    roles: [rol.jefe_Area]
  },
  {
    usuarioEmail: usuarios.empleadoFinanzas.email,
    areaId: area.finanzas,
    roles: [rol.empleado]
  },
  {
    usuarioEmail: usuarios.jefeComisionMatriculacion.email,
    areaId: area.comisionMatriculacion,
    roles: [rol.jefe_Area]
  },
  {
    usuarioEmail: usuarios.jefeFiscalizacion.email,
    areaId: area.fiscalizacion,
    roles: [rol.jefe_Area]
  },
  {
    usuarioEmail: usuarios.jefeHcd.email,
    areaId: area.consejoDirectivo,
    roles: [rol.jefe_Area]
  },
  {
    usuarioEmail: usuarios.jefeTesorero.email,
    areaId: area.tesorero,
    roles: [rol.jefe_Area]
  },
  {
    usuarioEmail: usuarios.jefeSecretario.email,
    areaId: area.secretario,
    roles: [rol.jefe_Area]
  },
  {
    usuarioEmail: usuarios.jefePresidente.email,
    areaId: area.presidente,
    roles: [rol.jefe_Area]
  },
  {
    usuarioEmail: usuarios.jefeLegales.email,
    areaId: area.legales,
    roles: [rol.jefe_Area]
  },
  {
    usuarioEmail: usuarios.jefeInspeccion.email,
    areaId: area.inspeccion,
    roles: [rol.jefe_Area]
  },
  {
    usuarioEmail: usuarios.jefeComisionFiscalizacion.email,
    areaId: area.comisionFiscalizacion,
    roles: [rol.jefe_Area]
  },
  {
    usuarioEmail: usuarios.empleadoInspeccion.email,
    areaId: area.inspeccion,
    roles: [rol.empleado]
  },
  {
    usuarioEmail: usuarios.supervisor.email,
    areaId: area.administracion,
    roles: [rol.supervisor]
  },
  {
    usuarioEmail: usuarios.superAdmin.email,
    areaId: area.administracion,
    roles: [rol.administrador]
  },
  {
    usuarioEmail: usuarios.jefeMesaEntrada.email,
    areaId: area.mesaEntrada,
    roles: [rol.jefe_Area]
  },
  {
    usuarioEmail: usuarios.empleadoMesaEntrada.email,
    areaId: area.mesaEntrada,
    roles: [rol.empleado]
  },
  {
    usuarioEmail: usuarios.federicoConte.email,
    areaId: area.matriculacion,
    roles: [rol.jefe_Area]
  },
  {
    usuarioEmail: usuarios.deboraEsquiroz.email,
    areaId: area.matriculacion,
    roles: [rol.empleado]
  },
  {
    usuarioEmail: usuarios.yaninaRudelli.email,
    areaId: area.matriculacion,
    roles: [rol.empleado]
  },
  {
    usuarioEmail: usuarios.jorgelinaGonzalez.email,
    areaId: area.matriculacion,
    roles: [rol.empleado]
  },
  {
    usuarioEmail: usuarios.jefeTribunalEtica.email,
    areaId: area.tribunalEtica,
    roles: [rol.jefe_Area]
  }
];

interface Disponibilidad {
  nombre: string;
  areaId: number;
  lun: any;
  mar: any;
  mie: any;
  jue: any;
  vie: any;
  sab: any;
  dom: any;
  inicio: Date;
  fin: Date;
}

export const disponibilidades: Disponibilidad[] = [
  {
    nombre: 'Disponibilidad 0',
    areaId: 1,
    lun: {
      abierto: true,
      intervalos: [
        {
          inicio: '8:00',
          fin: '15:00'
        },
        {
          inicio: '16:00',
          fin: '18:00'
        }
      ]
    },
    mar: {
      abierto: true,
      intervalos: [
        {
          inicio: '8:00',
          fin: '15:00'
        },
        {
          inicio: '16:00',
          fin: '18:00'
        }
      ]
    },
    mie: {
      abierto: true,
      intervalos: [
        {
          inicio: '8:00',
          fin: '15:00'
        },
        {
          inicio: '16:00',
          fin: '18:00'
        }
      ]
    },
    jue: {
      abierto: true,
      intervalos: [
        {
          inicio: '8:00',
          fin: '15:00'
        },
        {
          inicio: '16:00',
          fin: '18:00'
        }
      ]
    },
    vie: {
      abierto: true,
      intervalos: [
        {
          inicio: '8:00',
          fin: '15:00'
        },
        {
          inicio: '16:00',
          fin: '18:00'
        }
      ]
    },
    sab: {
      abierto: false,
      intervalos: []
    },
    dom: {
      abierto: false,
      intervalos: []
    },
    inicio: dayjs('2022-10-13').toDate(),
    fin: dayjs('2022-10-27').toDate()
  },
  {
    nombre: 'Disponibilidad 1',
    areaId: 1,
    lun: {
      abierto: true,
      intervalos: [
        {
          inicio: '8:00',
          fin: '15:00'
        },
        {
          inicio: '16:00',
          fin: '18:00'
        }
      ]
    },
    mar: {
      abierto: true,
      intervalos: [
        {
          inicio: '8:00',
          fin: '15:00'
        },
        {
          inicio: '16:00',
          fin: '18:00'
        }
      ]
    },
    mie: {
      abierto: true,
      intervalos: [
        {
          inicio: '8:00',
          fin: '15:00'
        },
        {
          inicio: '16:00',
          fin: '18:00'
        }
      ]
    },
    jue: {
      abierto: true,
      intervalos: [
        {
          inicio: '8:00',
          fin: '15:00'
        },
        {
          inicio: '16:00',
          fin: '18:00'
        }
      ]
    },
    vie: {
      abierto: true,
      intervalos: [
        {
          inicio: '8:00',
          fin: '15:00'
        },
        {
          inicio: '16:00',
          fin: '18:00'
        }
      ]
    },
    sab: {
      abierto: false,
      intervalos: []
    },
    dom: {
      abierto: false,
      intervalos: []
    },
    inicio: dayjs('2022-10-28').toDate(),
    fin: dayjs('2022-11-13').toDate()
  },
  {
    nombre: 'Disponibilidad 2',
    areaId: 1,
    lun: {
      abierto: true,
      intervalos: [
        {
          inicio: '8:00',
          fin: '15:00'
        },
        {
          inicio: '16:00',
          fin: '18:00'
        }
      ]
    },
    mar: {
      abierto: true,
      intervalos: [
        {
          inicio: '8:00',
          fin: '15:00'
        },
        {
          inicio: '16:00',
          fin: '18:00'
        }
      ]
    },
    mie: {
      abierto: true,
      intervalos: [
        {
          inicio: '8:00',
          fin: '15:00'
        },
        {
          inicio: '16:00',
          fin: '18:00'
        }
      ]
    },
    jue: {
      abierto: true,
      intervalos: [
        {
          inicio: '8:00',
          fin: '15:00'
        },
        {
          inicio: '16:00',
          fin: '18:00'
        }
      ]
    },
    vie: {
      abierto: true,
      intervalos: [
        {
          inicio: '8:00',
          fin: '15:00'
        },
        {
          inicio: '16:00',
          fin: '18:00'
        }
      ]
    },
    sab: {
      abierto: false,
      intervalos: []
    },
    dom: {
      abierto: false,
      intervalos: []
    },
    inicio: dayjs('2022-11-14').toDate(),
    fin: dayjs('2022-11-20').toDate()
  },
  {
    nombre: 'Disponibilidad 3',
    areaId: 1,
    lun: {
      abierto: true,
      intervalos: [
        {
          inicio: '8:00',
          fin: '15:00'
        },
        {
          inicio: '16:00',
          fin: '18:00'
        }
      ]
    },
    mar: {
      abierto: true,
      intervalos: [
        {
          inicio: '8:00',
          fin: '15:00'
        },
        {
          inicio: '16:00',
          fin: '18:00'
        }
      ]
    },
    mie: {
      abierto: true,
      intervalos: [
        {
          inicio: '8:00',
          fin: '15:00'
        },
        {
          inicio: '16:00',
          fin: '18:00'
        }
      ]
    },
    jue: {
      abierto: true,
      intervalos: [
        {
          inicio: '8:00',
          fin: '15:00'
        },
        {
          inicio: '16:00',
          fin: '18:00'
        }
      ]
    },
    vie: {
      abierto: true,
      intervalos: [
        {
          inicio: '8:00',
          fin: '15:00'
        },
        {
          inicio: '16:00',
          fin: '18:00'
        }
      ]
    },
    sab: {
      abierto: false,
      intervalos: []
    },
    dom: {
      abierto: false,
      intervalos: []
    },
    inicio: dayjs('2022-11-21').toDate(),
    fin: dayjs('2022-12-10').toDate()
  },
  {
    nombre: 'Disponibilidad 4',
    areaId: 1,
    lun: {
      abierto: true,
      intervalos: [
        {
          inicio: '8:00',
          fin: '21:00'
        }
      ]
    },
    mar: {
      abierto: true,
      intervalos: [
        {
          inicio: '8:00',
          fin: '21:00'
        }
      ]
    },
    mie: {
      abierto: true,
      intervalos: [
        {
          inicio: '8:00',
          fin: '21:00'
        }
      ]
    },
    jue: {
      abierto: true,
      intervalos: [
        {
          inicio: '8:00',
          fin: '21:00'
        }
      ]
    },
    vie: {
      abierto: true,
      intervalos: [
        {
          inicio: '8:00',
          fin: '21:00'
        }
      ]
    },
    sab: {
      abierto: false,
      intervalos: []
    },
    dom: {
      abierto: false,
      intervalos: []
    },
    inicio: dayjs('2022-12-11').toDate(),
    fin: dayjs('2023-12-27').toDate()
  }
];

interface TipoEvento {
  id: number;
  nombre: string;
  descripcion: string;
  tipoTramiteId?: number;
}

export const tipoEventos: TipoEvento[] = [
  {
    id: 1,
    nombre: 'Jura',
    descripcion: 'Evento donde los aspirantes realizan una jura',
    tipoTramiteId: 1
  }
];

interface Imputacion {
  titulo: string;
}

export interface PadreImputacion {
  titulo: string;
  imputaciones: Imputacion[];
}

export const imputaciones: PadreImputacion[] = [
  {
    titulo: 'RETENCIÓN SUMAS DE DINERO - Ley 2340',
    imputaciones: [
      {
        titulo: 'Art. 10 inc. 7'
      },
      {
        titulo: 'Art. 13 inc. 4'
      }
    ]
  },
  {
    titulo: 'RETENCIÓN SUMAS DE DINERO - Código de ética ',
    imputaciones: [
      {
        titulo: 'Apartado 1 Cap. II'
      },
      {
        titulo: 'Apartado 2 Cap. II'
      },
      {
        titulo: 'Apartado 6 Cap. II'
      },
      {
        titulo: 'Apartado 9 Cap. II'
      },
      {
        titulo: 'Apartado 11 Cap. II'
      },
      {
        titulo: 'Apartado 12 Cap. II'
      },
      {
        titulo: 'Apartado 14 Cap. II'
      },
      {
        titulo: 'Apartado 15 Cap. II'
      },
      {
        titulo: 'Apartado 26 Cap. II'
      },
      {
        titulo: 'Apartado 27 Cap. II'
      }
    ]
  },
  {
    titulo: 'NO CORROBORAR CONDICIONES DE DOMINIO NI PEDIR INFORMES - Ley 2340',
    imputaciones: [
      {
        titulo: 'Art. 10 inc. 1'
      },
      {
        titulo: 'Art. 10 inc. 2'
      },
      {
        titulo: 'Art. 10 inc. 5'
      },
      {
        titulo: 'Art. 11 inc. 3'
      }
    ]
  },
  {
    titulo:
      'NO CORROBORAR CONDICIONES DE DOMINIO NI PEDIR INFORMES - Código de ética',
    imputaciones: [
      {
        titulo: 'Apartado 4 Cap. II'
      },
      {
        titulo: 'Apartado 6 Cap. II'
      },
      {
        titulo: 'Apartado 8 Cap. II'
      }
    ]
  },
  {
    titulo: 'COBRO EXCESIVO DE HONORARIOS - Ley 2340',
    imputaciones: [
      {
        titulo: 'Art. 11 inc. 2'
      },
      {
        titulo: 'Art. 13 inc. 7'
      }
    ]
  },
  {
    titulo: 'COBRO EXCESIVO DE HONORARIOS - Código de ética',
    imputaciones: [
      {
        titulo: 'Apartado 9 Cap. II'
      },
      {
        titulo: 'Apartado 12 Cap. II'
      },
      {
        titulo: 'Apartado 15 Cap. II'
      },
      {
        titulo: 'Apartado 22 Cap. II'
      },
      {
        titulo: 'Apartado 25 Cap. II'
      }
    ]
  },
  {
    titulo: 'PUBLICIDAD ENGAÑOSA - Ley 2340',
    imputaciones: [
      {
        titulo: 'Art. 12'
      },
      {
        titulo: 'Art. 13 inc. 6'
      }
    ]
  },
  {
    titulo: 'PUBLICIDAD ENGAÑOSA - Código de ética',
    imputaciones: [
      {
        titulo: 'Apartado 6 Cap. II'
      },
      {
        titulo: 'Apartado 8 Cap. II'
      },
      {
        titulo: 'Apartado 20 Cap. II'
      }
    ]
  },
  {
    titulo: 'PRÉSTAMO DE MATRÍCULA - Ley 2340',
    imputaciones: [
      {
        titulo: 'Art. 10 inc. 4'
      },
      {
        titulo: 'Art. 12'
      },
      {
        titulo: 'Art. 13 inc. 1'
      },
      {
        titulo: 'Art. 13 inc. 6'
      },
      {
        titulo: 'Art. 15'
      },
      {
        titulo: 'Art. 18'
      }
    ]
  },
  {
    titulo: 'PRÉSTAMO DE MATRÍCULA - Código de ética',
    imputaciones: [
      {
        titulo: 'Apartado 3 Cap. II'
      },
      {
        titulo: 'Apartado 10 Cap. II'
      },
      {
        titulo: 'Apartado 18 Cap. II'
      }
    ]
  },
  {
    titulo: 'GESTIÓN SIN AUTORIZACIÓN - Ley 2340',
    imputaciones: [
      {
        titulo: 'Art. 13 inc. 3'
      }
    ]
  },
  {
    titulo: 'GESTIÓN SIN AUTORIZACIÓN - Código de ética',
    imputaciones: [
      {
        titulo: 'Apartado 1 Cap. II'
      },
      {
        titulo: 'Apartado 2 Cap. II'
      },
      {
        titulo: 'Apartado 6 Cap. II'
      },
      {
        titulo: 'Apartado 11 Cap. II'
      }
    ]
  },
  {
    titulo: 'CAPTACIÓN ANTIÉTICA DE CLIENTES - Ley 2340',
    imputaciones: [
      {
        titulo: 'Art. 13 inc.'
      }
    ]
  },
  {
    titulo: 'CAPTACIÓN ANTIÉTICA DE CLIENTES - Código de ética',
    imputaciones: [
      {
        titulo: 'Apartado 20 Cap. II'
      },
      {
        titulo: 'Apartado 21 Cap. II'
      },
      {
        titulo: 'Apartado 23 Cap. II'
      },
      {
        titulo: 'Apartado 24 Cap. II'
      }
    ]
  },
  {
    titulo: 'EJERCICIO DE LA PROFESIÓN CON MAT. INHABILITADA - Ley 2340',
    imputaciones: [
      {
        titulo: 'Art. 16'
      },
      {
        titulo: 'Art. 18'
      }
    ]
  },
  {
    titulo: 'EJERCICIO DE LA PROFESIÓN CON MAT. INHABILITADA - Código de ética',
    imputaciones: [
      {
        titulo: 'Apartado 1 Cap. II'
      },
      {
        titulo: 'Apartado 2 Cap. II'
      },
      {
        titulo: 'Apartado 9 Cap. II'
      },
      {
        titulo: 'Apartado 15 Cap. II'
      },
      {
        titulo: 'Apartado 17 Cap. II'
      }
    ]
  },
  {
    titulo:
      'EJERCICIO DE LA PROFESIÓN CON NOMBRE DE FANTASÍA NO DECLARADO - Ley 2340',
    imputaciones: [
      {
        titulo: 'Art. 12'
      },
      {
        titulo: 'Art. 13 inc. 6'
      },
      {
        titulo: 'Art. 18'
      }
    ]
  },
  {
    titulo:
      'EJERCICIO DE LA PROFESIÓN CON NOMBRE DE FANTASÍA NO DECLARADO - Código de ética',
    imputaciones: [
      {
        titulo: 'Apartado 1 Cap. II'
      },
      {
        titulo: 'Apartado 3 Cap. II'
      },
      {
        titulo: 'Apartado 27 Cap. II'
      }
    ]
  },
  {
    titulo: 'OBRAR EN DOMICILIO QUE DIFIERE DEL DECLARADO - Ley 2340',
    imputaciones: [
      {
        titulo: 'Art. 10 inc. 4'
      },
      {
        titulo: 'Art. 12'
      },
      {
        titulo: 'Art. 13 inc. 6'
      },
      {
        titulo: 'Art. 18'
      }
    ]
  },
  {
    titulo: 'OBRAR EN DOMICILIO QUE DIFIERE DEL DECLARADO - Código de ética',
    imputaciones: [
      {
        titulo: 'Apartado 1 Cap. II'
      },
      {
        titulo: 'Apartado 3 Cap. II'
      },
      {
        titulo: 'Apartado 27 Cap. II'
      }
    ]
  },
  {
    titulo: 'FALTA DE ÉTICA EN EL OBRAR - Ley 2340',
    imputaciones: [
      {
        titulo: 'Art. 5'
      },
      {
        titulo: 'Art. 7'
      },
      {
        titulo: 'Art. 13 inc. 5'
      },
      {
        titulo: 'Art. 13 inc. 6'
      }
    ]
  },
  {
    titulo: 'FALTA DE ÉTICA EN EL OBRAR - Código de ética',
    imputaciones: [
      {
        titulo: 'Apartado 1 Cap. II'
      },
      {
        titulo: 'Apartado 2 Cap. II'
      },
      {
        titulo: 'Apartado 5 Cap. II'
      },
      {
        titulo: 'Apartado 6 Cap. II'
      },
      {
        titulo: 'Apartado 8 Cap. II'
      },
      {
        titulo: 'Apartado 11 Cap. II'
      },
      {
        titulo: 'Apartado 17 Cap. II'
      },
      {
        titulo: 'Apartado 21 Cap. II'
      },
      {
        titulo: 'Apartado 23 Cap. II'
      }
    ]
  },
  {
    titulo: 'TASACIONES SIN CARGO - Ley 2340',
    imputaciones: [
      {
        titulo: 'Art. 12'
      },
      {
        titulo: 'Art. 13 inc. 6'
      }
    ]
  },
  {
    titulo: 'TASACIONES SIN CARGO - Código ética',
    imputaciones: [
      {
        titulo: 'Apartado 8 Cap. II'
      },
      {
        titulo: 'Apartado 9 Cap. II'
      },
      {
        titulo: 'Apartado 11 Cap. II'
      },
      {
        titulo: 'Apartado 15 Cap. II'
      },
      {
        titulo: 'Apartado 20 Cap. II'
      },
      {
        titulo: 'Apartado 23 Cap. II'
      },
      {
        titulo: 'Apartado 24 Cap. II'
      }
    ]
  }
];

export interface TextoPdf {
  id: number;
  titulo: string;
  texto: string;
}

export const textoPdf: TextoPdf[] = [
  {
    id: 1,
    titulo: 'Declaración Jurada de Actividad Comercial',
    texto: actividadComercial
  },
  {
    id: 2,
    titulo: 'Alta de Matricula por Cesantía',
    texto: altaMatriculacionCesantiaText
  },
  {
    id: 3,
    titulo: 'Declaración Jurada de Baja de Matrícula Profesional',
    texto: bajaMatriculaProfesional
  },
  {
    id: 4,
    titulo: 'Declaración Jurada de No Actividad Comercial',
    texto: noActividadComercial
  },
  {
    id: 5,
    titulo: 'Solicitud de Licencia Por Pasividad',
    texto: solicitudLicenciaPasividad
  },
  {
    id: 6,
    titulo: 'Citación a Ratificación',
    texto: citacionRatificacion
  },
  {
    id: 7,
    titulo: 'Descargo de Particular',
    texto: descargoParticular
  },
  {
    id: 8,
    titulo: 'Descargo de Oficio',
    texto: descargoOficio
  },
  {
    id: 9,
    titulo: 'Imputación',
    texto: imputacion
  },
  {
    id: 10,
    titulo: 'Cédula',
    texto: cedula
  }
];
