import fs from 'fs';
import documentoServices from '../services/documento.services';
import Exception from '../utils/Exception';

declare const process: {
  env: {
    SERVER_URL: string;
  };
};

class DocumentoValidator {
  async delete(id: number, usuarioId: number) {
    if (!id) {
      throw new Exception('El id del empleado es requerido');
    }

    const documento = await documentoServices.findById(id);

    if (!documento) {
      throw new Exception('El documento no existe');
    }

    if (
      documento.transaccion &&
      documento.transaccion.usuarioId !== usuarioId
    ) {
      throw new Exception('No tiene permisos para eliminar este documento');
    }

    if (documento.informe && documento.informe.empleadoId !== usuarioId) {
      throw new Exception('No tiene permisos para eliminar este documento');
    }

    const deleted = await documentoServices.delete(id);

    try {
      fs.unlinkSync(
        '.' + deleted.archivoUbicacion.replace(process.env.SERVER_URL, '')
      );
    } catch (e) {
      console.log(e);
    }

    return deleted;
  }
}

export default new DocumentoValidator();
