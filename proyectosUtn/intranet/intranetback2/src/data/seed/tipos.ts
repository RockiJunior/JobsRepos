//IMPORTACION TRAMITES: <----------------- IMPORTANTE (Se deben importar en el mismo orden que se encuentran en el array)
import matriculacion from './tiposTramites/matriculacion';
import ddjjActividadComercial from './tiposTramites/ddjjActividadComercial';
import ddjjNoActividadComercial from './tiposTramites/ddjjNoActividadComercial';
import solicitudUserSistFidelitas from './tiposTramites/solicitudUserSistemaFidelitas';
import bajaProfesionalCartaDocumento from './tiposTramites/bajaMatriculaProfesionalCartaDoc';
import bajaProfesionalPorFallecimiento from './tiposTramites/bajaMatriculaProfesionalPorFallecimiento';
import ddjjBajaProfesionalYBaja from './tiposTramites/bajaMatriculaProfesionalYBaja';
import certificadoMatriculaVigente from './tiposTramites/certificadoMatriculaVigente';
import subsidioPorFallecimiento from './tiposTramites/subsidioPorFallecimiento';
import certificadoFirmaCotizaciones from './tiposTramites/certificadoFirmaCotizaciones';
import solicitudLicenciaPasividadUsuario from './tiposTramites/solicitudLicenciaPasividadUsuario';
import seguroCaucion from './tiposTramites/seguroCaucion';
import altaMatriculacionCesantia from './tiposTramites/matriculacionCesantia';
import solicitudLicenciaPasividadEmpleado from './tiposTramites/solicitudLicenciaPasividadEmpleado';
import presentacionesReclamos from './tiposTramites/presentacionesReclamos';
import denunciaMesaEntrada from './tiposTramites/denunciaMesaEntrada';
import denunciaMatriculaAOtroMatriculado from './tiposTramites/denunciaMatriculadoAOtroMatriculado';
import denunciaExterna from './tiposTramites/denunciaExterna';
import denunciaPorCucicba from './tiposTramites/denunciaPorCucicba';
import denunciaCucicbaFiscalizacion from './tiposTramites/denunciaCucicbaFiscalizacion';

export const tiposTramites = process.env.EXPEDIENTES
  ? [
      matriculacion, // <----------------- IMPORTANTE (Se deben importar en el mismo orden que se encuentran en el array)
      ddjjActividadComercial,
      ddjjNoActividadComercial,
      solicitudUserSistFidelitas,
      bajaProfesionalCartaDocumento,
      bajaProfesionalPorFallecimiento,
      ddjjBajaProfesionalYBaja,
      certificadoMatriculaVigente,
      subsidioPorFallecimiento,
      certificadoFirmaCotizaciones,
      solicitudLicenciaPasividadUsuario,
      seguroCaucion,
      altaMatriculacionCesantia,
      solicitudLicenciaPasividadEmpleado,

      presentacionesReclamos,
      denunciaMesaEntrada,
      denunciaMatriculaAOtroMatriculado,
      denunciaExterna,
      denunciaPorCucicba,
      denunciaCucicbaFiscalizacion
    ]
  : [
      matriculacion,
      ddjjActividadComercial,
      ddjjNoActividadComercial,
      solicitudUserSistFidelitas,
      bajaProfesionalCartaDocumento,
      bajaProfesionalPorFallecimiento,
      ddjjBajaProfesionalYBaja,
      certificadoMatriculaVigente,
      subsidioPorFallecimiento,
      certificadoFirmaCotizaciones,
      solicitudLicenciaPasividadUsuario,
      seguroCaucion,
      altaMatriculacionCesantia,
      solicitudLicenciaPasividadEmpleado
    ];
