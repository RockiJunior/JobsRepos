import historialServices from '../services/historial.services';
import Exception from './Exception';

export const registroHistorial = async ({
  titulo,
  descripcion,
  usuarioId,
  tramiteId,
  expedienteId,
  fiscalizacionId,
  procesoLegalId,
  info
}: {
  titulo: string;
  descripcion: string;
  usuarioId?: number;
  tramiteId?: number;
  expedienteId?: number;
  fiscalizacionId?: number;
  procesoLegalId?: number;
  info?: { [key: string]: any };
}) => {
  if (tramiteId && expedienteId) {
    throw new Exception(
      'El archivo no puede pertenecer a un tramite y a un expediente al mismo tiempo'
    );
  }
  if (!tramiteId && !expedienteId) {
    throw new Exception(
      'El archivo debe pertenecer a un tramite o a un expediente'
    );
  }

  await historialServices.create(
    titulo,
    descripcion,
    usuarioId,
    tramiteId,
    expedienteId,
    fiscalizacionId,
    procesoLegalId,
    info
  );
};
