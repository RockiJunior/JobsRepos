import * as yup from 'yup';

export const profileSchema = yup.object().shape({
  email: yup.string()
    .email('El email ingresado no es válido')
    .required('Este campo es obligatorio'),
  phoneNumber: yup.string()
    .min(7, 'Número inválido: debe tener de 7 a 13 dígitos.')
    .max(13, 'Número inválido: debe tener de 7 a 13 dígitos.')
});

export const createUserSchema = yup.object().shape({
  firstName: yup.string()
    .min(2, 'Los nombres deben tener al menos 2 letras.')
    .required('El nombre es obligatorio.'),
  lastName: yup.string()
    .min(2, 'Los apellidos deben tener al menos 2 letras.')
    .required('El apellido es obligatorio.'),
  email: yup.string()
    .email('El email ingresado no es válido.')
    .required('El email es obligatorio.'),
  dni: yup.string()
    .min(7, 'Los dni deben tener 7 u 8 caracteres.')
    .max(8, 'Los dni deben tener 7 u 8 caracteres.')
    .required('El dni es obligatorio.'),
  phoneNumber: yup.string()
    .min(7, 'Número inválido: debe tener de 7 a 13 dígitos.')
    .max(13, 'Número inválido: debe tener de 7 a 13 dígitos.')
});

export const updatePasswordSchema = yup.object().shape({
  actualPassword: yup.string().required("Este campo es obligatorio"),
  newPassword: yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.,@$!%*¿¡?&])[A-Za-z\d.,@$!%*¿¡?&]{8,20}$/,
      "Debe contener al menos ocho caracteres con 1 minúscula, 1 mayúscula, 1 número y 1 símbolo"
    )
    .required("Este campo es obligatorio"),
  confirmPassword: yup.string()
    .oneOf([yup.ref("newPassword"), null], "Las contraseñas deben coincidir")
    .required("Este campo es obligatorio"),
});