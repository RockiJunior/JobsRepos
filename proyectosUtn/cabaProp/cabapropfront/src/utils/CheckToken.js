import React from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { tokenRefresh } from 'redux/loginSlice';

export const CheckToken = () => {
  const userLogged = useSelector(state => state.login.currentUser);
  const token = localStorage.getItem('token');
  const dispatch = useDispatch();

  const rightNow = Date.now() / 1000;
  const exp = userLogged?.exp;
  if (token && exp && exp < rightNow) {
    localStorage.removeItem('token');
    return false;
  } 
  if (token && exp && exp <= rightNow + 1800) {
    dispatch(tokenRefresh(token));
    return true;
  } 
  if (token && exp && exp > rightNow + 1800) {
    return true;
  }
  return !!token;
};
