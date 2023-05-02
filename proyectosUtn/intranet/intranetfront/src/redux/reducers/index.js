import { combineReducers } from 'redux';
import authReducer from './authReducer';
import tramiteReducer from './tramiteReducer';
import notificationReducer from './notificationReducer';
import areaReducer from './areaReducer';
import transaccionReducer from './transaccionReducer';
import disponibilidadReducer from './disponibilidadReducer';
import turnosReducer from './turnosReducer';
import eventoReducer from './eventoReducer';
import expedienteReducer from './expedienteReducer';
import cedulaReducer from './cedulaReducer';
import saReducer from './saReducer';
import tipoTramiteReducer from './tipoTramiteReducer';
import usersReducer from './usersReducer';

const rootReducer = combineReducers({
  authReducer,
  tramiteReducer,
  notificationReducer,
  areaReducer,
  transaccionReducer,
  disponibilidadReducer,
  turnosReducer,
  eventoReducer,
  expedienteReducer,
  cedulaReducer,
  saReducer,
  tipoTramiteReducer,
  usersReducer
});

export default rootReducer;
