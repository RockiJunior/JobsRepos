import { EstadoTramite } from '@prisma/client';
import areas from '../../areas';
import tramites from '../../tramites';
import { actions } from '../actions/actions';
import { nextConditions } from '../actions/nextConditions';
import { onReject } from '../actions/onReject';
import { getS } from '../variables';
import TipoTramite from './interfaceTipoTramite';

const subsidioPorFallecimiento: TipoTramite = {
  id: tramites.subsidioPorFallecimiento,
  titulo: 'Solicitud de Subsidio por Fallecimiento',
  areaId: areas.matriculacion,
  plazo: 180,
  tipo: 'tramite',
  puedeIniciar: 'empleado',
  requiere: 'matricula',
  pasos: [
    {
      id: 0,
      variant: 'success',
      title: 'Solicitud de Subsidio por Fallecimiento',
      description: `Complete el Formulario con los datos del solicitante.-`,
      intraTitle: 'Inicio del Trámite Área Matriculación',
      actions: [
        actions.canCancel(),
        actions.cantAddDataUser(),
        actions.canAddDataEmployee(areas.matriculacion),
        actions.canGoNextStep(areas.matriculacion),
        actions.startPlazo(5, areas.matriculacion)
      ],
      nextConditions: [nextConditions.allInputsApproved()],
      intraDescription:
        'Debes completar el Formulario con los datos del solicitante'
    },
    {
      id: 1,
      variant: 'success',
      title: 'Solicitar Turno',
      description: `Se debe solicitar un turno en la pestaña "Turno" para presentar la documentación
        de forma presencial en las oficinas de CUCICBA.`,
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
      title: 'Revisión de Solicitud',
      description: `Tu solicitud esta siendo verificada por el Área de Legales.`,
      actions: [
        actions.sendTo(areas.legales),
        actions.startPlazo(5, areas.legales),
        actions.canAddInformes(areas.legales),
        actions.canGoNextStep(areas.legales, ['hasInforme']),
        actions.canGoPrevStep(areas.legales)
      ],
      intraTitle: 'Revisión de documentación por parte del Área de Legales',
      intraDescription: `Debes generar un informe.`
    },
    {
      id: 3,
      variant: 'info',
      title: 'Revisión de Solicitud',
      description: `Tu solicitud esta siendo verificada por el Área de Finanzas.`,
      actions: [
        actions.sendTo(areas.finanzas),
        actions.startPlazo(5, areas.finanzas),
        actions.canAddInformes(areas.finanzas),
        actions.canGoNextStep(areas.finanzas, ['hasInforme']),
        actions.canGoPrevStep(areas.finanzas)
      ],
      intraTitle: 'Revisión de documentación por parte del Área de Finanzas',
      intraDescription: `Debes generar un informe.`
    },
    {
      id: 4,
      variant: 'info',
      title: 'Revisión de Solicitud',
      description: `Tu solicitud esta siendo verificada por el Área de Fiscaluzacion.`,
      actions: [
        actions.sendTo(areas.fiscalizacion),
        actions.startPlazo(5, areas.fiscalizacion),
        actions.canAddInformes(areas.fiscalizacion),
        actions.canGoNextStep(areas.fiscalizacion, ['hasInforme']),
        actions.canGoPrevStep(areas.fiscalizacion)
      ],
      intraTitle:
        'Revisión de documentación por parte del Área de Fiscalizacion',
      intraDescription: `Debes generar un informe.`
    },
    {
      id: 5,
      variant: 'info',
      title: 'Revisión de Solicitud',
      description: `Tu solicitud esta siendo verificada por el Área de Finanzas.`,
      nextConditions: [
        nextConditions.allAreasApproved(),
        nextConditions.allInputsApproved()
      ],
      actions: [
        actions.sendTo(areas.finanzas),
        actions.startPlazo(5, areas.finanzas),
        actions.canAddDataEmployee(areas.finanzas),
        actions.cantAddDataUser(),
        actions.tipoSeccion('formaPagoSubsidio'),
        actions.canGoPrevStep(areas.finanzas),
        actions.approveOrReject('Aprobar', 'Rechazar')
      ],

      onRejectActions: [
        actions.notifyMail('rechazado'),
        onReject.changeStatus(EstadoTramite.rechazado)
      ],
      intraTitle: 'Aprobación o rechazo por parte del Área de Finanzas',
      intraDescription: `Debes Aprobación o rechazar la solicitud, y en caso de aprobar primero debes cargar la forma de pago.`
    },
    {
      id: 6,
      variant: 'info',
      title: 'Cobro por parte del beneficiario',
      description: `Pago del subsidio.`,
      actions: [
        actions.notifyMail('formaPago'),
        actions.canAddDataEmployee(areas.finanzas),
        actions.cantAddDataUser(),
        actions.tipoSeccion('subsidio'),
        actions.canGoPrevStep(areas.finanzas),
        actions.canGoNextStep(areas.finanzas)
      ],
      nextConditions: [nextConditions.allInputsApproved()],
      intraTitle: 'Pago del subsidio y finalización del trámite',
      intraDescription: `Pago del subsidio.`
    },
    {
      id: 7,
      variant: 'success',
      title: 'Trámite Finalizado',
      actions: [actions.approveTramite()],
      description: `Ya se abono el subsidio y el trámite ha finalizado`,
      intraTitle: 'Trámite Terminado',
      intraDescription: `Ya se abono el subsidio y el trámite ha finalizado`
    }
  ],
  secciones: [
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
    },
    {
      id: getS(),
      titulo: 'Forma de Pago',
      tipo: 'formaPagoSubsidio',
      inputs: [
        {
          nombre: 'formaPago',
          requerido: [true]
        }
      ]
    },
    {
      id: getS(),
      titulo: 'Monto percibido',
      tipo: 'subsidio',
      inputs: [
        {
          nombre: 'montoSubsidio',
          requerido: [true]
        }
      ]
    }
  ]
};

export default subsidioPorFallecimiento;
