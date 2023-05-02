import Transactions from 'components/transactions/Transactions';
import areas from 'data/areas';
import permisosData from 'data/permisos';
import React from 'react';

export const transactionsRoutes = [
  {
    name: 'Transacciones Asignadas',
    icon: 'inbox',
    to: '/transacciones',
    active: false,
    element: <Transactions />,
    visible: true,
    permissions: [permisosData.transacciones.ver_transacciones],
    areas: [areas.finanzas, areas.administracion]
  },
  {
    name: 'Transacciones',
    icon: 'layer-group',
    to: '/transacciones_todas',
    active: false,
    element: <Transactions all />,
    visible: true,
    permissions: [permisosData.transacciones.ver_transacciones_todas],
    areas: [areas.finanzas, areas.administracion]
  }
];
