import React, { useEffect, useState } from "react";
// import GoogleLogin from "react-google-login";
import { useDispatch } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Callback from "./pages/Callback";
import Favorites from "./pages/Favorites";
import Home from "./pages/Home";
import Messages from "./pages/Messages";
import MiPerfil from "./pages/MiPerfil";
import PropertiesList from "./pages/PropertiesList";
import SavedSearches from "./pages/SavedSearches";
import SingleProperty from "./pages/SingleProperty";
import { checkSession } from "./redux/loginSlice";

const App = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const [userLogged, setUserLogged] = useState()

  //Check session
  useEffect(() => {
    dispatch(checkSession(setUserLogged));
  }, []);

  return (
    <div>
      <Header userLogged={userLogged}/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/propiedades/:id" element={<PropertiesList />} />
        <Route path="/propiedad/:id" element={<SingleProperty />} />
        <Route
          path="/favoritos"
          element={token === null ? <Navigate to={"/"} /> : <Favorites />}
        />
        <Route
          path="/busquedas-guardadas"
          element={token === null ? <Navigate to={"/"} /> : <SavedSearches />}
        />
        <Route
          path="/mensajes"
          element={token === null ? <Navigate to={"/"} /> : <Messages />}
        />
        <Route
          path="/mi-perfil"
          element={token === null ? <Navigate to={"/"} /> : <MiPerfil userLogged={userLogged} setUserLogged={setUserLogged} />}
        />
        <Route path="*" element={<div>error</div>} />
        {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
      </Routes>
    </div>
  );
};

export default App;
