import { ApartmentSchema } from '../../validations/propertiesValidation';

export const BovedaNichoParcelaForm = {
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
      currency: 'currency'
    },
    description: 'description'
  },
  inputs: [
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
      }
    ],
    [
      {
        type: 'description'
      }
    ]
  ]
};
