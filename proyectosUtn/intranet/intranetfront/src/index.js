import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Main from './Main';
import 'helpers/initFA';
import axios from 'axios';

axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  config.headers['usuarioid'] = userId;
  config.headers['authorization'] = token;
  return config;
});

ReactDOM.render(
  <Main>
    <App />
  </Main>,
  document.getElementById('main')
);
