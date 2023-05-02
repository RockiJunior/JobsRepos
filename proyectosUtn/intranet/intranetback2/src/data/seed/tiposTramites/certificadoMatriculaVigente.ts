import TipoTramite from './interfaceTipoTramite';
import areas from '../../areas';
import { EstadoTramite } from '@prisma/client';
import { getS } from '../variables';
import tramites from '../../tramites';
import { actions } from '../actions/actions';
import { nextConditions } from '../actions/nextConditions';
import { onReject } from '../actions/onReject';

const certificadoMatriculaVigente: TipoTramite = {
  id: tramites.certificadoMatriculaVigente,
  titulo: 'Certificado de Matrícula Vigente',
  areaId: areas.matriculacion,
  plazo: 180,
  tipo: 'tramite',
  puedeIniciar: 'usuario',
  requiere: 'actividadComercial',
  descripcion: `El certificado de matrícula vigente es un documento que acredita que el contribuyente se encuentra al día con sus obligaciones tributarias y que no se encuentra en estado de cesación de actividades.`,
  pasos: [
    {
      id: 0,
      variant: 'info',
      title: 'Bienvenido/a al trámite Certificado de Matrícula Vigente',
      description: `Se te asignara un empleado para gestionar tu solicitud. 
      <br/> Si tenes alguna duda, podes enviar un mail a
      info@colegioinmobiliario.org.ar o llamar al 4124-6060`,
      actions: [
        actions.canCancel(),
        actions.manualAssingEmployee(),
        actions.cantAddDataUser(),
        actions.canGoNextStep(areas.matriculacion)
      ],
      nextConditions: [nextConditions.asignedEmployee()],
      intraTitle: 'Inicio del trámite',
      intraDescription:
        'Asignación de un responsable del Área de Matriculación para gestionar la solicitud'
    },
    {
      id: 1,
      variant: 'info',
      title: 'Revisión por parte de Legales',
      description: `Solicitud revisada por Área Legales para verificar si contrae sanciones`,
      actions: [
        actions.sendTo(areas.legales),
        actions.startPlazo(5, areas.legales),
        actions.canAddInformes(areas.legales),
        actions.canGoNextStep(areas.legales, ['hasInforme'])
      ],
      intraTitle: 'Revisión de solicitud por parte del Área de Legales',
      intraDescription: `Debes generar un informe sobre la verificación de sanciones.`
    },
    {
      id: 2,
      variant: 'info',
      title: 'Revisión por parte de Finanzas',
      description: `Solitud revisada por Área Finanzas para verificar si contrae deudas`,
      actions: [
        actions.sendTo(areas.finanzas),
        actions.startPlazo(5, areas.finanzas),
        actions.canAddInformes(areas.finanzas),
        actions.canGoNextStep(areas.finanzas, ['hasInforme']),
        actions.canGoPrevStep(areas.finanzas)
      ],
      intraTitle: 'Revisión por parte del Área de Finanzas',
      intraDescription: `Debes generar un informe sobre la verificación de deudas.`
    },
    {
      id: 3,
      variant: 'info',
      title: 'Solicitud en revision por Área Matriculación',
      description: `Matriculación determina si la matricula esta vigente o no`,
      actions: [
        actions.sendTo(areas.matriculacion),
        actions.approveOrReject('Aprobar', 'Rechazar'),
        actions.canGoPrevStep(areas.matriculacion)
      ],
      nextConditions: [nextConditions.allAreasApproved()],
      onRejectActions: [
        onReject.goTo(6),
        onReject.changeStatus(EstadoTramite.rechazado)
      ],
      intraTitle: 'Revision por parte del Área de Matriculacion',
      intraDescription: `Aprobación o rechazo de la solicitud parte del Área Matriculación.`
    },
    {
      id: 4,
      variant: 'success',
      title: 'Carga de Certificado de Matricula Vigente',
      description: `El trámite fue aprobado`,
      actions: [
        actions.cantAddDataUser(),
        actions.canAddDataEmployee(areas.matriculacion),
        actions.canGoNextStep(areas.matriculacion),
        actions.tipoSeccion('certificadoVigente')
        //actions.notify('user', 'certificadoMatriculaVigente') //TODO: No existe este tipo de notificacion en notify
      ],
      intraTitle: 'Carga Certificado',
      intraDescription: `Debes cargar el Certificado de Matricula Vigente.`
    },
    {
      id: 5,
      variant: 'success',
      title: 'El Tramite ha Finalizado',
      description: `El trámite fue aprobado y se encuentra finalizado`,
      actions: [actions.approveTramite()],
      intraTitle: 'Tramite terminado',
      intraDescription: `El trámite fue aprobado y se encuentra finalizado`
    },
    {
      id: 6,
      variant: 'danger',
      title: 'Tu solicitud ha sido rechazada',
      description: `La solicitud ha sido rechazada`,
      intraTitle: 'Tramite Terminado',
      intraDescription: `La solicitud ha sido rechazada`
    }
  ],
  secciones: [
    {
      id: getS(),
      titulo: 'Certificado de Matricula Vigente',
      tipo: 'certificadoVigente',
      inputs: [
        {
          nombre: 'certificadoMatriculaVigente',
          requerido: [true]
        }
      ]
    }
  ]
};

export default certificadoMatriculaVigente;
