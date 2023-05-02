import { ApartmentSchema } from '../../validations/propertiesValidation';

export const PHForm = {
  schema: ApartmentSchema,
  initialValues: [
    {
      name: 'totalSurface',
      path: 'surface.totalSurface'
    },
    {
      name: 'coveredSurface',
      path: 'surface.coveredSurface'
    },
    {
      name: 'type',
      path: 'antiquity.type'
    },
    {
      name: 'years',
      path: 'antiquity.years'
    },
    {
      name: 'total',
      path: 'price.total'
    },
    {
      name: 'currency',
      path: 'price.currency'
    },
    {
      name: 'description',
      path: 'description'
    }
  ],
  submit: {
    surface: {
      totalSurface: 'totalSurface',
      coveredSurface: 'coveredSurface'
    },
    antiquity: {
      type: 'type',
      years: 'years'
    },
    price: {
      total: 'total',
      currency: 'currency'
    },
    description: 'description'
  },
  inputs: [
    [
      {
        type: 'minusPlus',
        name: 'ambience',
        title: 'Ambientes',
        path: 'characteristics.ambience'
      },
      {
        type: 'minusPlus',
        name: 'bedrooms',
        title: 'Dormitorios',
        path: 'characteristics.bedrooms'
      },
      {
        type: 'minusPlus',
        name: 'bathrooms',
        title: 'Baños',
        path: 'characteristics.bathrooms'
      },
      {
        type: 'minusPlus',
        name: 'toilettes',
        title: 'Toilettes',
        path: 'characteristics.toilettes'
      },
      {
        type: 'minusPlus',
        name: 'garages',
        title: 'Cocheras',
        path: 'characteristics.garages'
      }
    ],
    [
      {
        type: 'totalSurface'
      },
      {
        type: 'coveredSurface'
      }
    ],
    [
      {
        type: 'antiquity'
      }
    ],
    [
      {
        type: 'price'
      },
      {
        type: 'expenses'
      }
    ],
    [
      {
        type: 'description'
      }
    ]
  ]
};
