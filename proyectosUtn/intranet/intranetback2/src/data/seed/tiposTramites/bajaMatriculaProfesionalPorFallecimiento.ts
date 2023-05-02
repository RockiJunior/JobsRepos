import { EstadoTramite } from '@prisma/client';
import areas from '../../areas';
import tramites from '../../tramites';
import { actions } from '../actions/actions';
import { nextConditions } from '../actions/nextConditions';
import { onReject } from '../actions/onReject';
import { getS } from '../variables';
import TipoTramite from './interfaceTipoTramite';

const bajaProfesionalPorFallecimiento: TipoTramite = {
  id: tramites.bajaProfesionalPorFallecimiento,
  titulo: 'Baja Profesional por Fallecimiento',
  areaId: areas.matriculacion,
  plazo: 180,
  tipo: 'tramite',
  puedeIniciar: 'empleado',
  requiere: 'matricula',
  pasos: [
    {
      id: 0,
      variant: 'success',
      title: 'Baja de Matrícula Profesional por fallecimiento',
      description: `Complete el Formulario del Matriculado fallecido y cargue la documentación correspondiente.-`,
      intraTitle: 'Inicio del Tramite en el Área Matriculación',
      actions: [
        actions.canCancel(),
        actions.cantAddDataUser(),
        actions.canAddDataEmployee(areas.matriculacion),
        actions.canAddArchivos(areas.matriculacion),
        actions.startPlazo(5, areas.matriculacion)
      ],
      nextConditions: [nextConditions.allInputsApproved()],
      intraDescription:
        'Debes completar los Formularios, uno con los datos del Matriculado fallecido y el otro con los datos del solicitante.'
    },
    {
      id: 1,
      variant: 'success',
      title: 'Solicitud de Turno',
      description: ``,
      actions: [
        actions.startPlazo(5, areas.matriculacion),
        actions.intraAppointment(areas.matriculacion),
        actions.canGoPrevStep(areas.matriculacion)
      ],
      nextConditions: [nextConditions.appointmentApproved()],
      intraTitle: 'Presentación de documentación en las oficinas de CUCICBA',
      intraDescription: `Debes solicitar un turno en la pestaña "Turno" para recepción y revisión de la documentación`
    },
    {
      id: 2,
      variant: 'info',
      title:
        'La solicitud ha sido presentada ante el Honorable Consejo Directivo',
      description: `Tu solicitud esta siendo revisada`,
      actions: [
        actions.sendTo(areas.consejoDirectivo),
        actions.approveOrReject('Aprobar', 'Rechazar'),
        actions.startPlazo(5, areas.consejoDirectivo),
        actions.canGoPrevStep(areas.consejoDirectivo)
      ],
      nextConditions: [nextConditions.allAreasApproved()],
      onRejectActions: [
        onReject.goTo(4),
        onReject.changeStatus(EstadoTramite.rechazado)
      ],
      intraTitle: 'Honorable Consejo Directivo',
      intraDescription: `Aprobación o rechazo de la solicitud`
    },
    {
      id: 3,
      variant: 'info',
      title: 'Baja del servicio',
      description: `El servicio se dio de baja a causa del fallecimiento del matriculado`,
      actions: [
        actions.inactivateMatricula(),
        actions.setActividadComercial(false),
        actions.deleteComercialData(),
        actions.approveTramite()
      ],
      intraTitle: 'Baja de Servicio',
      intraDescription: `El servicio se dio de baja a causa del fallecimiento del matriculado`
    },
    {
      id: 4,
      variant: 'success',
      title: 'Finalizacion del Tramite',
      description: `El Tramite vuelve al Área Matriculación para su finalización`,
      actions: [actions.sendTo(areas.matriculacion)],
      intraTitle: 'Tramite Terminado',
      intraDescription: `El Tramite vuelve al Área Matriculación para su finalización`
    }
  ],
  secciones: [
    {
      id: getS(),
      titulo: 'Datos del matriculado',
      inputs: [
        {
          nombre: 'nombre',
          requerido: [true],
          isDisabled: true
        },
        {
          nombre: 'apellido',
          requerido: [true],
          isDisabled: true
        },
        {
          nombre: 'dni',
          requerido: [true],
          isDisabled: true
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
          nombre: 'domicilioLegal',
          requerido: [true]
        },
        {
          nombre: 'codigoPostalLegal',
          requerido: [true],
          padre: 'domicilioLegal'
        },
        {
          nombre: 'numeroMatricula',
          requerido: [true],
          isDisabled: true
        },
        {
          nombre: 'libroMatricula',
          requerido: [false, 'numeroMatricula'],
          isDisabled: true,
          padre: 'numeroMatricula'
        },
        {
          nombre: 'tomoMatricula',
          requerido: [false, 'numeroMatricula'],
          isDisabled: true,
          padre: 'numeroMatricula'
        },
        {
          nombre: 'folioMatricula',
          requerido: [false, 'numeroMatricula'],
          isDisabled: true,
          padre: 'numeroMatricula'
        },
        {
          nombre: 'legajoMatricula',
          requerido: [false, 'numeroMatricula'],
          padre: 'numeroMatricula'
        },
        {
          nombre: 'fechaFallecimiento',
          requerido: [true]
        }
      ]
    },
    {
      id: getS(),
      titulo: 'Datos del solicitante',
      inputs: [
        {
          nombre: 'nombreSolicitante',
          requerido: [true]
        },
        {
          nombre: 'apellidoSolicitante',
          requerido: [true]
        },
        {
          nombre: 'dniSolicitante',
          requerido: [true]
        },
        {
          nombre: 'parentescoSolicitante',
          requerido: [true]
        },
        {
          nombre: 'mailParticularSolicitante',
          requerido: [true]
        },
        {
          nombre: 'telefonoParticularSolicitante',
          requerido: [true]
        },
        {
          nombre: 'domicilioRealSolicitante',
          requerido: [true]
        },
        {
          nombre: 'codigoPostalRealSolicitante',
          requerido: [true]
        }
      ]
    }
  ]
};

export default bajaProfesionalPorFallecimiento;
