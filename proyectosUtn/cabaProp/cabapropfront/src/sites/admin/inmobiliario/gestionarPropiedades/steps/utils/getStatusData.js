const getPercent = ({ min, max, length, cotaMin, cotaMax }) => {
  const pendiente = (cotaMax - cotaMin) / (max - min);

  return length < min
    ? 0
    : length > max
    ? cotaMax
    : Math.ceil((pendiente * length + (cotaMin - pendiente * min)) * 100) / 100;
};

export const getStatusData = property => {
  if (property) {
    const colors = {
      1: 'danger',
      2: 'warning',
      3: 'success',
      4: 'primary',
      5: 'info'
    };

    //Informacion 0.45__________________________________________________________
    const sizeInfo = (0.45 * 10000) / 12;

    const step1RequiredData = [
      {
        name: 'Sucursal',
        size: sizeInfo,
        color: property.branch_office?.branch_office_name ? colors[1] : '300'
      },
      {
        name: 'Tipo de operación',
        size: sizeInfo,
        color: property.operation_type ? colors[1] : '300'
      },
      {
        name: 'Tipo de propiedad',
        size: sizeInfo,
        color: property.property_type ? colors[1] : '300'
      },
      (property.property_type === 9 || property.property_type === 13) && {
        name: 'Subtipo de propiedad',
        size: sizeInfo,
        color: property.sub_property_type ? colors[1] : '300'
      },
      {
        name: 'Título',
        size: sizeInfo,
        color: property.title ? colors[1] : '300'
      }
    ]
      .filter(status => status)
      .sort((a, b) => (a.color > b.color ? -1 : 1));

    const step2RequiredData = [
      {
        name: 'Calle',
        size: sizeInfo,
        color: property.location?.street ? colors[2] : '300'
      },
      {
        name: 'Número',
        size: sizeInfo,
        color: property.location?.number ? colors[2] : '300'
      },
      {
        name: 'Barrio',
        size: sizeInfo,
        color: property.location?.barrio ? colors[2] : '300'
      }
    ].sort((a, b) => (a.color > b.color ? -1 : 1));

    const step3RequiredData = [
      {
        name: 'Superficie total',
        size: sizeInfo,
        color: property.surface?.totalSurface ? colors[3] : '300'
      },
      {
        name: 'Superficie cubierta',
        size: sizeInfo,
        color: property.surface?.coveredSurface ? colors[3] : '300'
      },
      {
        name: 'Antigüedad',
        size: sizeInfo,
        color: property.antiquity?.type !== '0' ? colors[3] : '300'
      },
      property.antiquity?.type === '2' && {
        name: 'Años',
        size: sizeInfo,
        color: property.antiquity?.years ? colors[3] : '300'
      },
      {
        name: 'Precio',
        size: sizeInfo,
        color: property.price?.total ? colors[3] : '300'
      },
      {
        name: 'Descripción',
        size: sizeInfo,
        color: property.description ? colors[3] : '300'
      }
    ]
      .filter(status => status)
      .sort((a, b) => (a.color > b.color ? -1 : 1));

    //Media 0.45_________________________________________________________________
    //Planos 0.075
    //Video 0.075
    //Video 360 0.15
    //Imagenes 0.15 -> min 0.05 / max 0.15
    console.log('propertyImages', property.images);

    const percentImg = getPercent({
      min: 1,
      max: 4,
      length:
        property.images?.filter(img => img?.type === 'image')?.length || 0,
      cotaMin: 0.05,
      cotaMax: 0.15
    });

    const imgEmpty = 0.15 - percentImg;

    const step4RequiredData = [
      {
        name: 'Imágenes',
        size: percentImg * 10000,
        color: colors[4]
      },
      {
        name: 'Imágenes',
        size: imgEmpty * 10000,
        color: '300'
      },
      {
        name: 'Planos',
        size: 0.075 * 10000,
        color:
          property.images?.filter(img => img?.type === 'houseMap')?.length >= 1
            ? colors[4]
            : '300'
      },
      {
        name: 'Video',
        size: 0.075 * 10000,
        color: property.video ? colors[4] : '300'
      },
      {
        name: 'Video 360°',
        size: 0.15 * 10000,
        color: property.video360 ? colors[4] : '300'
      }
    ].sort((a, b) => (a.color > b.color ? -1 : 1));

    //Extras 0.1_________________________________________________________________
    const percentExtra = getPercent({
      min: 1,
      max: 12, //get por tipo de propiedad
      length: property.extras
        ? Object.keys(property.extras).filter(key => !!property.extras[key])
            .length
        : 0,
      cotaMin: 0,
      cotaMax: 0.1
    });
    const extraEmpty = 0.1 - percentExtra;

    const step5RequiredData = [
      {
        name: 'Extras',
        size: percentExtra * 10000,
        color: colors[5]
      },
      {
        name: 'Extras',
        size: extraEmpty * 10000,
        color: '300'
      }
    ];

    return {
      data: [
        step1RequiredData,
        step2RequiredData,
        step3RequiredData,
        step4RequiredData,
        step5RequiredData
      ],
      messages: [
        {
          title: 'Información',
          color: 'danger'
        },
        {
          title: 'Ubicación',
          color: 'warning'
        },
        {
          title: 'Características',
          color: 'success'
        },
        {
          title: 'Multimedia',
          color: 'primary'
        },
        {
          title: 'Extras',
          color: 'info'
        }
      ]
    };
  } else {
    return { data: [], messages: [] };
  }
};
