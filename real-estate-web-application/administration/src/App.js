import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-toastify/dist/ReactToastify.min.css';
import Layout from './layouts/Layout';
import { useDispatch } from 'react-redux';
import { checkSession } from 'redux/loginSlice';
import { useSelector } from 'react-redux';
import { getRolById } from 'redux/rolesSlice';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  const dispatch = useDispatch()
  const rolesUser = useSelector(state => state.roles.rolesById)
  const userLogged = useSelector((state) => state.login.currentUser)
  const token = localStorage.getItem("token")

  console.log(userLogged)
  if (JSON.stringify(rolesUser) === '{}' && userLogged?.typeOfUser !== "admin") {
    userLogged?.roles.map((rol) => {
      dispatch(getRolById(rol.id, token))
    })
  }

  //Check session
  useEffect(() => {
    dispatch(checkSession())
  }, [])


  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Layout />
      <ToastContainer />
    </BrowserRouter>
  );
};

export default App;
