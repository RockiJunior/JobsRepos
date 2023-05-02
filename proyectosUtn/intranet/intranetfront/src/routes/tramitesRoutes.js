import AsignarTramites from 'components/area/AsignarTramites';
import NuevoTramite from 'components/tramites/nuevoTramite/NuevoTramite';
import Tramite from 'components/tramites/Tramite';
import Tramites from 'components/tramites/Tramites';
import areas from 'data/areas';
import permisosData from 'data/permisos';
import React from 'react';

export const tramitesRoutes = [
  {
    name: 'Trámite',
    icon: 'inbox',
    to: '/tramites/:id',
    active: false,
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
      areas.administracion,
      areas.mesaEntrada,
      areas.tribunalEtica
    ],
    element: <Tramite />,
    visible: false
  },
  {
    name: 'Asignar Trámites',
    icon: 'list-check',
    to: '/asignar_tramites',
    active: false,
    permissions: [permisosData.area.asignar_empleados],
    areas: [areas.matriculacion, areas.legales, areas.fiscalizacion],
    element: <AsignarTramites />,
    visible: true
  },
  {
    name: 'Nuevo Trámite',
    icon: 'plus',
    to: '/nuevo_tramite',
    active: false,
    areas: [
      areas.matriculacion,
      areas.mesaEntrada,
      areas.legales,
      areas.fiscalizacion
    ],
    permissions: [permisosData.tramites.crear_tramite],
    element: <NuevoTramite />,
    visible: true
  },
  {
    name: 'Trámites Asignados',
    icon: 'inbox',
    to: '/tramites',
    active: false,
    areas: [areas.matriculacion, areas.legales],
    element: <Tramites key="t1" />,
    visible: true
  },
  {
    name: 'Trámites en el Area',
    icon: 'layer-group',
    to: '/tramites_area',
    active: false,
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
      areas.mesaEntrada,
      areas.tribunalEtica
    ],
    element: <Tramites byArea key="t2" />,
    visible: true,
    permissions: [permisosData.tramites.ver_tramites_area]
  }
];
