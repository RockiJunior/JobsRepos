import areas from '../../areas';
import tramites from '../../tramites';
import { actions } from '../actions/actions';
import { nextConditions } from '../actions/nextConditions';
import { prevConditions } from '../actions/prevConditions';
import { getS } from '../variables';
import TipoTramite from './interfaceTipoTramite';

const certificadoFirmaCotizaciones: TipoTramite = {
  id: tramites.certificadoFirmaCotizaciones,
  titulo: 'Certificado de Firma de Cotizaciones/Tasaciones',
  areaId: areas.matriculacion,
  plazo: 180,
  tipo: 'tramite',
  puedeIniciar: 'usuario',
  requiere: 'actividadComercial',
  descripcion: `El certificado de firma de cotizaciones/tasaciones es un documento que certifica que la firma de la cotización/tasación es auténtica y que el profesional matriculado es el autor de la misma. Este certificado es necesario para poder presentar la cotización/tasación ante el organismo correspondiente.`,
  pasos: [
    {
      id: 0,
      variant: 'success',
      title:
        'Bienvenido/a al trámite Certificado de Firma de Cotizaciones/Tasaciones',
      description: `Tu primer paso es subir la cotización digital en
        la sección <strong>Documentación</strong>. 
        <br/> Si tenes alguna duda, podes enviar un mail a
        info@colegioinmobiliario.org.ar o llamar al 4124-6060`,
      actions: [actions.canCancel()],
      nextConditions: [nextConditions.allRequiredFilled()],
      intraTitle: 'Inicio del trámite',
      intraDescription: 'Sube la cotización digital'
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
      actions: [actions.manualAssingEmployee(), actions.canCancel()],
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
      intraTitle: 'Revisión de documentacion por parte del Área Matriculación.',
      intraDescription: 'Tu documentación esta siendo verificada'
    },
    {
      id: 3,
      variant: 'info',
      title: 'Pago de gastos administrativos',
      description: `Para poder continuar con el trámite, debes abonar los gastos
        administrativos.`,
      nextConditions: [
        nextConditions.sentTransaction([{ nombre: 'certificadoCotizaciones' }])
      ],
      actions: [
        actions.canCancel(),
        actions.createTransaction([{ nombre: 'certificadoCotizaciones' }])
      ],
      intraTitle: 'Pago de gastos administrativos',
      intraDescription:
        'Para poder continuar con el trámite, el solicitante debe abonar los gastos administrativos.'
    },
    {
      id: 4,
      variant: 'info',
      title: 'Pago de gastos administrativos',
      description: `El pago esta siendo revisado por el Área de Finanzas.`,
      nextConditions: [
        nextConditions.transactionApproved([
          { nombre: 'certificadoCotizaciones' }
        ])
      ],
      actions: [actions.startPlazo(5, areas.finanzas)],
      intraTitle: 'Pago de gastos administrativos control Área Finanzas',
      intraDescription: 'El pago esta siendo revisado por el Área de Finanzas.'
    },
    {
      id: 5,
      variant: 'success',
      title: 'Solicitar Turno',
      description: `Debes solicitar un turno en la pestaña "Turno" para presentar la documentación
      de forma presencial en las oficinas de CUCICBA.`,
      actions: [
        actions.sendTo(areas.matriculacion),
        actions.startPlazo(5, areas.matriculacion),
        actions.appointment(areas.matriculacion),
        actions.notifyMail('approvedTransaction'),
        actions.canGoPrevStep(areas.matriculacion)
      ],
      nextConditions: [nextConditions.appointmentApproved()],
      intraTitle:
        'Solicitud de turno y presentación de documentación en las oficinas de CUCICBA',
      intraDescription: `Aprobación o rechazo de la documentación presentada.<br/>
      El aspirante debe solicitar turno. Una vez solicitado la información del mismo aparecerá en la pestaña "Turno"`
    },
    {
      id: 6,
      variant: 'success',
      title: 'Tu solicitud fue aprobada',
      description: `Tu solicitud Certificado de Firma de Cotizaciones/Tasaciones fue aprobado`,
      actions: [actions.approveTramite()],
      intraTitle: 'Tramite aprobado',
      intraDescription:
        'La solicitud Certificado de Firma de Cotizaciones/Tasaciones fue aprobada'
    }
  ],
  secciones: [
    {
      id: getS(),
      titulo: 'Cotización digital',
      inputs: [
        {
          nombre: 'cotizacion',
          requerido: [true]
        }
      ]
    }
  ]
};

export default certificadoFirmaCotizaciones;
