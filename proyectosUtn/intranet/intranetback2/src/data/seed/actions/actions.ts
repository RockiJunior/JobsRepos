import {
  notifyMailtype,
  notifyNotificationType,
  notifyUserType,
  transactionName
} from './types';

type canGoNextStepCondicion =
  | 'hasArchivo'
  | 'hasCedula'
  | 'hasInforme'
  | 'hasDictamen'
  | 'hasResolucion'
  | 'hasExpediente'
  | 'cedulaElectronica'
  | 'hasImputacion'
  | 'allRequiredFilled'
  | 'hasFallo';

export const actions = {
  canGoNextStep: (area: number, condiciones?: canGoNextStepCondicion[]) =>
    `canGoNextStep/${area}${
      condiciones && condiciones.length ? `_${condiciones.join(':')}` : ''
    }`,
  canGoPrevStep: (area: number) => `canGoPrevStep/${area}`,
  canAddDataEmployee: (area: number) => `canAddDataEmployee/${area}`,
  canAddDataUser: () => `canAddDataUser`,
  canAddInformes: (area: number) => `canAddInformes/${area}`,
  canAddIntimacion: (area: number) => `canAddIntimacion/${area}`,
  canAddArchivos: (area: number, tipo?: string) =>
    `canAddArchivos/${area}${tipo ? `_${tipo}` : ''}`,
  canAddDictamen: (area: number) => `canAddDictamen/${area}`,
  canAddFallos: (area: number) => `canAddFallos/${area}`,
  canAddImputaciones: (area: number) => `canAddImputaciones/${area}`,
  canAddResolucion: (area: number) => `canAddResolucion/${area}`,
  canCancel: () => 'canCancel',
  cantAddDataUser: () => 'cantAddDataUser',
  generarCedula: (area: number, mail: 'mail' | 'nomail') =>
    `generarCedula/${area}_${mail}`,
  cedulaNotificacionDenuncia: (
    mail: 'mail' | 'nomail',
    destinatario: 'solo' | 'ambos',
    tipo: notifyMailtype
  ) => `cedulaNotificacionDenuncia/${mail}_${destinatario}_${tipo}`,
  crearCaratula: () => 'crearCaratula',
  manualAssingEmployee: () => 'manualAssingEmployee',
  notify: (
    tipoUsuario: notifyUserType,
    tipoNotificacion: notifyNotificationType
  ) => `notify/${tipoUsuario}_${tipoNotificacion}`,
  notifyExpediente: (
    tipoNotificacion: notifyNotificationType,
    tipoUsuario: notifyUserType
  ) => `notifyExpediente/${tipoNotificacion}_${tipoUsuario}`,
  notifyMail: (tipo: notifyMailtype) => `notifyMail/${tipo}`,
  startPlazo: (plazo: number, area: number) => `startPlazo/${plazo}_${area}`,
  approveTramite: () => 'approveTramite',
  sendTo: (area: number) => `sendTo/${area}`,
  approveOrReject: (tituloAceptar: string, tituloRechazar: string) =>
    `approveOrReject/${tituloAceptar}:${tituloRechazar}`,
  createTransaction: (
    transacciones: { nombre: transactionName; condicion?: string }[]
  ) =>
    `createTransaction/[${transacciones
      .map(
        ({ nombre, condicion }) =>
          `{"nombre":"${nombre}"${
            condicion ? `, "condicion": "${condicion}"` : ''
          }}`
      )
      .join(', ')}]`,
  sentTransaction: (tipo: string) => `sentTransaction/${tipo}`,
  appointment: (area: number) => `appointment/${area}`,
  event: (tipo: 'Jura') => `event/${tipo}`,
  finishExpiration: () => 'finishExpiration',
  tipoSeccion: (tipo: string) => `tipoSeccion/${tipo}`,

  assingMatricula: () => 'assingMatricula',
  inactivateMatricula: () => 'inactivateMatricula',
  activateMatriculaSinActividad: () => 'activateMatriculaSinActividad',
  activateMatriculaConActividad: () => 'activateMatriculaConActividad',
  activateMatriculaCesantia: () => 'activateMatriculaCesantia',
  pasivaMatricula: () => 'pasivaMatricula',
  vencimientoMatricula: () => `vencimientoMatricula`,

  changeStatus: (status: any) => `changeStatus/${status}`,
  setActividadComercial: (actividad: boolean) =>
    `setActividadComercial/${actividad ? 'true' : 'false'}`,
  deleteComercialData: () => 'deleteComercialData',
  denunciaPdf: (tipo: string) => `denunciaPdf/${tipo}`,
  intraAppointment: (area: number) => `intraAppointment/${area}`,
  firmaPdf: () => `firmaPdf`,
  canOnlyApprove: (area: number, titulo: string) =>
    `canOnlyApprove/${area}_${titulo}`,
  canRequestChanges: (area: number) => `canRequestChanges/${area}`,
  startExpiration: (dias: number | 'tipo') => `startExpiration/${dias}`,
  createPdf: () => `createPdf`,
  defaultTab: (tab: 'acciones') => `defaultTab/${tab}`,
  generateTab: (tab: 'Apelación') => `generateTab/${tab}`,
  approveOblea: () => `approveOblea`,
  startExpediente: () => `startExpediente`,
  startExpedienteManual: (area: number, areaInicial: number) =>
    `startExpedienteManual/${area}_${areaInicial}`,
  canApproveTramite: (paso: number) => `canApproveTramite/${paso}`,
  hideInputs: (tipo: 'employee' | 'user') => `hideInputs/${tipo}`,
  approveAllInputs: () => `approveAllInputs`
};
