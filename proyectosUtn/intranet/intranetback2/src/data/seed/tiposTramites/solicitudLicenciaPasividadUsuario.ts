import { EstadoTramite } from '@prisma/client';
import areas from '../../areas';
import tramites from '../../tramites';
import { actions } from '../actions/actions';
import { nextConditions } from '../actions/nextConditions';
import { onReject } from '../actions/onReject';
import { prevConditions } from '../actions/prevConditions';
import { getS } from '../variables';
import TipoTramite from './interfaceTipoTramite';

const solicitudLicenciaPasividadUsuario: TipoTramite = {
  id: tramites.solicitudLicenciaPasividadUsuario,
  titulo: 'Solicitud de Licencia por Pasividad (Matriculado)',
  areaId: areas.matriculacion,
  plazo: 180,
  tipo: 'tramite',
  puedeIniciar: 'usuario',
  requiere: 'matricula',
  descripcion: `El Matriculado que se encuentre en estado de pasividad, podrá solicitar la licencia por pasividad`,
  pasos: [
    {
      id: 0,
      variant: 'info',
      title: 'Solicitud de Licencia por Pasividad',
      description: `Tu primer paso es completar el Si tenes alguna duda, podes enviar un mail a
      info@colegioinmobiliario.org.ar o llamar al 4124-6060`,
      nextConditions: [nextConditions.allRequiredFilled()],
      actions: [actions.canCancel()],
      intraTitle: 'Inicio del Trámite',
      intraDescription:
        'Inicio del trámite, el Matriculado debe completar el formulario.'
    },
    {
      id: 1,
      variant: 'info',
      title: 'Solicitud de Licencia por Pasividad',
      description: `Debe ingresar los datos para iniciar el trámite`,
      nextConditions: [
        nextConditions.allInputsSent(),
        nextConditions.asignedEmployee()
      ],
      actions: [actions.manualAssingEmployee()],
      intraTitle: 'Asignación del personal Área Matriculación',
      intraDescription:
        'Se debe asignar un empleado del Área Matriculación para gestionar el trámite iniciado.'
    },
    {
      id: 2,
      variant: 'info',
      title: 'Revisión de documentación',
      description: `Tu documentación esta siendo revisada por personal del Área Matriculación. <br/>
      Una vez que el mismo haya revisado, se te notificara y podras continuar con el trámite.`,
      prevConditions: [prevConditions.someInputsRequest()],
      nextConditions: [nextConditions.allInputsApproved()],
      actions: [actions.startPlazo(5, areas.matriculacion)],
      intraTitle: 'Revisión de documentación por Área Matriculación',
      intraDescription:
        'Revisión de los datos ingresados en el formulario por el Matriculado solicitante.'
    },
    {
      id: 3,
      variant: 'info',
      title: 'Verificación por parte del Área de Finanzas',
      description: `Verificación por parte del Área de Finanzas, si el Matriculado posee deudas pendientes, 
      en caso afirmativo debera cancelarlas para continuar con el trámite.`,
      nextConditions: [nextConditions.allAreasApproved()],
      actions: [
        actions.sendTo(areas.finanzas),
        actions.canAddInformes(areas.finanzas),
        actions.canGoPrevStep(areas.finanzas),
        actions.approveOrReject('Aprobar', 'Rechazar')
      ],
      onRejectActions: [
        onReject.goTo(7),
        onReject.changeStatus(EstadoTramite.rechazado)
      ],
      intraTitle: 'Verificacion por Área Finanzas',
      intraDescription:
        'Verificación por parte del Área Finanzas, de ser necesario genera un informe y puedes aprobar o rechazar la solicitud.'
    },
    {
      id: 4,
      variant: 'info',
      title: 'Presentación de documentación',
      description: `Debes solicitar un turno en la pestaña "Turno" para presentar la documentación de forma presencial en las oficinas de CUCICBA.`,
      actions: [
        actions.appointment(areas.matriculacion),
        actions.firmaPdf(),
        actions.canGoPrevStep(areas.matriculacion)
      ],
      nextConditions: [nextConditions.appointmentApproved()],
      intraTitle: 'Presentación de documetnación ante personal de CUCICBA',
      intraDescription: `Aprobación o rechazo de la documentación presentada.<br/>
      El aspirante debe solicitar turno. Una vez solicitado la información del mismo aparecerá en la pestaña "Turno"`
    },
    {
      id: 5,
      variant: 'info',
      title:
        'Tu solicitud ha sido presentada ante el Honorable Consejo Directivo',
      description: `Tu solicitud esta siendo revisada`,
      actions: [
        actions.sendTo(areas.consejoDirectivo),
        actions.approveOrReject('Aprobar', 'Rechazar'),
        actions.startPlazo(5, areas.consejoDirectivo),
        actions.canGoPrevStep(areas.consejoDirectivo)
      ],
      nextConditions: [nextConditions.allAreasApproved()],
      onRejectActions: [
        onReject.goTo(7),
        onReject.changeStatus(EstadoTramite.rechazado)
      ],
      intraTitle: 'Honorable Consejo Directivo',
      intraDescription: 'Aprobación o rechazo de la documentación presenta.'
    },
    {
      id: 6,
      variant: 'success',
      title: 'Solicitud aprobada, entraga de Licencia por pasividad',
      description: `Se entrega Licencia por pasividad`,
      actions: [actions.pasivaMatricula(), actions.approveTramite()],
      intraTitle: 'Liciencia por pasividad',
      intraDescription:
        'La solicitud de Licencia por pasividad ha sido aprobada.'
    },
    {
      id: 7,
      variant: 'danger',
      title: 'Se ha rechazado la solicitud y ha finalizacion del Trámite',
      description: `El Trámite ha finalizado`,
      intraTitle: 'Trámite Terminado',
      intraDescription: 'El trámite ha sido rechazado.'
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
          nombre: 'motivoSolicitud',
          requerido: [true]
        }
      ]
    }
  ]
};

export default solicitudLicenciaPasividadUsuario;
