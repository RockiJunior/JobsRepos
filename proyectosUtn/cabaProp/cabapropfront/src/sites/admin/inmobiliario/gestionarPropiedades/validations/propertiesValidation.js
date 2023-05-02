import * as yup from 'yup';

export const PropertieSchema = yup.object().shape({
  operation_type: yup
    .number()
    .required('Este campo es obligatorio')
    .positive('Este campo es obligatorio')
    .typeError('Número inválido'),
  property_type: yup
    .number()
    .required('Este campo es obligatorio')
    .positive('Este campo es obligatorio')
    .typeError('Número inválido'),
  title: yup
    .string()
    .required('Este campo es obligatorio')
    .min(8, 'Mínimo 8 caracteres')
    .max(60, 'Máximo 60 caracteres')
});

export const LocationSchema = yup.object().shape({
  street: yup.string().required('Este campo es obligatorio'),
  number: yup
    .number()
    .required('Este campo es obligatorio')
    .positive('El número debe ser mayor a 0')
    .typeError('Número inválido'),
  barrio: yup
    .number()
    .required('Este campo es obligatorio')
    .positive('El número debe ser mayor a 0')
    .typeError('Número inválido')
});

export const ApartmentSchema = yup.object().shape({
  totalSurface: yup
    .number()
    .typeError('Número inválido')
    .required('Este campo es obligatorio')
    .positive('El número debe ser mayor a 0'),
  coveredSurface: yup
    .number()
    .typeError('Número inválido')
    .required('Este campo es obligatorio')
    .positive('El número debe ser mayor a 0')
    .max(
      yup.ref('totalSurface'),
      'La superficie cubierta no puede ser mayor a la total'
    ),
  type: yup
    .number()
    .required('Este campo es obligatorio')
    .positive('Este campo es obligatorio'),
  years: yup
    .number()
    .required('Este campo es obligatorio')
    .typeError('Número inválido')
    .positive('El número debe ser mayor a 0'),
  total: yup
    .number()
    .typeError('Número inválido')
    .required('Este campo es obligatorio')
    .positive('El número debe ser mayor a 0'),
  expenses: yup.number().typeError('Número inválido').min(0, 'Número inválido'),
  description: yup.string().required('Este campo es obligatorio')
});

export const GarageSchema = yup.object().shape({
  totalSurface: yup
    .number()
    .typeError('Número inválido')
    .required('Este campo es obligatorio')
    .positive('El número debe ser mayor a 0'),
  type: yup
    .number()
    .required('Este campo es obligatorio')
    .positive('Este campo es obligatorio'),
  years: yup
    .number()
    .required('Este campo es obligatorio')
    .typeError('Número inválido')
    .positive('El número debe ser mayor a 0'),
  total: yup
    .number()
    .typeError('Número inválido')
    .required('Este campo es obligatorio')
    .positive('El número debe ser mayor a 0'),
  expenses: yup.number().typeError('Número inválido').min(0, 'Número inválido'),
  description: yup.string().required('Este campo es obligatorio')
});

export const TerrenoSchema = yup.object().shape({
  totalSurface: yup
    .number()
    .typeError('Número inválido')
    .required('Este campo es obligatorio')
    .positive('El número debe ser mayor a 0'),
  total: yup
    .number()
    .typeError('Número inválido')
    .required('Este campo es obligatorio')
    .positive('El número debe ser mayor a 0'),
  description: yup.string().required('Este campo es obligatorio')
});

export const MultimediaSchema = yup.object().shape({
  video: yup.string().matches(
    //eslint-disable-next-line
    /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_])(&(amp;)?‌​[\w\?‌​=])?/,
    'La URL debe ser un video de Youtube'
  ),
  video360: yup.string().matches(
    //eslint-disable-next-line
    /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_])(&(amp;)?‌​[\w\?‌​=])?/,
    'La URL debe ser un video de Youtube'
  )
});
