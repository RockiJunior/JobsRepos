import { ApartmentSchema } from '../../validations/propertiesValidation';

export const HotelForm = {
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
        name: 'bedrooms',
        title: 'Dormitorios',
        path: 'characteristics.bedrooms'
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
        type: 'checkbox',
        name: 'privateBathroom',
        title: 'Baño privado',
        path: 'characteristics.privateBathroom'
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
      }
    ],
    [
      {
        type: 'description'
      }
    ]
  ]
};
