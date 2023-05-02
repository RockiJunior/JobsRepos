import React, { useContext, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import is from 'is_js';
import bgImg from 'assets/img/cucicba/bg.jpg';

import ErrorLayout from './ErrorLayout';

import AppContext from 'context/Context';

import Error404 from 'components/varios/errors/Error404';
import Error500 from 'components/varios/errors/Error500';

import { ToastContainer } from 'react-toastify';

import AuthSplitLayout from './AuthSplitLayout';
import Login from 'components/authentication/split/Login';
import { useDispatch, useSelector } from 'react-redux';
import { checkLogged, logout } from 'redux/actions/auth';
import getRoutes from 'utils/getRoutes';
import { appRoutes } from 'routes/routes';
import MainLayout from './MainLayout';
import PasswordReset from 'components/authentication/split/PasswordReset';
import ForgetPassword from 'components/authentication/split/ForgetPassword';

const Layout = () => {
  const HTMLClassList = document.getElementsByTagName('html')[0].classList;
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

  const { user, loading } = useSelector(state => state.authReducer);

  const dispatch = useDispatch();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    if (userId && token) {
      dispatch(checkLogged(userId));
    } else {
      dispatch(logout());
      dispatch(checkLogged(null));
    }
  }, []);

  return (
    <>
      {user && !user.empleado && dispatch(logout())}

      {!loading && (
        <Routes>
          <Route element={<MainLayout />}>
            {getRoutes(user, appRoutes.children)}
          </Route>

          <Route
            element={
              <AuthSplitLayout
                bgProps={{ image: bgImg, position: '50% 20%' }}
              />
            }
          >
            <Route
              path="login"
              element={user ? <Navigate to="/" replace /> : <Login />}
            />
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

          <Route path="*" element={<Navigate to="errors/404" replace />} />
        </Routes>
      )}

      <ToastContainer position="bottom-left" />
    </>
  );
};

export default Layout;
