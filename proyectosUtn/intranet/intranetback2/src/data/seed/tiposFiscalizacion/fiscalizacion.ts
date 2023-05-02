import { getSE } from '../variables';
import TipoFiscalizacion from './interfaceTipoFiscalizacion';

const formularioFiscalizacion: TipoFiscalizacion = {
  id: 1,
  secciones: [
    {
      id: getSE(),
      titulo: 'Formulario',
      inputs: [
        {
          nombre: 'tipoExpedienteFiscalizacion',
          requerido: [true]
        },
        {
          nombre: 'condicion',
          requerido: [false]
        },
        {
          nombre: 'selectTipoActa',
          requerido: [true]
        },
        {
          nombre: 'numeroActa',
          requerido: [true],
          prefijo: '00 - ',
          padre: 'selectTipoActa'
        },

        {
          nombre: 'fechaActa',
          requerido: [true]
        },
        {
          nombre: 'denominacion',
          requerido: [true]
        },
        {
          nombre: 'ubicado',
          requerido: [false]
        },
        {
          nombre: 'ubicadoNumero',
          requerido: [false],
          padre: 'ubicado'
        },
        {
          nombre: 'ubicadoSelect',
          requerido: [false],
          padre: 'ubicado'
        },
        {
          nombre: 'piso',
          requerido: [false],
          padre: 'ubicado'
        },
        {
          nombre: 'oficinaDpto',
          requerido: [false],
          padre: 'ubicado'
        },
        {
          nombre: 'barrio',
          requerido: [false]
        },
        {
          nombre: 'barrioCodigoPostal',
          requerido: [false],
          padre: 'barrio'
        },
        {
          nombre: 'atendido',
          requerido: [false]
        },
        {
          nombre: 'seleccionarDNIAtendido',
          requerido: [false],
          padre: 'atendido'
        },
        {
          nombre: 'numeroDNIAtendido',
          requerido: [false],
          padre: 'seleccionarDNIAtendido'
        },
        {
          nombre: 'caracterDe',
          requerido: [false]
        },
        {
          nombre: 'responsables',
          requerido: [false]
        },
        {
          nombre: 'seleccionarDNIResponsable',
          requerido: [false],
          padre: 'responsables'
        },
        {
          nombre: 'numeroDNIResponsable',
          requerido: [false],
          padre: 'responsables'
        },
        /* {
          nombre: 'esMatriculado',
          requerido: [false]
        },
        {
          nombre: 'fechaInicioTramite',
          requerido: [false],
          padre: 'esMatriculado'
        }, */
        {
          nombre: 'matriculado',
          requerido: [false]
        },
        {
          nombre: 'cuitCuil',
          requerido: [false]
        },
        {
          nombre: 'domicilioElectronico',
          requerido: [false]
        },
        {
          nombre: 'domicilioProfesional',
          requerido: [false]
        },
        {
          nombre: 'mailParticular',
          requerido: [false]
        },
        {
          nombre: 'paginaWeb',
          requerido: [false]
        },
        {
          nombre: 'habilitacionMunicipalTitular',
          requerido: [false]
        },
        {
          nombre: 'caracterHabilitacion',
          requerido: [false]
        },
        {
          nombre: 'colegiados',
          requerido: [false]
        },
        {
          nombre: 'domicilioCasaCentral',
          requerido: [false]
        },
        {
          nombre: 'telefonoCasaCentral',
          requerido: [false]
        },
        {
          nombre: 'sucursal1',
          requerido: [false]
        },
        {
          nombre: 'domicilioSucursal1',
          requerido: [false],
          padre: 'sucursal1'
        },
        {
          nombre: 'telefonoSucursal1',
          requerido: [false],
          padre: 'sucursal1'
        },
        {
          nombre: 'sucursal2',
          requerido: [false],
          padre: 'sucursal1'
        },
        {
          nombre: 'domicilioSucursal2',
          requerido: [false],
          padre: 'sucursal2'
        },
        {
          nombre: 'telefonoSucursal2',
          requerido: [false],
          padre: 'sucursal2'
        },
        {
          nombre: 'librosRubricados',
          requerido: [false]
        },
        {
          nombre: 'fechaRubricacion',
          requerido: [false],
          padre: 'librosRubricados'
        },
        {
          nombre: 'fianza',
          requerido: [false]
        },
        {
          nombre: 'cuotaAnual',
          requerido: [false]
        },
        {
          nombre: 'observaciones',
          requerido: [false]
        },
        {
          nombre: 'fechaConcurrir',
          requerido: [false]
        },
        {
          nombre: 'estadoFiscalizacion',
          requerido: [true]
        }
      ]
    }
  ]
};

export default formularioFiscalizacion;
