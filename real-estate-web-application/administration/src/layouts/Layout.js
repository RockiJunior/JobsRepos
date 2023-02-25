import React, { useContext, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import is from 'is_js';
import MainLayout from './MainLayout';
import AppContext from 'context/Context';
// import AuthSplitLayout from './AuthSplitLayout';
import ForgetPassword from 'components/authentication/split/ForgetPassword';
// import Footer from 'components/footer/Footer';
import MisEstadisticas from 'sites/admin/inmobiliario/misEstadisticas/MisEstadisticas';
import MiPerfil from 'sites/admin/inmobiliario/miPerfil/MiPerfil';
import AceptarInvitacion from 'sites/admin/inmobiliario/aceptarInvitacion/AceptarInvitacion';
import ValidarToken from 'sites/admin/inmobiliario/aceptarInvitacion/ValidacionToken';
import LoginInmobiliario from 'components/authentication/split/LoginInmobiliario';
import RoutesPermisos from 'routes/routesPermisos';
import RoutesPropiedades from 'routes/routesPropiedades';
import RoutesErrors from 'routes/routesErrors';
import { CheckToken } from 'utils/CheckToken';
import { checkSession } from 'redux/loginSlice';

const Layout = () => {
  const HTMLClassList = document.getElementsByTagName('html')[0].classList;
  const token = localStorage.getItem("token")
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

      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/ingresar" element={token !== null ? <Navigate to={'/home'} /> : <LoginInmobiliario />} />
      <Route path="/recuperar-contraseña" element={token !== null ? <Navigate to={'/home'} /> : <ForgetPassword />} />
      <Route path="/validar-token/:token" element={<ValidarToken />} />
      <Route path="/confirmar-registro/:id" element={<AceptarInvitacion />} />

      {RoutesErrors()}
      <Route path="*" element={<Navigate to="/errors/404" replace />} />
        <Route element={token === null && !CheckToken() ? <Navigate to={'/ingresar'} /> : <MainLayout />}>

          <Route
            path="/home"
            element={<div>home</div>}
          />

          <Route
            path="/estadisticas"
            element={token === null ? <Navigate to={'/ingresar'} /> : <MisEstadisticas />}
          />

          {RoutesPermisos()}

          {RoutesPropiedades()}


          <Route
            path="/perfil" element={token === null ? <Navigate to={'/ingresar'} /> : <MiPerfil />}
          />
        </Route>

    </Routes>
  );
};

export default Layout;
