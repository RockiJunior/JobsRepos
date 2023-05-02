import { EstadoTramite } from '@prisma/client';
import areas from '../../areas';
import tramites from '../../tramites';
import { actions } from '../actions/actions';
import { nextConditions } from '../actions/nextConditions';
import { onReject } from '../actions/onReject';
import { getS } from '../variables';
import TipoTramite from './interfaceTipoTramite';

const solicitudLicenciaPasividadEmpleado: TipoTramite = {
  id: tramites.solicitudLicenciaPasividadEmpleado,
  titulo: 'Solicitud de Licencia por Pasividad (Empleado)',
  areaId: areas.matriculacion,
  plazo: 180,
  tipo: 'tramite',
  puedeIniciar: 'empleado',
  requiere: 'matricula',
  pasos: [
    {
      id: 0,
      variant: 'success',
      title:
        'Baja de Matrícula Profesional solicitada a través de Carta Documento',
      description: `Ante el Área de Matriculación se procede a iniciar el trámite y completar los datos solicitados.-`,
      intraTitle: 'Inicio del Trámite Área Matriculación',
      actions: [
        actions.cantAddDataUser(),
        actions.canAddDataEmployee(areas.matriculacion),
        actions.startPlazo(5, areas.matriculacion),
        actions.canGoNextStep(areas.matriculacion),
        actions.canCancel()
      ],
      intraDescription: `Complete el Formulario con los datos del Matriculado solicitante y cargue la documentación correspondiente`
    },
    {
      id: 1,
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
        onReject.goTo(5),
        onReject.changeStatus(EstadoTramite.rechazado)
      ],
      intraTitle: 'Verificacion por Área Finanzas',
      intraDescription: `Verificacion de deudas por parte del Área de Finanzas, y de ser necesario se genera un informe.`
    },
    {
      id: 2,
      variant: 'info',
      title: 'Presentación de documentación',
      description: `Debes solicitar un turno en la pestaña "Turno" para presentar la documentación de forma presencial en las oficinas de CUCICBA.`,
      actions: [
        actions.startPlazo(5, areas.matriculacion),
        actions.intraAppointment(areas.matriculacion),
        actions.canGoPrevStep(areas.matriculacion),
        actions.firmaPdf()
      ],
      nextConditions: [nextConditions.appointmentApproved()],
      intraTitle: 'Presentación de documentación ante personal de CUCICBA',
      intraDescription: `Debes solicitar un turno en la pestaña "Turno" para recepción y revisión de la documentación`
    },
    {
      id: 3,
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
        onReject.goTo(5),
        onReject.changeStatus(EstadoTramite.rechazado)
      ],
      intraTitle: 'Honorable Consejo Directivo',
      intraDescription: `Aprobación o rechazo de la documentación presentada.`
    },
    {
      id: 4,
      variant: 'success',
      title: 'Solicitud aprobada',
      description: `Se ha aprobado tu solicitud de Licencia por Pasividad`,
      actions: [actions.pasivaMatricula(), actions.approveTramite()],
      intraTitle: 'Liciencia por pasividad',
      intraDescription: `Se ha aprobado la solicitud de Licencia por Pasividad.`
    },
    {
      id: 5,
      variant: 'danger',
      title: 'Se ha rechazado la solicitud y ha finalizacion del Trámite',
      description: `El Trámite ha finalizado`,
      intraTitle: 'Trámite Terminado',
      intraDescription: `El Trámite ha finalizado`
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
          isDisabled: true,
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

export default solicitudLicenciaPasividadEmpleado;
