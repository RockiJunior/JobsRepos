import { combineReducers } from 'redux';
import authReducer from './authReducer';
import tramiteReducer from './tramiteReducer';
import notificationReducer from './notificationReducer';
import turnosReducer from './turnosReducer';
import eventoReducer from './eventoReducer';

const rootReducer = combineReducers({
  authReducer,
  tramiteReducer,
  notificationReducer,
  turnosReducer,
  eventoReducer
});

export default rootReducer;
