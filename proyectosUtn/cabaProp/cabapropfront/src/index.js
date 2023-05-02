import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Main from './Main';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import 'helpers/initFA';
import colabsSlice from 'redux/colabsSlice';
import loginSlice from './redux/loginSlice';
import propsSlice from 'redux/propsSlice';
import realEstateSlice from 'redux/realEstateSlice';
import rolesSlice from 'redux/rolesSlice';
import permisosSlice from 'redux/permisosSlice';
import conversationsSlice from 'redux/conversationsSlice';
import clientsSlice from 'redux/clientsSlice';
import thunk from 'redux-thunk';
import './index.css'

const store = configureStore({
  reducer: {
    props: propsSlice,
    login: loginSlice,
    permisos: permisosSlice,
    roles: rolesSlice,
    colabs: colabsSlice,
    realEstate: realEstateSlice,
    conversations: conversationsSlice,
    clients: clientsSlice
  }
});

ReactDOM.render(
  <Provider store={store}>
    <Main>
      <App />
    </Main>
  </Provider>,
  document.getElementById('main')
);
