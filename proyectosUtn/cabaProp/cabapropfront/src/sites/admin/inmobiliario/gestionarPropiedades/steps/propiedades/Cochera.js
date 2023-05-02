import { GarageSchema } from '../../validations/propertiesValidation';

export const CocheraForm = {
  schema: GarageSchema,
  initialValues: [
    {
      name: 'totalSurface',
      path: 'surface.totalSurface'
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
      totalSurface: 'totalSurface'
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
        type: 'switch',
        title: 'Cubierto',
        path: 'characteristics.covered',
        name: 'covered'
      },
      {
        type: 'switch',
        title: 'Con montacargas',
        path: 'characteristics.lift',
        name: 'lift'
      },
      {
        type: 'switch',
        title: 'Subsuelo',
        path: 'characteristics.underground',
        name: 'underground'
      },
      {
        type: 'switch',
        title: 'Dentro de un edificio',
        path: 'characteristics.building',
        name: 'building'
      }
    ],
    [
      {
        type: 'totalSurface'
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
