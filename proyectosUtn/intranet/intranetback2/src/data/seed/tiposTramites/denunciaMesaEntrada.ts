import { EstadoTramite } from '@prisma/client';
import areas from '../../areas';
import tramites from '../../tramites';
import { actions } from '../actions/actions';
import { getS } from '../variables';
import TipoTramite from './interfaceTipoTramite';
import { nextConditions } from '../actions/nextConditions';
import { onReject } from '../actions/onReject';

const denunciaMesaEntrada: TipoTramite = {
  id: tramites.denunciaMesaEntrada,
  titulo: 'Denuncia por Mesa de Entrada',
  areaId: areas.mesaEntrada,
  plazo: 180,
  tipo: 'denuncia',
  puedeIniciar: 'empleado',
  requiere: 'oculto',
  pasos: [
    {
      id: 0,
      variant: 'success',
      title: 'Sistema de Denuncias',
      description: ``,
      intraTitle: 'Inicio del Trámite Área Mesa de Entrada',
      actions: [
        actions.canCancel(),
        actions.sendTo(areas.mesaEntrada),
        actions.cantAddDataUser(),
        actions.canAddDataEmployee(areas.mesaEntrada),
        actions.canAddArchivos(areas.mesaEntrada),
        actions.canAddInformes(areas.mesaEntrada),
        actions.canGoNextStep(areas.mesaEntrada, ['allRequiredFilled']),
        actions.startPlazo(5, areas.mesaEntrada)
      ],
      intraDescription:
        'Debes completar los Formularios con los datos requeridos, puedes incorporar de ser necesario, archivos e informes.'
    },
    {
      id: 1,
      variant: 'info',
      title: 'Personal de CUCICBA se encuentra verificando lo denunciado',
      description: ``,
      actions: [
        actions.sendTo(areas.mesaEntrada),
        actions.approveOrReject('Dar curso', 'Desestimar'),
        actions.approveAllInputs()
      ],
      nextConditions: [nextConditions.allAreasApproved()],
      onRejectActions: [onReject.changeStatus(EstadoTramite.rechazado)],
      intraTitle: 'Debes dar curso a desestimar',
      intraDescription: `Debes dar curso a la denuncia o desestimarla.`
    },
    {
      id: 2,
      variant: 'warning',
      title: 'Sistema de Denuncias',
      description: `El Sistema se encuentra en revisión si estas adeherido/a a la Cédula Electrónica.`,
      actions: [actions.canGoNextStep(areas.mesaEntrada)],
      intraTitle: 'Verificación de Cédula Electrónica',
      intraDescription:
        'Para continuan con este Trámite el Usuario debe estar adherido a la Cédula Electrónica.'
    },
    {
      id: 3,
      variant: 'success',
      title: 'Sistema de Denuncias',
      description: ``,
      intraTitle: 'Trámite Finalizado',
      intraDescription: `El Trámite ha finalizado.`,
      actions: [
        actions.startExpediente(),
        actions.changeStatus(EstadoTramite.aprobado),
        actions.notifyMail('approveTramite')
      ]
    }
  ],
  secciones: [
    {
      id: getS(),
      titulo: 'Datos del denunciado',
      inputs: [
        {
          nombre: 'matriculadoDenunciado',
          requerido: [false]
        },
        {
          nombre: 'checkNoMatriculado',
          requerido: [false]
        },
        {
          nombre: 'nombreDenunciado',
          requerido: [false, 'checkNoMatriculado'],
          padre: 'checkNoMatriculado'
        },
        {
          nombre: 'apellidoDenunciado',
          requerido: [false, 'checkNoMatriculado'],
          padre: 'checkNoMatriculado'
        },
        {
          nombre: 'firmaInmobiliaria',
          requerido: [false],
          padre: 'checkNoMatriculado'
        },
        {
          nombre: 'dniDenunciado',
          requerido: [false],
          padre: 'checkNoMatriculado'
        },
        {
          nombre: 'telefonoDenunciado',
          requerido: [false],
          padre: 'checkNoMatriculado'
        },
        {
          nombre: 'domicilioDenunciado',
          requerido: [false],
          padre: 'checkNoMatriculado'
        },
        {
          nombre: 'numeroMatriculaDenunciado',
          requerido: [false],
          padre: 'checkNoMatriculado'
        }
      ]
    },
    {
      id: getS(),
      titulo: 'Matrícula del denunciado',
      tipo: 'esMatriculado',
      inputs: [
        {
          nombre: 'numeroMatricula',
          requerido: [false],
          isDisabled: true
        },
        {
          nombre: 'libroMatricula',
          requerido: [false, 'numeroMatricula'],
          padre: 'numeroMatricula',
          isDisabled: true
        },
        {
          nombre: 'tomoMatricula',
          requerido: [false, 'numeroMatricula'],
          padre: 'numeroMatricula',
          isDisabled: true
        },
        {
          nombre: 'folioMatricula',
          requerido: [false, 'numeroMatricula'],
          padre: 'numeroMatricula',
          isDisabled: true
        }
      ]
    },
    {
      id: getS(),
      titulo: 'Datos del denunciante',
      inputs: [
        {
          nombre: 'nombre',
          requerido: [true]
        },
        {
          nombre: 'apellido',
          requerido: [true]
        },
        {
          nombre: 'dni',
          requerido: [true]
        },
        {
          nombre: 'mailParticular',
          requerido: [true]
        },
        {
          nombre: 'telefonoParticular',
          requerido: [true]
        },
        {
          nombre: 'domicilioReal',
          requerido: [true]
        },
        {
          nombre: 'codigoPostalReal',
          requerido: [true]
        },
        {
          nombre: 'numeroMatricula',
          requerido: [false]
        },
        {
          nombre: 'libroMatricula',
          requerido: [false, 'numeroMatricula'],
          padre: 'numeroMatricula'
        },
        {
          nombre: 'tomoMatricula',
          requerido: [false, 'numeroMatricula'],
          padre: 'numeroMatricula'
        },
        {
          nombre: 'folioMatricula',
          requerido: [false, 'numeroMatricula'],
          padre: 'numeroMatricula'
        }
      ]
    },
    {
      id: getS(),
      titulo: 'Motivo de la Denuncia',
      inputs: [
        {
          nombre: 'motivoDenuncia',
          requerido: [true]
        },
        {
          nombre: 'archivoDenuncia',
          requerido: [false],
          multiple: true
        }
      ]
    }
  ]
};

export default denunciaMesaEntrada;
