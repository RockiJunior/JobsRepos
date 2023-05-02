import { EstadoProcesoLegales } from '@prisma/client';
import { IPaso } from '../interfaces/pasos.interface';
import areas from './areas';
import { actions } from './seed/actions/actions';
import { goto } from './seed/actions/goto';
import { nextConditions } from './seed/actions/nextConditions';
import { onReject } from './seed/actions/onReject';

const procesoLegalesPasos: IPaso[] = [
  {
    id: 0,
    variant: 'info',
    title: 'Expediente del Área de Legales',
    description: `Revisión por parte del Área de Legales.`,
    actions: [
      actions.canAddInformes(areas.legales),
      actions.sendTo(areas.legales),
      actions.canAddDictamen(areas.legales),
      actions.canGoNextStep(areas.legales, ['hasDictamen']),
      actions.canCancel()
    ],
    intraTitle: 'Generar Dictamen Área de Legales',
    intraDescription: `Generar un Dictamen Área Legales.`
  },
  {
    id: 1,
    variant: 'info',
    title: 'Expediente del Área de Legales',
    description: `Revisión por parte del Honorable Consejo Directivo.`,
    actions: [
      actions.sendTo(areas.consejoDirectivo),
      actions.startPlazo(5, areas.consejoDirectivo),
      actions.canAddResolucion(areas.consejoDirectivo),
      actions.canGoPrevStep(areas.consejoDirectivo),
      actions.approveOrReject('Dar curso', 'Desestimar'),
      actions.notifyExpediente('ingresoProceso', 'area')
    ],
    nextConditions: [
      nextConditions.allAreasApproved(),
      nextConditions.hasResolucion()
    ],
    onRejectActions: [
      onReject.changeStatus(EstadoProcesoLegales.desestimado),
      onReject.notifyMail('denunciaRechazada'),
      onReject.sendTo(areas.legales)
    ],
    // goto: [goto.tipoCedula('fisica', 5), goto.tipoCedula('electronica', 6)],
    // goto: [goto.denunciante('cucicba', 3), goto.denunciante('noCucicba', 2)],
    intraTitle:
      'Desestimación o dar curso a la denuncia Honorable Consejo Directivo',
    intraDescription: `Debe desestirmar la denunicia o proceder a dar curso.`
  },
  {
    id: 2,
    variant: 'info',
    title: 'Despacho de Imputación',
    description: `Ingreseo de Imputación/es`,
    intraTitle: 'Ingrese Imputaciones',
    actions: [
      actions.sendTo(areas.legales),
      actions.canAddArchivos(areas.legales),
      actions.canOnlyApprove(areas.legales, 'Generar Citación Ratificación'),
      actions.canGoPrevStep(areas.legales),
      actions.canAddImputaciones(areas.legales),
      actions.notifyExpediente('ingresoProceso', 'area')
    ],
    intraDescription: `Se debe ingresar las imputaciones para continuar con el Expediente desde el Área legales.`,
    goto: [goto.denunciante('cucicba', 5), goto.denunciante('noCucicba', 3)]
  },
  {
    id: 3,
    variant: 'info',
    title: 'Citación para Ratificación de la Denuncia',
    description: `Se genera cédula de Notificación`,
    intraTitle: 'Citación para Ratificación',
    actions: [
      actions.canAddInformes(areas.legales),
      actions.generarCedula(areas.legales, 'nomail'),
      actions.canGoNextStep(areas.legales, ['hasCedula']),
      actions.canGoPrevStep(areas.legales),
      actions.intraAppointment(areas.legales)
      // actions.denunciaPdf('imputaciones')
      // actions.cedulaNotificacionDenuncia('mail', 'solo', 'imputaciones'), // crea la cedula electronica y notifica solo al imputado (contenido de la imputacion)
      // actions.denunciaPdf('cedula') // contenido de la cedula
    ],
    intraDescription: `Debes realizar una cédula de Notificación para ratificar lo denunciado.`
  },
  {
    id: 4,
    variant: 'warning',
    title: 'Ratificación de Denuncia',
    description: ``,
    actions: [
      actions.canAddInformes(areas.legales),
      actions.sendTo(areas.legales),
      actions.canGoPrevStep(areas.legales),
      actions.approveOrReject('Ratificó', 'No Ratificó'),
      actions.canAddArchivos(areas.legales, 'Ratificación'),
      actions.denunciaPdf('citacionRatificacion')
    ],
    nextConditions: [
      nextConditions.allAreasApproved(),
      nextConditions.hasArchivo()
    ],
    onRejectActions: [
      onReject.changeStatus(EstadoProcesoLegales.no_ratificado),
      onReject.notifyMail('rechazado')
    ],
    intraTitle: 'Presentación de la Ratificación',
    intraDescription: `El denunciante debe ratificar lo denunciado, en caso de no hacerlo, finaliza el Expedidente.`
  },
  {
    id: 5,
    variant: 'info',
    title: 'Despacho citación a descargo',
    description: `Puedes realizar tu descargo a las imputaciones realizadas en tu contra.`,
    intraTitle: 'Despacho citación a descargo',
    actions: [
      actions.canAddArchivos(areas.legales),
      actions.canGoNextStep(areas.legales),
      actions.canGoPrevStep(areas.legales),
      actions.changeStatus(EstadoProcesoLegales.despacho_citacion_a_descargo),
      actions.canAddInformes(areas.legales),
      actions.generarCedula(areas.legales, 'nomail'),
      actions.denunciaPdf('citacionParaDescargo'),
      actions.notifyMail('verProcesoLegal')
      // actions.cedulaNotificacionDenuncia('mail', 'solo'), // crea la cedula electronica y notifica solo al imputado (contenido de la imputacion)
      // actions.denunciaPdf('cedula') // contenido de la cedula
    ],
    onGoPrevStep: ['cucicba/2', 'noCucicba/4'],
    intraDescription: `Debes generar la citación a descargo.`
  },
  {
    id: 6,
    variant: 'info',
    title: 'Descargo',
    description: `El compareciente realiza su descargo`,
    intraTitle: 'Descargo',
    actions: [
      actions.canAddInformes(areas.legales),
      actions.canAddArchivos(areas.legales, 'Descargo'),
      actions.canGoNextStep(areas.legales),
      actions.canGoPrevStep(areas.legales),
      actions.changeStatus(EstadoProcesoLegales.descargo)
    ],
    intraDescription: `En caso de haberse producido el descargo, se debe incorporar, de lo contrario sigue su curso el expediente.`
  },
  {
    id: 7,
    variant: 'info',
    title: 'Análisis de Pruebas',
    description: `Se realiza el análisis de pruebas`,
    intraTitle: 'Análisis de Pruebas',
    actions: [
      actions.sendTo(areas.legales),
      actions.canAddDictamen(areas.legales),
      actions.canAddArchivos(areas.legales),
      actions.canGoNextStep(areas.legales, ['hasDictamen']),
      actions.canGoPrevStep(areas.legales),
      actions.changeStatus(EstadoProcesoLegales.apertura_a_prueba)
    ],
    intraDescription: `Debes realizar el análisis de las pruebas y generar un dictamen.`
  },
  {
    id: 8,
    variant: 'info',
    title: 'Fallo 1ra. Instancia Tribunal de Ética',
    description: `Fallo de 1ra. Instancia`,
    intraTitle: 'Fallo 1ra. Instancia Tribunal de Ética',
    actions: [
      actions.sendTo(areas.tribunalEtica),
      actions.canGoNextStep(areas.tribunalEtica, ['hasFallo']),
      actions.canGoPrevStep(areas.tribunalEtica),
      actions.changeStatus(EstadoProcesoLegales.fallo_1ra_instancia),
      actions.canAddFallos(areas.tribunalEtica),
      actions.notifyExpediente('ingresoProceso', 'area'),
      actions.notifyExpediente('ingresoProceso', 'area')
    ],
    intraDescription: `Debes incorportar fallo de 1ra. Instancia.`
  },
  {
    id: 9,
    variant: 'info',
    title: 'Generar Cédula',
    description: `Se genera cédula de Notificación`,
    intraTitle:
      'Cédula de Notificación comunicando Fallo 1ra. Instancia Área Legales',
    actions: [
      actions.sendTo(areas.legales),
      actions.canAddInformes(areas.legales),
      actions.canGoNextStep(areas.legales),
      actions.canGoPrevStep(areas.legales),
      actions.denunciaPdf('fallo'),
      actions.generarCedula(areas.legales, 'nomail'),
      actions.notifyExpediente('ingresoProceso', 'area')
      // actions.cedulaNotificacionDenuncia('mail', 'ambos'), // crea la cedula electronica y notifica solo al imputado (contenido de la imputacion)
      // actions.denunciaPdf('cedula') // contenido de la cedula
    ],
    intraDescription: `Debes realizar una cédula de Notificación comunicando el Fallo.`
  },
  {
    id: 10,
    variant: 'info',
    title: 'Apelación',
    description: `Puedes apelar el Fallo de 1ra. Instancia, tienes 10 dias para hacerlo.`,
    actions: [
      actions.sendTo(areas.legales),
      actions.canAddInformes(areas.legales),
      actions.canAddArchivos(
        areas.legales,
        'Apelación Denunciante:Apelación Denunciado'
      ),
      actions.startExpiration(10),
      actions.approveOrReject('Apeló', 'No Apeló'),
      actions.canGoPrevStep(areas.legales)
    ],
    nextConditions: [
      nextConditions.allAreasApproved(),
      nextConditions.hasArchivo()
    ],
    onRejectActions: [onReject.changeStatus(EstadoProcesoLegales.finalizado)],
    intraTitle: 'Apelación',
    intraDescription: `En caso de que alguna de las partes involucradas realizo una apelación, debes incorporarla.`
  },
  {
    id: 11,
    variant: 'info',
    title: 'Su apelación se encuentra en revisión',
    description: ``,
    intraTitle: 'Cédula de Notificación',
    actions: [
      actions.sendTo(areas.tribunalEtica),
      actions.canAddInformes(areas.tribunalEtica),
      actions.canGoPrevStep(areas.tribunalEtica),
      actions.canGoNextStep(areas.tribunalEtica),
      actions.denunciaPdf('apelacion'),
      actions.generarCedula(areas.tribunalEtica, 'nomail')
    ],
    intraDescription: `El Tribunal de Ética debe revisar las apelaciónes y enviar las Cédulas de Notificación correspondientes.`
  },
  {
    id: 12,
    variant: 'info',
    title: 'Resolución del Honorable Consejo Directivo',
    description: `El Expediente se encuetra a la resolucíon del Honorable Consejo Directivo.`,
    actions: [
      actions.sendTo(areas.consejoDirectivo),
      actions.canAddResolucion(areas.consejoDirectivo),
      actions.canGoNextStep(areas.consejoDirectivo, ['hasResolucion']),
      actions.canGoPrevStep(areas.consejoDirectivo),
      actions.notifyExpediente('ingresoProceso', 'area'),
      actions.notifyExpediente('ingresoProceso', 'area')
    ],
    intraTitle: 'Resolución del Honorable Consejo Directivo',
    intraDescription: `Debes generar la correspondiente Resolución.`
  },
  {
    id: 13,
    variant: 'info',
    title: 'Notificación Cédula Electrónica',
    description: ``,
    actions: [
      actions.sendTo(areas.legales),
      actions.canGoNextStep(areas.legales),
      actions.canGoPrevStep(areas.legales),
      actions.denunciaPdf('resolucion'),
      actions.generarCedula(areas.legales, 'nomail'),
      actions.notifyExpediente('ingresoProceso', 'area')
      // actions.cedulaNotificacionDenuncia('mail', 'ambos'), // crea la cedula electronica y notifica solo al imputado (contenido de la imputacion)
      // actions.denunciaPdf('cedula') // contenido de la cedula
    ],
    intraTitle: 'Notificación envio Cédula Electrónica Área Legales',
    intraDescription: `Debes realizar la cédula de notificación comunicando lo resuleto por el Honorable Consejo Directivo ha ambas partes.`
  },
  {
    id: 14,
    variant: 'info',
    title: 'El proceso ha finalizado',
    description: `Se envio el expediente a archivo`,
    actions: [actions.changeStatus(EstadoProcesoLegales.finalizado)],
    intraTitle: 'Proceso finalizado',
    intraDescription: `El proceso ha finalizado`
  }
];

export default procesoLegalesPasos;
