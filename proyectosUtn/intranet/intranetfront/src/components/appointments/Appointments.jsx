import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { turnosGetAllByAreaID } from 'redux/actions/turnos';
import { TableTurnos } from './TableTurnos';

const Appointments = () => {
  const dispatch = useDispatch();
  const { turnosArea } = useSelector(state => state.turnosReducer);
  const { user } = useSelector(state => state.authReducer);

  const [turnos, setTurnos] = useState([]);

  useEffect(() => {
    user && dispatch(turnosGetAllByAreaID(user.empleado.areaId));
  }, []);

  useEffect(() => {
    setTurnos(turnosArea);
  }, [turnosArea]);

  return <TableTurnos turnos={turnos} areaId={user.empleado.areaId} />;
};

export default Appointments;
