import AsignarExpedientes from 'components/area/AsignarExpedientes';
import Expediente from 'components/expedientes/Expediente';
import Expedientes from 'components/expedientes/Expedientes';
import Fiscalizacion from 'components/fiscalizaciones/Fiscalizacion';
import ProcesoLegal from 'components/procesoLegales/ProcesoLegal';
import areas from 'data/areas';
import permisosData from 'data/permisos';
import React from 'react';

export const expedientesRoutes = [
  {
    name: 'Expediente',
    icon: 'folder-open',
    to: '/expedientes/:id',
    active: false,
    areas: [
      areas.legales,
      areas.fiscalizacion,
      areas.consejoDirectivo,
      areas.tribunalEtica
    ],
    element: <Expediente />,
    visible: false
  },
  {
    name: 'Fiscalización',
    icon: 'folder-open',
    to: '/expedientes/:expedienteId/fiscalizaciones/:fiscalizacionId',
    active: false,
    areas: [areas.legales, areas.fiscalizacion, areas.consejoDirectivo],
    element: <Fiscalizacion />,
    visible: false
  },
  {
    name: 'Proceso Legal',
    icon: 'folder-open',
    to: '/expedientes/:expedienteId/procesos_legales/:procesoLegalId',
    active: false,
    areas: [
      areas.legales,
      areas.fiscalizacion,
      areas.consejoDirectivo,
      areas.tribunalEtica
    ],
    element: <ProcesoLegal />,
    visible: false
  },
  {
    name: 'Asignar Expedientes',
    icon: 'list-check',
    to: '/asignar_expedientes',
    active: false,
    permissions: [permisosData.area.asignar_empleados],
    areas: [areas.legales, areas.fiscalizacion],
    element: <AsignarExpedientes />,
    visible: true
  },
  {
    name: 'Nuevo Expediente',
    icon: 'plus',
    to: '/nuevo_expediente',
    active: false,
    areas: [areas.fiscalizacion, areas.legales],
    permissions: [permisosData.expedientes.crear_expediente],
    element: <div>En construcción</div>,
    visible: true
  },
  {
    name: 'Expedientes Asignados',
    icon: 'inbox',
    to: '/expedientes',
    active: false,
    areas: [areas.legales, areas.fiscalizacion],
    element: <Expedientes key="e1" />,
    visible: true
  },
  {
    name: 'Expedientes en el Area',
    icon: 'layer-group',
    to: '/expedientes_area',
    active: false,
    areas: [
      areas.consejoDirectivo,
      areas.legales,
      areas.fiscalizacion,
      areas.tribunalEtica
    ],
    permissions: [permisosData.expedientes.ver_expedientes_area],
    element: <Expedientes byArea key="e2" />,
    visible: true
  }
];
