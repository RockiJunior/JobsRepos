import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import loginSlice from "./redux/loginSlice";
import propertiesSlice from "./redux/propertiesSlice";
import favoritesSlice from "./redux/favoritesSlice";
import searchesSlice from "./redux/searchesSlice";
import messagesSlice from "./redux/messagesSlice";
import profileSlice from "./redux/profileSlice";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";

const store = configureStore({
  reducer: {
    login: loginSlice,
    properties: propertiesSlice,
    favorites: favoritesSlice,
    searches: searchesSlice,
    messages: messagesSlice,
    profile: profileSlice
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
    <GoogleOAuthProvider clientId="583581383426-kmu1pgioiaboaihjoepern19aritmj4u.apps.googleusercontent.com">
        <BrowserRouter>
          <App />
          <ToastContainer />
        </BrowserRouter>
      </GoogleOAuthProvider>
    </Provider>
  </React.StrictMode>
);
