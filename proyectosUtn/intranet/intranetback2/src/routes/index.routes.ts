import { Router } from 'express';
import { ProbarMail } from '../utils/enviarEmail';
import AlertaRoutes from './alerta.routes';
import ArchivoRoutes from './archivo.routes';
import AreaRoutes from './area.routes';
import AuthRoutes from './auth.routes';
import CaratulaRoutes from './caratula.routes';
import CarpetaRoutes from './carpeta.routes';
import CedulaRoutes from './cedula.routes';
import ConstatacionRoutes from './constatacion.routes';
import DictamenRoutes from './dictamen.routes';
import DisponibilidadRouter from './disponibilidad.routes';
import DocumentoRoutes from './documento.routes';
import EmpleadoRoutes from './empleado.routes';
import EventoRoutes from './evento.routes';
import ExpedienteRoutes from './expediente.routes';
import FalloRoutes from './fallo.routes';
import FiscalizacionRoutes from './fiscalizacion.routes';
import HomeInfoRoutes from './homeInfo.routes';
import InformeRoutes from './informe.routes';
import InputValuesRoutes from './inputsValues.routes';
import InputValuesFiscalizacion from './inputsValuesFiscalizacion.routes';
import IntimacionRoutes from './intimacion.routes';
import NotaInternaRoutes from './notaInterna.routes';
import NoticacionRoutes from './notificacion.routes';
import PdfRoutes from './pdf.routes';
import ProcesoLegalesRoutes from './procesoLegales.routes';
import ResolucionRoutes from './resolucion.routes';
import RolPermisoRoutes from './rolPermiso.routes';
import TipoTramiteRoutes from './tipoTramite.routes';
import TramiteRoutes from './tramite.routes';
import TransaccionRoutes from './transaccion.routes';
import TurnosRouter from './turnos.routes';
import UsersRoutes from './users.routes';
import DespachoImputacionRoutes from './despachoImputacion.routes';
import CobroFiscalizacionRoutes from './cobroFiscalizacion.routes';
import InformeFiscalizacionRoutes from './informeFiscalizacion.routes';
import ConfigRoutes from './config.routes';
import DeclaracionJuradaFiscalizacionRoutes from './declaracionJuradaFiscalizacion.routes';

const router = Router();

router.use('/users', UsersRoutes);
router.use('/auth', AuthRoutes);
router.use('/carpeta', CarpetaRoutes);
router.use('/tramite', TramiteRoutes);
router.use('/transaccion', TransaccionRoutes);
router.use('/input_values', InputValuesRoutes);
router.use('/input_values_fiscalizacion', InputValuesFiscalizacion);
router.use('/empleado', EmpleadoRoutes);
router.use('/notificacion', NoticacionRoutes);
router.use('/dictamen', DictamenRoutes);
router.use('/turnos', TurnosRouter);
router.use('/disponibilidad', DisponibilidadRouter);
router.use('/informe', InformeRoutes);
router.use('/evento', EventoRoutes);
router.use('/nota_interna', NotaInternaRoutes);
router.use('/documento', DocumentoRoutes);
router.use('/pdf', PdfRoutes);
router.use('/tipo_tramite', TipoTramiteRoutes);
router.use('/intimacion', IntimacionRoutes);
router.use('/archivo', ArchivoRoutes);
router.use('/expediente', ExpedienteRoutes);
router.use('/fallo', FalloRoutes);
router.use('/cedula', CedulaRoutes);
router.use('/rol_permiso', RolPermisoRoutes);
router.use('/area', AreaRoutes);
router.use('/home_info', HomeInfoRoutes);
router.use('/caratula', CaratulaRoutes);
router.use('/resolucion', ResolucionRoutes);
router.use('/constatacion', ConstatacionRoutes);
router.use('/alerta', AlertaRoutes);
router.use('/fiscalizacion', FiscalizacionRoutes);
router.use('/proceso_legales', ProcesoLegalesRoutes);
router.use('/imputacion', DespachoImputacionRoutes);
router.use('/cobro_fiscalizacion', CobroFiscalizacionRoutes);
router.use('/informe_fiscalizacion', InformeFiscalizacionRoutes);
router.use('/config', ConfigRoutes);
router.use(
  '/declaracion_jurada_fiscalizacion',
  DeclaracionJuradaFiscalizacionRoutes
);

router.use('/probar-mail', async (req, res) => {
  try {
    await ProbarMail();
    res.send('ok');
  } catch (e) {
    console.log(e);
    res.send('nope');
  }
});

export default router;
