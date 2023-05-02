import { transactionName } from './types';

export const nextConditions = {
  hasCedula: () => 'hasCedula',
  hasInforme: () => 'hasInforme',
  hasIntimacion: () => 'hasIntimacion',
  hasArchivo: () => 'hasArchivo',
  hasExpediente: () => `hasExpediente`,
  hasCaratula: () => `hasCaratula`,
  hasFallo: () => `hasFallo`,
  hasDictamen: () => `hasDictamen`,
  hasResolucion: () => `hasResolucion`,
  allAreasApproved: () => 'allAreasApproved',
  asignedEmployee: () => 'asignedEmployee',
  allInputsApproved: () => 'allInputsApproved',
  allInputsSent: () => 'allInputsSent',
  allRequiredFilled: () => 'allRequiredFilled',
  appointmentApproved: () => 'appointmentApproved',
  canGoNexStep: () => 'canGoNexStep',
  sentTransaction: (
    transacciones: { nombre: transactionName; condicion?: string }[]
  ) =>
    `sentTransaction/[${transacciones
      .map(
        ({ nombre, condicion }) =>
          `{"nombre":"${nombre}"${
            condicion ? `, "condicion": "${condicion}"` : ''
          }}`
      )
      .join(', ')}]`,
  transactionApproved: (
    transacciones: { nombre: transactionName; condicion?: string }[]
  ) =>
    `transactionApproved/[${transacciones
      .map(
        ({ nombre, condicion }) =>
          `{"nombre":"${nombre}"${
            condicion ? `, "condicion": "${condicion}"` : ''
          }}`
      )
      .join(', ')}]`,
  eventConfirm: (tipo: 'Jura') => `eventConfirm/${tipo}`,
  eventApproved: (tipo: 'Jura') => `eventApproved/${tipo}`
};
