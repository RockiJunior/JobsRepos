import React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { disponibilidadGetByArea } from 'redux/actions/disponibilidad';
import Availabilities from './Availabilities';

const MainAvailabilities = () => {
  const { disponibilidades } = useSelector(
    state => state.disponibilidadReducer
  );
  const { user } = useSelector(state => state.authReducer);

  const dispatch = useDispatch();

  useEffect(() => {
    user && dispatch(disponibilidadGetByArea(user.empleado.areaId));
  }, [user]);

  return user ? (
    <Availabilities
      areaAvailabilities={disponibilidades.map(disponibilidad => ({
        id: disponibilidad.id,
        title: disponibilidad.nombre,
        start: disponibilidad.inicio,
        end: disponibilidad.fin,

        sun: {
          open: disponibilidad.dom.abierto,
          interval: disponibilidad.dom.intervalos.map(i => ({
            from: i.inicio,
            to: i.fin
          }))
        },
        mon: {
          open: disponibilidad.lun.abierto,
          interval: disponibilidad.lun.intervalos.map(i => ({
            from: i.inicio,
            to: i.fin
          }))
        },
        tue: {
          open: disponibilidad.mar.abierto,
          interval: disponibilidad.mar.intervalos.map(i => ({
            from: i.inicio,
            to: i.fin
          }))
        },
        wed: {
          open: disponibilidad.mie.abierto,
          interval: disponibilidad.mie.intervalos.map(i => ({
            from: i.inicio,
            to: i.fin
          }))
        },
        thu: {
          open: disponibilidad.jue.abierto,
          interval: disponibilidad.jue.intervalos.map(i => ({
            from: i.inicio,
            to: i.fin
          }))
        },
        fri: {
          open: disponibilidad.vie.abierto,
          interval: disponibilidad.vie.intervalos.map(i => ({
            from: i.inicio,
            to: i.fin
          }))
        },
        sat: {
          open: disponibilidad.sab.abierto,
          interval: disponibilidad.sab.intervalos.map(i => ({
            from: i.inicio,
            to: i.fin
          }))
        }
      }))}
      areaId={user.empleado.areaId}
    />
  ) : null;
};

export default MainAvailabilities;
