import { EstadoTramite } from '@prisma/client';
import areas from '../../areas';
import tramites from '../../tramites';
import { actions } from '../actions/actions';
import { nextConditions } from '../actions/nextConditions';
import { onReject } from '../actions/onReject';
import { prevConditions } from '../actions/prevConditions';
import { getS } from '../variables';
import TipoTramite from './interfaceTipoTramite';

const seguroCaucion: TipoTramite = {
  id: tramites.seguroCaucion,
  titulo: 'Presentación de Seguro de Caución/Fianza Fiduciaria',
  areaId: areas.matriculacion,
  plazo: 180,
  tipo: 'tramite',
  puedeIniciar: 'usuario',
  requiere: 'matricula',
  descripcion: `El Seguro de Caución es un seguro que garantiza el cumplimiento de las obligaciones que asume el matriculado en el ejercicio de su profesión.`,
  pasos: [
    {
      id: 0,
      variant: 'info',
      title: 'Bienvenido/a al trámite de Seguro de Caución/Fianza Fiduciaria',
      description: `Debes presentar la documentación correspondiente, una vez realizado, 
      se te asignara un empleado del Área Matriculación para que revise
      tu documentación. <br/> Si tenes alguna duda, podes enviar un mail a
      info@colegioinmobiliario.org.ar o llamar al 4124-6060`,
      intraTitle: 'Inicio del Trámite',
      actions: [actions.canCancel()],
      nextConditions: [nextConditions.allRequiredFilled()],
      intraDescription: `Inicio del trámite, el Matriculado debe subir el Seguro de Caución.`
    },
    {
      id: 1,
      variant: 'info',
      title: 'Revisión de documentación',
      description: `Tu documentación esta siendo revisada por personal del Área Matriculacion. <br/>
      Una vez que el mismo haya revisado, se te notificará y podras continuar con el trámite.`,
      nextConditions: [
        nextConditions.allInputsSent(),
        nextConditions.asignedEmployee()
      ],
      actions: [actions.manualAssingEmployee(), actions.canCancel()],
      intraTitle: 'Revisión de documentación por parte de un matriculador',
      intraDescription:
        'El aspirante debe modificar la información requerida y subir los documentos faltantes.'
    },
    {
      id: 2,
      variant: 'info',
      title: 'Revisión de documentación',
      description: `Tu documentación esta siendo revisada por un matriculador. <br/>
        Una vez que el matriculador haya revisado tu documentación, se te
        notificara por mail y podras continuar con el trámite.`,
      prevConditions: [prevConditions.someInputsRequest()],
      nextConditions: [nextConditions.allAreasApproved()],
      onRejectActions: [onReject.goTo(5)],
      actions: [
        actions.startPlazo(5, areas.matriculacion),
        actions.approveOrReject(
          'Aprobar documentación',
          'Rechazar documentación'
        ),
        actions.canApproveTramite(4),
        actions.canCancel()
      ],
      intraTitle: 'Revisión de documentación por parte de un matriculador',
      intraDescription: `Para continuar con el trámite, el matriculador debe aprobar la documentación y aprobar el paso.<br/>
        Si el matriculador rechaza el paso, el trámite finaliza como rechazado.<br/>
        Si el documento posee firma digital puede aprobarse el trámite sin necesidad de aprobar el paso.  
        `
    },
    {
      id: 3,
      variant: 'info',
      title: 'Solicitar turno',
      description: `Tu documentación ha sido aprobada.<br/>
      Debes solicitar un turno en la pestaña "Turno" para presentar la documentación de forma presencial en las oficinas de CUCICBA.`,
      actions: [actions.appointment(areas.matriculacion), actions.canCancel()],
      nextConditions: [nextConditions.appointmentApproved()],
      intraTitle: 'Presentación de documentación en las oficinas de CUCICBA',
      intraDescription: `Aprobación o rechazo de la documentación presentada.<br/>
      El aspirante debe solicitar turno. Una vez solicitado la información del mismo aparecerá en la pestaña "Turno"`
    },
    {
      id: 4,
      variant: 'success',
      title: 'Tu presentación ha sido aprobada',
      description: `La presentación ha sido aprobada`,
      actions: [actions.approveTramite()],
      intraTitle: 'Trámite Terminado',
      intraDescription: 'Finalizo el trámite como aprobado'
    },
    {
      id: 5,
      variant: 'danger',
      title: 'Tu presentación ha sido rechazada',
      description: `La presentación ha sido rechazada`,
      intraTitle: 'Trámite Terminado',
      intraDescription: 'Finalizo el trámite como rechazado',
      actions: [actions.changeStatus(EstadoTramite.rechazado)]
    }
  ],
  secciones: [
    {
      id: getS(),
      titulo: 'Poliza de Seguro de Caución',
      inputs: [
        {
          nombre: 'polizaSeguro',
          requerido: [true]
        }
      ]
    }
  ]
};

export default seguroCaucion;
