import Appointments from 'components/appointments/Appointments';
import MainAvailabilities from 'components/availabilities/MainAvailabilities';
import Event from 'components/events/Event';
import Events from 'components/events/Events';
import Home from 'components/Home/Home';
import Panel from 'components/superadmin/Panel';
import TramitesSA from 'components/superadmin/TramitesSA';
import TurnosSA from 'components/superadmin/TurnosSA';
import Usuario from 'components/usuarios/Usuario';
import Usuarios from 'components/usuarios/Usuarios';
import areas from 'data/areas';
import permisosData from 'data/permisos';
import React from 'react';
import { cedulaRoutes } from './cedulaRoutes';
import { expedientesRoutes } from './expedientesRoutes';
import { tramitesRoutes } from './tramitesRoutes';
import { transactionsRoutes } from './transactionsRoutes';

export const appRoutes = {
  label: 'Módulos',
  labelDisable: true,
  children: [
    {
      name: 'Inicio',
      icon: 'home',
      to: '/home',
      active: true,
      element: <Home />,
      visible: true
    },
    {
      name: 'Trámites',
      icon: 'stamp',
      to: '/tramites',
      active: false,
      element: <TramitesSA />,
      visible: true,
      permissions: [permisosData.tramites.ver_tramites_todos]
    },
    {
      name: 'Trámites',
      icon: 'stamp',
      visible: true,
      active: true,
      children: tramitesRoutes,
      areas: [
        areas.matriculacion,
        areas.comisionMatriculacion,
        areas.fiscalizacion,
        areas.finanzas,
        areas.legales,
        areas.tesorero,
        areas.secretario,
        areas.presidente,
        areas.consejoDirectivo,
        areas.inspeccion,
        areas.comisionFiscalizacion,
        areas.mesaEntrada
      ]
    },
    {
      name: 'Expedientes',
      icon: 'box-archive',
      visible: process.env.REACT_APP_EXPEDIENTES ? true : false,
      active: true,
      children: process.env.REACT_APP_EXPEDIENTES
        ? expedientesRoutes
        : undefined,
      areas: [
        areas.legales,
        areas.fiscalizacion,
        areas.consejoDirectivo,
        areas.tribunalEtica
      ]
    },
    {
      name: 'Cédulas',
      icon: 'file-alt',
      visible: process.env.REACT_APP_CEDULAS ? true : false,
      active: true,
      children: process.env.REACT_APP_CEDULAS ? cedulaRoutes : undefined,
      areas: [areas.inspeccion, areas.fiscalizacion]
    },
    {
      name: 'Transacciones',
      icon: 'credit-card',
      visible: true,
      active: true,
      children: transactionsRoutes,
      areas: [areas.finanzas, areas.administracion]
    },
    {
      name: 'Horarios',
      icon: 'clock',
      to: '/horarios-de-atencion',
      active: false,
      permissions: [permisosData.area.ver_disponibilidad],
      element: <MainAvailabilities />,
      visible: true
    },
    {
      name: 'Turnos del area',
      icon: 'calendar-days',
      to: '/turnos',
      active: false,
      permissions: [permisosData.turnos.ver_turnos_reservados_area],
      element: <Appointments />,
      visible: true
    },
    {
      name: 'Turnos',
      icon: 'calendar-days',
      to: '/turnos',
      active: false,
      permissions: [permisosData.turnos.ver_turnos_todos],
      element: <TurnosSA />,
      visible: true
    },
    {
      name: 'Eventos',
      icon: 'calendar-check',
      to: '/eventos',
      active: false,
      permissions: [
        [
          permisosData.eventos.ver_eventos,
          permisosData.eventos.ver_lista_espera
        ]
      ],
      element: <Events />,
      visible: true
    },
    {
      name: 'Evento',
      icon: 'calendar-check',
      to: '/eventos/:id',
      active: false,
      permissions: [permisosData.eventos.ver_eventos],
      element: <Event />,
      visible: false
    },
    {
      name: 'Panel',
      icon: 'cog',
      to: '/panel',
      active: false,
      element: <Panel />,
      visible: true,
      permissions: [
        [permisosData.empleados.ver_empleados, permisosData.roles.ver_roles]
      ]
    },
    {
      name: 'Usuarios',
      icon: 'users',
      to: '/usuarios',
      active: false,
      element: <Usuarios />,
      visible: true,
      permissions: [permisosData.usuarios.ver_usuarios]
    },
    {
      name: 'Usuario',
      icon: 'user',
      to: '/usuarios/:id',
      active: false,
      element: <Usuario />,
      visible: false,
      permissions: [permisosData.usuarios.ver_usuarios]
    }
  ]
};

export default [appRoutes];
