import { EstadoTramite } from '@prisma/client';
import areas from '../../areas';
import tramites from '../../tramites';
import { actions } from '../actions/actions';
import { goto } from '../actions/goto';
import { onReject } from '../actions/onReject';
import { getS } from '../variables';
import TipoTramite from './interfaceTipoTramite';

const bajaProfesionalCartaDocumento: TipoTramite = {
  id: tramites.bajaProfesionalCartaDocumento,
  titulo: 'Baja Profesional por Carta Documento',
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
      description: `Complete el Formulario del Matriculado solicitante y cargue la documentación correspondiente.-`,
      intraTitle: 'Inicio del Tramite en el Área Matriculación',
      actions: [
        actions.cantAddDataUser(),
        actions.canAddDataEmployee(areas.matriculacion),
        actions.canAddArchivos(areas.matriculacion),
        actions.startPlazo(5, areas.matriculacion),
        actions.canGoNextStep(areas.matriculacion, ['hasArchivo', 'hasCedula']),
        actions.canCancel()
      ],
      intraDescription: 'Complete el Formulario del Matriculado solicitante'
    },
    {
      id: 1,
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
      intraTitle: 'Revisión de documentación por parte del Área de Legales',
      intraDescription:
        'Revisa y aprueba la solicitud para ir al siguiente paso'
    },
    {
      id: 2,
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
      intraTitle: 'Revisión de documentación por parte del Área de Finanzas',
      intraDescription:
        'Revisa y aprueba la solicitud para ir al siguiente paso'
    },
    {
      id: 3,
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
      intraTitle:
        'Revisión de documentación por parte del Área de Fiscalización',
      intraDescription:
        'Revisa y aprueba la solicitud para ir al siguiente paso'
    },
    {
      id: 4,
      variant: 'info',
      title:
        'La solicitud ha sido presentada ante el Honorable Consejo Directivo',
      description: `Tu solicitud esta siendo revisada por el Honorable Consejo Directivo.`,
      actions: [
        actions.sendTo(areas.consejoDirectivo),
        actions.approveOrReject('Aprobar', 'Rechazar'),
        actions.startPlazo(5, areas.consejoDirectivo),
        actions.canGoPrevStep(areas.consejoDirectivo)
      ],
      goto: [goto.allAreasApproved(6)],
      onRejectActions: [
        onReject.goTo(5),
        onReject.changeStatus(EstadoTramite.rechazado)
      ],
      intraTitle: 'Honorable Consejo Directivo',
      intraDescription:
        'Aprueba o rechaza la solicitud para dar de baja el servicio'
    },
    {
      id: 5,
      variant: 'danger',
      title: 'Tu solicitud fue rechazada y finalizo el Trámite',
      description: `El Tramite ha Finalizado`,
      intraTitle: 'Tramite Terminado',
      intraDescription: 'El Tramite ha Finalizado'
    },
    {
      id: 6,
      variant: 'info',
      title: 'Baja del Servicio',
      description: `La solicitud fue aprobada y se dio de baja el servicio`,
      actions: [
        actions.inactivateMatricula(),
        actions.approveTramite(),
        actions.setActividadComercial(false),
        actions.deleteComercialData()
      ],
      intraTitle: 'Baja de Servicio',
      intraDescription: 'Se dio de baja el servicio'
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

export default bajaProfesionalCartaDocumento;
