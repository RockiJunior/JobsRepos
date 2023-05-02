export type transactionName =
  | 'matriculacion1'
  | 'matriculacion2'
  | 'matriculacion3'
  | 'libroRubricado'
  | 'certificadoCotizaciones'
  | 'infraccionAntesDeMatricularse1'
  | 'infraccionAntesDeMatricularse2';

export type notifyMailtype =
  | 'requestChange'
  | 'reprogramarTurno'
  | 'approvedData'
  | 'approvedTurno'
  | 'approvedProcedure'
  | 'approvedTransaction'
  | 'approveTramite'
  | 'rechazado'
  | 'archivado'
  | 'denunciaRechazada'
  | 'cedula'
  | 'cedulaElectronica'
  | 'reclamoAprobado'
  | 'procesoRechazado'
  | 'linkTramiteExterno'
  | 'imputaciones'
  | 'citacionRatificacion'
  | 'citacionDescargo'
  | 'verProcesoLegal'
  | 'formaPago';

export type notifyUserType = 'user' | 'admin' | 'area';
export type notifyNotificationType =
  | 'sistemaFidelita'
  | 'ApprovedProcedure'
  | 'EventInvitation'
  | 'TurnoUpdated'
  | 'TransactionAsigned'
  | 'AdminTransactionModify'
  | 'UserTransactionModify'
  | 'TransactionApproved'
  | 'assingMatricula'
  | 'registroMatricula'
  | 'ingresoProceso'
  | 'returnTramite';
