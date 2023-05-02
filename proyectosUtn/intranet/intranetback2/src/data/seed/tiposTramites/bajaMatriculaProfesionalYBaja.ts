import { EstadoTramite } from '@prisma/client';
import areas from '../../areas';
import tramites from '../../tramites';
import { actions } from '../actions/actions';
import { nextConditions } from '../actions/nextConditions';
import { onReject } from '../actions/onReject';
import { prevConditions } from '../actions/prevConditions';
import { getS } from '../variables';
import TipoTramite from './interfaceTipoTramite';

const ddjjBajaProfesionalYBaja: TipoTramite = {
  id: tramites.ddjjBajaProfesionalYBaja,
  titulo: 'Solicitud de Baja Profesional',
  areaId: areas.matriculacion,
  plazo: 180,
  tipo: 'declaracion_jurada',
  puedeIniciar: 'usuario',
  requiere: 'matricula',
  descripcion: `La baja de matrícula profesional es la cancelación de la matrícula profesional de un matriculado, por lo que no podrá realizar ninguna actividad profesional.`,
  pasos: [
    {
      id: 0,
      variant: 'success',
      title:
        'Bienvenido/a al trámite Solicitud de Baja de Matrícula Profesional',
      description: `Tu primer paso es completar el formulario, una vez completado toda la
        informacion requerida ( #asterisco# ), se te asignara un empleado del Área de Matriculación para que revise
        tu documentación. <br/> Si tenes alguna duda, podes enviar un mail a
        info@colegioinmobiliario.org.ar o llamar al 4124-6060`,
      nextConditions: [nextConditions.allRequiredFilled()],
      actions: [actions.canCancel()],
      intraTitle: 'Inicio del trámite',
      intraDescription: `Inicio del trámite, el Matriculado debe completar el formulario.`
    },
    {
      id: 1,
      variant: 'info',
      title: 'Revisión de documentación',
      description: `Se te asignara un empleado de CUCICBA del Área Matriculación.<br/>
        Una vez que el mismo haya revisado tu documentación, se te
        notificara y podras continuar con el trámite.`,
      nextConditions: [
        nextConditions.allInputsSent(),
        nextConditions.asignedEmployee()
      ],
      actions: [actions.manualAssingEmployee()],
      intraTitle: 'Asignación de empleado Área Matriculación',
      intraDescription: `Se debe asignar un empleado del Área Matriculación para gestionar el trámite iniciado.`
    },
    {
      id: 2,
      variant: 'info',
      title: 'Revisión de documentación',
      description: `Tu documentación esta siendo verificada por el Área Matriculación.`,
      prevConditions: [prevConditions.someInputsRequest()],
      nextConditions: [nextConditions.allInputsApproved()],
      actions: [actions.startPlazo(5, areas.matriculacion)],
      intraTitle: 'Revisión de documentación Área Matriculación',
      intraDescription: `Revisión de los datos ingresados en el formulario por el Matriculado solicitante.`
    },
    {
      id: 3,
      variant: 'info',
      title: 'Revisión de Solicitud',
      description: `Tu solicitud esta siendo verificada por el Área de Legales.`,
      actions: [
        actions.sendTo(areas.legales),
        actions.startPlazo(5, areas.legales),
        actions.canAddInformes(areas.legales),
        actions.generarCedula(areas.legales, 'mail'),
        actions.canGoNextStep(areas.legales, ['hasInforme']),
        actions.canGoPrevStep(areas.legales)
      ],
      intraTitle: 'Revisión de documentación Área de Legales',
      intraDescription: `Debes generar un informe y enviar una cédula via mail si hay deuda, trámites pendientes o sanciones.`
    },
    {
      id: 4,
      variant: 'info',
      title: 'Revisión de Solicitud',
      description: `Tu solicitud esta siendo verificada por el Área de Finanzas.`,
      actions: [
        actions.sendTo(areas.finanzas),
        actions.startPlazo(5, areas.finanzas),
        actions.canAddInformes(areas.finanzas),
        actions.generarCedula(areas.finanzas, 'mail'),
        actions.canGoNextStep(areas.finanzas, ['hasInforme']),
        actions.canGoPrevStep(areas.finanzas)
      ],
      intraTitle: 'Revisión de documentacion Área de Finanzas',
      intraDescription: `Debes generar un informe y enviar una cédula via mail si hay deuda, trámites pendientes o sanciones.`
    },
    {
      id: 5,
      variant: 'info',
      title: 'Revisión de Solicitud',
      description: `Tu solicitud esta siendo verificada por el Área de Fiscalización.`,
      actions: [
        actions.sendTo(areas.fiscalizacion),
        actions.startPlazo(5, areas.fiscalizacion),
        actions.canAddInformes(areas.fiscalizacion),
        actions.generarCedula(areas.fiscalizacion, 'mail'),
        actions.canGoNextStep(areas.fiscalizacion, ['hasInforme']),
        actions.canGoPrevStep(areas.fiscalizacion)
      ],
      intraTitle: 'Revisión de documentacion Área de Fiscalización',
      intraDescription: `Debes generar un informe y enviar una cédula via mail si hay deuda, trámites pendientes o sanciones.`
    },
    {
      id: 6,
      variant: 'success',
      title: 'Solicitar Turno',
      description: `Ya se han generado los informes de las areas intervinientes.<br/>
      Debes solicitar un turno en la pestaña "Turno" para presentar la documentación
      de forma presencial en las oficinas de CUCICBA.`,
      actions: [
        actions.sendTo(areas.matriculacion),
        actions.startPlazo(5, areas.matriculacion),
        actions.appointment(areas.matriculacion),
        actions.firmaPdf(),
        actions.canGoPrevStep(areas.matriculacion)
      ],
      nextConditions: [nextConditions.appointmentApproved()],
      intraTitle:
        'Solicitud de turno y presentación de documentación en las oficinas de CUCICBA',
      intraDescription: `Aprobación o rechazo de la documentación presentada.<br/>
      El aspirante debe solicitar turno. Una vez solicitado la información del mismo aparecerá en la pestaña "Turno"`
    },
    {
      id: 7,
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
        onReject.goTo(9),
        onReject.changeStatus(EstadoTramite.rechazado)
      ],
      intraTitle: 'Honorable Consejo Directivo',
      intraDescription: `Aprobación o rechazo de la documentación presentada.`
    },
    {
      id: 8,
      variant: 'info',
      title: 'Tu solicitud fue aprobada y se dio de baja tu matricula',
      description: `Se aprobo tu solicitud y se dio de baja tu matricula`,
      actions: [
        actions.inactivateMatricula(),
        actions.setActividadComercial(false),
        actions.deleteComercialData(),
        actions.approveTramite()
      ],
      intraTitle: 'Baja de Servicio',
      intraDescription: `Se aprobo tu solicitud y se dio de baja la matricula`
    },
    {
      id: 9,
      variant: 'danger',
      title: 'Tu solicitud fue rechazada y finalizo el Tramite',
      description: `El Tramite a Finalizado`,
      intraTitle: 'Tramite Terminado',
      intraDescription: `La solicitud fue rechazada y finalizo el Tramite.`
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

export default ddjjBajaProfesionalYBaja;
