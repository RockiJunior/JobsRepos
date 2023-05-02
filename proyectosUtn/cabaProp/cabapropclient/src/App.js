import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import {
  Callback,
  Favorites,
  Home,
  Messages,
  MiPerfil,
  PropertiesList,
  SavedSearches,
  SingleProperty,
  RealEstateList,
  ConfirmationPage,
  About,
  Error404,
  Error500,
} from "./pages";
import { checkSession } from "./redux/loginSlice";
import CounterModal from "./components/CounterModal";
import "react-responsive-modal/styles.css";
import "./custom.css";
import "./index.css";
import RecoverPassword from "./pages/RecoverPassword";

const App = () => {
  // * States
  const dispatch = useDispatch();
  const { currentUser: userLogged, loading } = useSelector(
    (state) => state.login
  );

  // * Methods
  const Redirect = (component) =>
    !userLogged && !loading ? <Navigate to="/?iniciar-sesion" /> : component;

  // * Life Cycle
  useEffect(() => {
    dispatch(checkSession());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Header />
      <CounterModal />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/propiedades/:id" element={<PropertiesList />} />
        <Route path="/propiedad/:id" element={<SingleProperty />} />
        <Route path="/favoritos" element={Redirect(<Favorites />)} />
        <Route
          path="/busquedas-guardadas"
          element={Redirect(<SavedSearches />)}
        />
        <Route path="/mensajes" element={Redirect(<Messages />)} />
        <Route path="/mi-perfil" element={Redirect(<MiPerfil />)} />
        <Route path="/nosotros" element={<About />} />
        <Route
          path="/confirmar-registro/:token"
          element={<ConfirmationPage />}
        />
        <Route path="/inmobiliarias" element={<RealEstateList />} />
        <Route
          path="/:realestate/propiedades/:id"
          element={<PropertiesList />}
        />
        <Route path="*" element={<Error404 />} />
        <Route path="/error-500" element={<Error500 />} />
        <Route
          path="/restablecer-contrasena/:token"
          element={<RecoverPassword />}
        />
      </Routes>
    </>
  );
};

export default App;
