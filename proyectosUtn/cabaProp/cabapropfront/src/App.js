import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-toastify/dist/ReactToastify.min.css';
import Layout from './layouts/Layout';
import { useDispatch } from 'react-redux';
import { checkSession } from 'redux/loginSlice';
import { useSelector } from 'react-redux';
import { getRolById, getRolByIdPublic } from 'redux/rolesSlice';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { HavePermission } from 'utils/HavePermission';

const App = () => {
  const dispatch = useDispatch();
  const rolesUser = useSelector(state => state.roles.rolesById);
  const userLogged = useSelector(state => state.login.currentUser);
  const token = localStorage.getItem('token');

  if (
    userLogged &&
    JSON.stringify(rolesUser) === '{}' &&
    userLogged.typeOfUser !== 'admin' &&
    userLogged.roles &&
    userLogged.roles.length > 0
  ) {
    userLogged.roles?.map(rol => {
      dispatch(getRolByIdPublic(rol.id));
    });
  }

  useEffect(() => {
    dispatch(checkSession());
  }, []);

  return (
    <BrowserRouter basename={process.env.REACT_APP_LOCAL ? '/' : '/admin'}>
      <Layout />
      <ToastContainer />
    </BrowserRouter>
  );
};

export default App;
