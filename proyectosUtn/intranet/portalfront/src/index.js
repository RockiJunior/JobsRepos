import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Main from './Main';
import 'helpers/initFA';

ReactDOM.render(
  <Main>
    <App />
  </Main>,
  document.getElementById('main')
);
