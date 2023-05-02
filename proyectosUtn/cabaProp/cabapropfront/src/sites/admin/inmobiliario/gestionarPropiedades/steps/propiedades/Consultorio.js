import { ApartmentSchema } from '../../validations/propertiesValidation';

export const ConsultorioForm = {
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
      name: 'currency',
      path: 'price.currency'
    },
    {
      name: 'total',
      path: 'price.total'
    },
    {
      name: 'expenses',
      path: 'price.expenses'
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
    antiquity: { type: 'type', years: 'years' },
    price: {
      total: 'total',
      expenses: 'expenses',
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
        name: 'bathrooms',
        title: 'Baños',
        path: 'characteristics.bathrooms'
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
