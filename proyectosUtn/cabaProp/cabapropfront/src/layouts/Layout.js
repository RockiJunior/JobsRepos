import React, { useContext, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import is from 'is_js';
import MainLayout from './MainLayout';
import AppContext from 'context/Context';
// import AuthSplitLayout from './AuthSplitLayout';
import ForgetPassword from 'components/authentication/split/ForgetPassword';
// import Footer from 'components/footer/Footer';
import MisEstadisticas from 'sites/admin/inmobiliario/misEstadisticas/MisEstadisticas';
import AceptarInvitacion from 'sites/admin/inmobiliario/aceptarInvitacion/AceptarInvitacion';
import ValidarToken from 'sites/admin/inmobiliario/aceptarInvitacion/ValidacionToken';
import LoginInmobiliario from 'components/authentication/split/LoginInmobiliario';
import RoutesPermisos from 'routes/routesPermisos';
import RoutesPropiedades from 'routes/routesPropiedades';
import RoutesErrors from 'routes/routesErrors';
import { CheckToken } from 'utils/CheckToken';
import GestionarPerfil from 'sites/admin/inmobiliario/miPerfil/GestionarPerfil';
import RestablecerContraseña from 'components/authentication/split/RestablecerContraseña';
import { useSelector } from 'react-redux';

const Layout = () => {
  const HTMLClassList = document.getElementsByTagName('html')[0].classList;
  const token = localStorage.getItem('token');
  const { currentUser: userLogged, loading } = useSelector(
    state => state.login
  );
  useContext(AppContext);

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

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/perfil" replace />} />

      <Route
        path="/ingresar"
        element={
          token !== null ? <Navigate to="/perfil" /> : <LoginInmobiliario />
        }
      />

      <Route
        path="/recuperar-contraseña"
        element={
          token !== null ? <Navigate to="/perfil" /> : <ForgetPassword />
        }
      />

      <Route path="/validar-token/:token" element={<ValidarToken />} />

      <Route path="/confirmar-registro/:id" element={<AceptarInvitacion />} />

      <Route
        path="/restablecer-contraseña/:token"
        element={<RestablecerContraseña />}
      />

      <Route
        element={CheckToken() ? <MainLayout /> : <Navigate to="/ingresar" />}
      >
        <Route path="/home" element={<div>home</div>} />

        <Route path="/estadisticas" element={<MisEstadisticas />} />

        {RoutesPermisos()}

        {RoutesPropiedades(userLogged, token)}

        <Route path="/perfil" element={<GestionarPerfil />} />

        {!loading && (
          <>
            {[
              '/perfil',
              '/home',
              '/estadisticas',
              '/permisos',
              '/permisos/roles',
              '/permisos/roles/crear',
              '/permisos/roles/editar/:id',
              '/permisos/usuarios',
              '/propiedades',
              '/propiedades/consultas',
              '/propiedades/cargar',
              '/propiedades/editar/:id'
            ].map(path => (
              <Route
                key={path}
                path={path}
                element={<Navigate to="/ingresar" />}
              />
            ))}

            {RoutesErrors()}

            <Route path="*" element={<Navigate to="/errors/404" replace />} />
          </>
        )}
      </Route>
    </Routes>
  );
};

export default Layout;
