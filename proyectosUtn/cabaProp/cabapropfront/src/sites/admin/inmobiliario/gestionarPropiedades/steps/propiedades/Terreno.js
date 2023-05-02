import { TerrenoSchema } from '../../validations/propertiesValidation';

export const TerrenoForm = {
  schema: TerrenoSchema,
  initialValues: [
    {
      name: 'totalSurface',
      path: 'surface.totalSurface'
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
        type: 'totalSurface',
        noTotal: true
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
