import React, { useContext, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import is from 'is_js';
import bgImg from 'assets/img/cucicba/bg.jpg';

import MainLayout from './MainLayout';
import ErrorLayout from './ErrorLayout';

import AppContext from 'context/Context';

import Error404 from 'components/errors/Error404';
import Error500 from 'components/errors/Error500';

import { ToastContainer } from 'react-toastify';

import AuthSplitLayout from './AuthSplitLayout';
import Registration from 'components/authentication/split/Registration';
import Login from 'components/authentication/split/Login';
import { useDispatch, useSelector } from 'react-redux';
import { checkLogged, logout } from 'redux/actions/auth';
import Tramites from 'components/tramites/Tramites';
import ConfirmMail from 'components/authentication/split/ConfirmMail';
import Validate from 'components/authentication/Validate';
import DashboardTramite from 'components/tramites/DashboardTramite';
import InfoAltaMatriculacion from 'components/tramites/infoTramites/InfoAltaMatriculacion';
import Events from 'components/events/Events';
import InfoDdjjActividadComercial from 'components/tramites/infoTramites/InfoDdjjActividadComercial';
import NewProcedures from 'components/tramites/NewProcedures';
import Oblea from 'components/oblea/Oblea';
import QR from 'components/qr/QR';
import InfoSistemaFidelitas from 'components/tramites/infoTramites/InfoSistemaFidelitas';
import InfoDdjjNoActividadComercial from 'components/tramites/infoTramites/InfoDdjjNoActividadComercial';
import InfoDdjjBajaProfesional from 'components/tramites/infoTramites/InfoDdjjBajaProfesional';
import InfoCertificadoFirmaCotizacion from 'components/tramites/infoTramites/InfoCertificadoFirmaCotizacion';
import InfoCertificadoMatriculaVigente from 'components/tramites/infoTramites/InfoCertificadoMatriculaVigente';
import InfoSeguroCaucion from 'components/tramites/infoTramites/InfoSeguroCaucion';
import InfoSolicitudLicenciaPasividad from 'components/tramites/infoTramites/InfoSolicitudLicenciaPasividad';
import InfoAltaMatriculaCesantia from 'components/tramites/infoTramites/InfoAltaMatriculaCesantia';
import { eventosClear, eventosGetAll } from 'redux/actions/eventos';
import MisDatos from 'components/misDatos/MisDatos';
import Home from 'components/Home/Home';
import InfoDenuncia from 'components/tramites/infoTramites/InfoDenuncia';
import SistemaDenuncias from 'components/sistDenuncias/SistemaDenuncias';
import SimpleLayout from './SimpleLayout';
import Inicio from 'components/Inicio';
import TramiteExterno from 'components/tramites/tramiteExterno/TramiteExterno';
import ForgetPassword from 'components/authentication/split/ForgetPassword';
import PasswordReset from 'components/authentication/split/PasswordReset';
import TurnosFiscalizacion from 'components/appointments/fiscalizacion/TurnosFiscalizacion';
import MainTurnos from 'components/appointments/usuario/MainTurnos';

const Layout = () => {
  const HTMLClassList = document.getElementsByTagName('html')[0].classList;
  useContext(AppContext);

  const { user, loading: loadingUser } = useSelector(
    state => state.authReducer
  );
  const { eventos, loading: loadingEvents } = useSelector(
    state => state.eventoReducer
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (is.windows()) {
      HTMLClassList.add('windows');
    }
    if (is.chrome()) {
      HTMLClassList.add('chrome');
    }
    if (is.firefox()) {
      HTMLClassList.add('firefox');
    }
  }, [HTMLClassList]);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    if (userId && token) {
      dispatch(checkLogged(userId));
    } else {
      dispatch(logout());
    }
  }, []);

  useEffect(() => {
    if (user) {
      dispatch(eventosGetAll());
    } else {
      dispatch(eventosClear());
    }
  }, [user]);

  return (
    <>
      <Routes>
        {user ? (
          <Route element={<MainLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/tramites" element={<Tramites />} />
            <Route path="/tramites/:id" element={<DashboardTramite />} />

            <Route path="/eventos" element={<Events />} />

            <Route
              path="/solicitar-turno"
              element={
                <TurnosFiscalizacion
                  datosUsuario={user.datos}
                  usuarioId={user.id}
                />
              }
            />

            <Route path="/turnos" element={<MainTurnos />} />

            <Route path="/mis-datos" element={<MisDatos />} />

            <Route path="/tramites/nuevo" element={<NewProcedures />} />

            <Route
              path="/tramites/alta-de-matriculacion"
              element={<InfoAltaMatriculacion />}
            />

            <Route
              path="/tramites/declaracion-jurada-de-datos-comerciales"
              element={<InfoDdjjActividadComercial />}
            />

            <Route
              path="/tramites/declaracion-jurada-de-no-actividad-comercial"
              element={<InfoDdjjNoActividadComercial />}
            />

            <Route
              path="/tramites/solicitud-de-usuario-para-sistema-fidelitas"
              element={<InfoSistemaFidelitas />}
            />

            <Route
              path="/tramites/solicitud-de-baja-de-matricula-profesional"
              element={<InfoDdjjBajaProfesional />}
            />

            <Route
              path="/tramites/certificado-de-firma-de-cotizaciones-tasaciones"
              element={<InfoCertificadoFirmaCotizacion />}
            />

            <Route
              path="/tramites/certificado-de-matricula-vigente"
              element={<InfoCertificadoMatriculaVigente />}
            />

            <Route
              path="/tramites/presentacion-de-seguro-de-caucion-fianza-fiduciaria"
              element={<InfoSeguroCaucion />}
            />

            <Route
              path="/tramites/solicitud-de-licencia-por-pasividad"
              element={<InfoSolicitudLicenciaPasividad />}
            />

            <Route
              path="/tramites/alta-matriculacion-retira-la-cesantia"
              element={<InfoAltaMatriculaCesantia />}
            />

            <Route
              path="/tramites/sistema-de-denuncias"
              element={<InfoDenuncia />}
            />

            {user.datos?.actividadComercial && (
              <Route path="/oblea" element={<Oblea />} />
            )}
          </Route>
        ) : (
          !loadingUser &&
          !loadingEvents && (
            <>
              <Route element={<SimpleLayout />}>
                <Route
                  path="/tramites/sistema-de-denuncias"
                  element={<SistemaDenuncias />}
                />
                {process.env.REACT_APP_LOCAL ? (
                  <Route path="home" element={<Inicio />} />
                ) : (
                  <Route path="home" element={<InfoAltaMatriculacion />} />
                )}

                <Route
                  path="/tramites/alta-de-matriculacion"
                  element={<InfoAltaMatriculacion />}
                />

                <Route
                  path="/tramite-externo/:id"
                  element={<TramiteExterno />}
                />

                <Route path="/turnos" element={<TurnosFiscalizacion />} />
              </Route>
              {[
                '/home',
                '/tramites',
                '/tramites/:id',
                '/eventos',
                '/tramites/declaracion-jurada-de-datos-comerciales',
                '/tramites/nuevo',
                '/oblea'
              ].map(path => (
                <Route
                  key={path}
                  path={path}
                  element={<Navigate to="/login" replace />}
                />
              ))}
            </>
          )
        )}

        <Route
          element={
            <AuthSplitLayout bgProps={{ image: bgImg, position: '50% 20%' }} />
          }
        >
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Registration />} />
          <Route path="verificar-email/:email" element={<ConfirmMail />} />
          <Route path="validar-email/:email" element={<Validate />} />
          <Route path="recuperar-contrasenia" element={<ForgetPassword />} />
          <Route
            path="recuperar-contrasenia/:email"
            element={<PasswordReset />}
          />
        </Route>

        <Route element={<ErrorLayout />}>
          <Route path="errors/404" element={<Error404 />} />
          <Route path="errors/500" element={<Error500 />} />
        </Route>

        <Route path="/" element={<Navigate to="home" replace />} />

        <Route path="/qr" element={<QR />} />

        {!loadingUser && !loadingEvents && (
          <Route path="*" element={<Navigate to="errors/404" replace />} />
        )}
      </Routes>

      <ToastContainer position="bottom-left" />
    </>
  );
};

export default Layout;
