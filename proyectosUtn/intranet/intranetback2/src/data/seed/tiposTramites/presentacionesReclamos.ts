import { EstadoTramite } from '@prisma/client';
import areas from '../../areas';
import tramites from '../../tramites';
import { actions } from '../actions/actions';
import { nextConditions } from '../actions/nextConditions';
import { onReject } from '../actions/onReject';
import { onRequestChanges } from '../actions/onRequestChanges';
import { getS } from '../variables';
import TipoTramite from './interfaceTipoTramite';

const presentacionesReclamos: TipoTramite = {
  id: tramites.presentacionesReclamos,
  titulo: 'Presentaciones/Reclamos',
  areaId: areas.mesaEntrada,
  plazo: 180,
  tipo: 'denuncia',
  puedeIniciar: 'empleado',
  requiere: 'oculto',
  pasos: [
    {
      id: 0,
      variant: 'success',
      title: 'Presentaciones y Reclamos',
      description: ``,
      intraTitle: 'Inicio del Trámite Área Mesa de Entrada',
      actions: [
        actions.canCancel(),
        actions.sendTo(areas.mesaEntrada),
        actions.cantAddDataUser(),
        actions.canAddDataEmployee(areas.mesaEntrada),
        actions.canAddArchivos(areas.mesaEntrada),
        actions.canAddInformes(areas.mesaEntrada),
        actions.startPlazo(5, areas.mesaEntrada)
      ],
      nextConditions: [nextConditions.allInputsApproved()],
      intraDescription:
        'Debes completar el Formulario con los datos del solicitante, puedes incorporar de ser necesario, archivos e informes.'
    },
    {
      id: 1,
      variant: 'success',
      title: 'Presentaciones y Reclamos',
      description: `Revisión de la presentación/reclamo por parte del Área de Legales.`,
      actions: [
        actions.sendTo(areas.legales),
        actions.startPlazo(5, areas.legales),
        actions.canAddInformes(areas.legales),
        actions.approveOrReject('Aprobar', 'Desestimar'),
        actions.canRequestChanges(areas.legales)
      ],
      nextConditions: [
        nextConditions.allAreasApproved(),
        nextConditions.hasInforme()
      ],
      onRejectActions: [
        onReject.changeStatus(EstadoTramite.rechazado),
        onReject.notifyMail('rechazado')
      ],
      onRequestChanges: [onRequestChanges.goTo(0)],
      intraTitle:
        'Aprobar o desestimar la presentación y realizar informe por Área Leagales',
      intraDescription: `Debes generar un informe, y aprobar o desestimar la presentación/reclamo. <br>
      En caso de ser necesario, deberas devolver el trámite a Mesa de entrada y solicitar más información.`
    },
    {
      id: 2,
      variant: 'info',
      title: 'Presentaciones y Reclamos',
      description: `Revisión de la presentación/reclamo por parte del Honorable Consejo Directivo.`,
      actions: [
        actions.sendTo(areas.consejoDirectivo),
        actions.canAddResolucion(areas.consejoDirectivo),
        actions.canGoNextStep(areas.consejoDirectivo, ['hasResolucion']),
        actions.startPlazo(5, areas.consejoDirectivo),
        actions.canGoPrevStep(areas.consejoDirectivo),
        actions.notifyMail('reclamoAprobado')
      ],
      intraTitle: 'Generar Resolución HCD',
      intraDescription:
        'Debes generar una Resolución para la presentación/reclamo.'
    },
    {
      id: 3,
      variant: 'success',
      title: 'Presentaciones y Reclamos',
      description: ``,
      actions: [
        actions.changeStatus(EstadoTramite.aprobado),
        actions.notifyMail('approveTramite')
      ],
      intraTitle: 'Estado aprobado, y notificación de la Resolución.',
      intraDescription: `La presentación/reclamo ha finalizado.`
    }
  ],
  secciones: [
    {
      id: getS(),
      titulo: 'Datos del solicitante',
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
        }
      ]
    },
    {
      id: getS(),
      titulo: 'Datos de la Presentación o Reclamo',
      inputs: [
        {
          nombre: 'motivoPresentacionReclamo',
          requerido: [true]
        }
      ]
    }
  ]
};

export default presentacionesReclamos;
