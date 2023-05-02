export const prevConditions = {
  someInputsRequest: () => 'someInputsRequest',
  someTransactionRequest: () => `someTransactionRequest`,
  eventRejected: (tipo: 'Jura') => `eventRejected/${tipo}`,
  eventApproved: (tipo: 'Jura') => `eventApproved/${tipo}`
};
