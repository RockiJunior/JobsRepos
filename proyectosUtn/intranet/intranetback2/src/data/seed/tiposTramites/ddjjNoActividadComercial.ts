import areas from '../../areas';
import tramites from '../../tramites';
import { actions } from '../actions/actions';
import { nextConditions } from '../actions/nextConditions';
import { prevConditions } from '../actions/prevConditions';
import { getS } from '../variables';
import TipoTramite from './interfaceTipoTramite';

const ddjjNoActividadComercial: TipoTramite = {
  id: tramites.ddjjNoActividadComercial,
  titulo: 'Declaración Jurada de No Actividad Comercial',
  areaId: areas.matriculacion,
  plazo: 180,
  tipo: 'declaracion_jurada',
  puedeIniciar: 'usuario',
  requiere: 'matricula',
  descripcion: `La Declaración Jurada de No Actividad Comercial es un trámite que se realiza cuando el matriculado no ejerce la profesión, pero no desea dar de baja su matrícula.`,
  pasos: [
    {
      id: 0,
      variant: 'info',
      title: 'Declaración Jurada de No Actividad Comercial',
      description: `Tu primer paso es completar el formulario, una vez completado toda la
      información requerida ( #asterisco# ), se te asignará un empleado del Área Matriculación para que revise
      tu documentación. <br/> Si tenes alguna duda, podes enviar un mail a
      info@colegioinmobiliario.org.ar o llamar al 4124-6060`,
      intraTitle: 'Inicio del trámite',
      actions: [actions.tipoSeccion('noActividad'), actions.canCancel()],
      nextConditions: [nextConditions.allRequiredFilled()],
      intraDescription: `Inicio del trámite, el Matriculado debe completar el formulario.`
    },
    {
      id: 1,
      variant: 'info',
      title: 'Revisión de documentación',
      description: `Tu documentación esta siendo revisada por personal del Área Matriculación. <br/>
      Una vez que el mismo haya revisado, se te notificara y podras continuar con el trámite.`,
      nextConditions: [
        nextConditions.allInputsSent(),
        nextConditions.asignedEmployee()
      ],
      actions: [actions.manualAssingEmployee(), actions.canCancel()],
      intraTitle: 'Revisión de documentación por Área Matriculación',
      intraDescription: `Se debe asignar un empleado del Área Matriculación para gestionar el trámite iniciado.`
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
      intraDescription: `Revisión de los datos ingresados en el formulario por el Matriculado.`
    },
    {
      id: 3,
      variant: 'success',
      title: 'Documentación aprobada',
      description: `Tu documentación ha sido aprobada.<br/>
      Debes solicitar un turno en la pestaña "Turno" para presentar la documentación
      de forma presencial en las oficinas de CUCICBA.`,
      actions: [
        actions.appointment(areas.matriculacion),
        actions.firmaPdf(),
        actions.notifyMail('approvedData')
      ],
      nextConditions: [nextConditions.appointmentApproved()],
      intraTitle:
        'Solicitud de turno y presentación de documentación en las oficinas de CUCICBA',
      intraDescription: `Aprobación o rechazo de la documentación presentada.<br/>
      El aspirante debe solicitar turno. Una vez solicitado la información del mismo aparecerá en la pestaña "Turno"`
    },
    {
      id: 4,
      variant: 'info',
      title:
        'Tu documentación ha sido presentada y será revisada por otras áreas',
      description: `Se te podrán solicitar cambios en tu documentación`,
      nextConditions: ['allAreasAproved'],
      actions: [
        actions.canAddInformes(areas.matriculacion),
        actions.canGoNextStep(areas.matriculacion),
        actions.startPlazo(5, areas.matriculacion)
      ],
      intraTitle: 'Informes',
      intraDescription: `De ser necesario, deberas realizar un informe para la revisión de la documentación.`
    },
    {
      id: 5,
      variant: 'success',
      title: 'Declaración Jurada aprobada',
      description: `Tu declaración Jurada fue aprbada y finalizo el trámite.`,
      actions: [
        actions.approveTramite(),
        actions.setActividadComercial(false),
        actions.deleteComercialData(),
        actions.activateMatriculaSinActividad()
      ],
      intraTitle: 'Tramite Terminado',
      intraDescription: 'Aprobación de la declaración jurada.'
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
          nombre: 'celularParticular',
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
          nombre: 'domicilioLegal',
          requerido: [true]
        },
        {
          nombre: 'codigoPostalLegal',
          requerido: [true]
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
        }
      ]
    }
  ]
};

export default ddjjNoActividadComercial;
