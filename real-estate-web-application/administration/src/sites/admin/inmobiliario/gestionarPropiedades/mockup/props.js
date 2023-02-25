export const informacion = {
  operation:{
    1: 'Venta',
    2: 'Alquiler',
    3: 'Temporario'
  },
  property: {
    1: 'Departamento',
    2: 'Casa',
    3: 'PH',
    4: 'Cochera',
    5: 'Consultorio',
    6: 'Fondo de comercio',
    7: 'Local', 
    8: 'Bodega',
    9: 'Terreno'
  },/* 
  property: {
    1: 'Departamento',
    2: 'Casa',
    3: 'PH',
    4: 'Cochera',
    5: 'Consultorio',
    6: 'Fondo de comercio',
    7: 'Local comercial', 
    8: 'Oficina comercial',
    9: 'Bodega/Galpón/Depósito',
    10: 'Terreno',
    11: 'Hotel',
    12: 'Edificio',
    13: 'Bóveda/Nicho/Parcela'
  }, */
  antiquity: {
    1: 'A estrenar',
    2: 'años de antigüedad',
    3: 'En construccion'
  },
  currency: {
    1: 'USD',
    2: 'ARS'
  }
}


export const propsColumns = [
    {
      accessor: 'address',
      Header: 'Dirección',
      headerProps: {title: 'Ordenar por dirección'}
    },
    {
      accessor: 'price',
      Header: 'Precio',
      headerProps: {title: 'Ordenar por precio'}
    },
    {
      accessor: 'operation',
      Header: 'Operacion',
      headerProps: {title: 'Ordenar por operación'}
    },
    {
      accessor: 'updated_at',
      Header: 'Última modificación',
      headerProps: {title: 'Ordenar por fecha de modificación'}
    },
    {
      accessor: 'type',
      Header: 'Inmueble',
      headerProps: {title: 'Ordenar por tipo de inmueble'}
    },
    {
      accessor: 'status',
      Header: 'Estado',
      headerProps: {title: 'Ordenar por estado'}
    },
    {
      accessor: 'actions',
      Header: 'Acciones',
      headerProps: {style: {cursor: 'default'}, title: null, onClick: null}
    }
  ];