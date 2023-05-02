import AsignarCedulas from 'components/area/AsignarCedulas';
import Cedula from 'components/cedulaNotificacion/Cedula';
import Cedulas from 'components/cedulaNotificacion/Cedulas';
import areas from 'data/areas';
import permisosData from 'data/permisos';
import React from 'react';

export const cedulaRoutes = [
  {
    name: 'Cédula',
    icon: 'file-alt',
    to: '/cedulas/:id',
    active: false,
    areas: [areas.inspeccion, areas.fiscalizacion, areas.administracion],
    element: <Cedula />,
    visible: false
  },
  {
    name: 'Asignar Cédulas',
    icon: 'list-check',
    to: '/asignar_cedulas',
    active: false,
    permissions: [permisosData.area.asignar_empleados],
    areas: [areas.inspeccion],
    element: <AsignarCedulas />,
    visible: true
  },
  {
    name: 'Cédulas Asignadas',
    icon: 'inbox',
    to: '/cedulas',
    active: false,
    areas: [areas.inspeccion],
    element: <Cedulas key="c1" />,
    visible: true
  },
  {
    name: 'Cédulas en el Area',
    icon: 'layer-group',
    to: '/cedulas_area',
    active: false,
    areas: [areas.fiscalizacion],
    element: <Cedulas byArea key="c2" />,
    visible: true,
    permissions: [permisosData.cedulas.ver_cedulas_area]
  }
];
