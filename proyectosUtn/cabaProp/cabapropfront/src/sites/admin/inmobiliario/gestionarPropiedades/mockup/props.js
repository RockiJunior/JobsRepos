export const informacion = {
  operation: {
    1: 'Venta',
    2: 'Alquiler',
    3: 'Temporario'
  },
  property: {
    9: 'Bodega/Galpón/Depósito',
    13: 'Bóveda/Nicho/Parcela',
    2: 'Casa',
    4: 'Cochera',
    5: 'Consultorio',
    1: 'Departamento',
    6: 'Fondo de comercio',
    12: 'Edificio',
    11: 'Hotel',
    7: 'Local comercial',
    8: 'Oficina comercial',
    3: 'PH',
    10: 'Terreno',
  },
  subproperty: {
    1: 'Bodega',
    2: 'Depósito',
    3: 'Galpón',
    4: 'Bóveda',
    5: 'Nicho',
    6: 'Parcela'
  },
  antiquity: {
    1: 'A estrenar',
    2: 'años de antigüedad',
    3: 'En construccion'
  },
  currency: {
    1: 'USD',
    2: 'ARS'
  }
};

export const propertyList = [
  {id: 1, label: 'Departamento'},
  { id: 2, label: 'Casa'},
  { id: 3, label: 'PH'},
  { id: 4, label: 'Cochera'},
  { id: 5, label: 'Consultorio'},
  { id: 6, label: 'Fondo de comercio'},
  { id: 7, label: 'Local comercial'},
  { id: 8, label: 'Oficina comercial'},
  { id: 9, label: 'Bodega/Galpón/Depósito'},
  { id: 10, label: 'Terreno'},
  { id: 11, label: 'Hotel'},
  { id: 12, label: 'Edificio'},
  { id: 13, label: 'Bóveda/Nicho/Parcela'}
];

export const subPropertyList = [
  {
    propertyId: 9,
    subproperties: [
      {
        id: 1,
        title: 'Bodega'
      },
      {
        id: 2,
        title: 'Depósito'
      },
      {
        id: 3,
        title: 'Galpón'
      }
    ]
  },
  {
    propertyId: 13,
    subproperties: [
      {
        id: 4,
        title: 'Bóveda'
      },
      {
        id: 5,
        title: 'Nicho'
      },
      {
        id: 6,
        title: 'Parcela'
      }
    ]
  }
];

export const propsColumns = [
  {
    accessor: 'address',
    Header: 'Dirección',
    headerProps: { title: 'Ordenar por dirección' },
    canSort: true
  },
  {
    accessor: 'price',
    Header: 'Precio',
    headerProps: { title: 'Ordenar por precio' },
    canSort: true
  },
  {
    accessor: 'operation',
    Header: 'Operación',
    headerProps: { title: 'Ordenar por operación' },
    canSort: true
  },
  {
    accessor: 'updated_at',
    Header: 'Última modificación',
    headerProps: { title: 'Ordenar por fecha de modificación' },
    canSort: true
  },
  {
    accessor: 'type',
    Header: 'Inmueble',
    headerProps: { title: 'Ordenar por tipo de inmueble' },
    canSort: true
  },
  {
    accessor: 'status',
    Header: 'Estado',
    headerProps: { title: 'Ordenar por estado' },
    canSort: true
  },
  {
    accessor: 'actions',
    Header: 'Acciones',
    headerProps: { style: { cursor: 'default' }, title: null},
    canSort: false
  }
];
