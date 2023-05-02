import * as Yup from "yup";

export const registerSchema = Yup.object().shape({
  firstName: Yup.string()
    .max(30, "Máximo 30 caracteres")
    .required("Este campo es obligatorio"),
  lastName: Yup.string()
    .max(30, "Máximo 30 caracteres")
    .required("Este campo es obligatorio"),
  email: Yup.string()
    .email("Email no válido")
    .required("Este campo es obligatorio"),
  phoneNumber: Yup.string()
    .min(7, "Número de teléfono no válido")
    .max(13, "Número de teléfono no válido")
    .required("Este campo es obligatorio"),
});

export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Email no válido")
    .required("Este campo es obligatorio"),
  password: Yup.string().required("Este campo es obligatorio"),
});

export const contactInfoSchema = Yup.object().shape({
  firstName: Yup.string()
    .max(30, "Máximo 30 caracteres")
    .required("Este campo es obligatorio"),
  lastName: Yup.string()
    .max(30, "Máximo 30 caracteres")
    .required("Este campo es obligatorio"),
  phoneNumber: Yup.string()
    .min(7, "Número de teléfono no válido")
    .max(13, "Número de teléfono no válido")
    .required("Este campo es obligatorio"),
});

export const updatePasswordSchema = Yup.object().shape({
  actualPassword: Yup.string().required("Este campo es obligatorio"),
  newPassword: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.!@#$%^&*])[a-zA-Z\d.!@#$%^&*]{6,}$/,
      "La contraseña debe contener al menos seis caracteres, 1 minúscula, 1 mayúscula, 1 número y 1 símbolo"
    )
    .required("Este campo es obligatorio"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Las contraseñas deben coincidir")
    .required("Este campo es obligatorio"),
});

export const emailSchema = Yup.object().shape({
  email: Yup.string()
    .email("Email no válido")
    .required("Este campo es obligatorio"),
});

export const filterSchema = Yup.object().shape({
  minSurface: Yup.number()
    .nullable()
    .typeError("Número no válido")
    .min(0, "Número no válido"),
  maxSurface: Yup.number()
    .nullable()
    .typeError("Número no válido")
    .when("minSurface", (minSurface, schema) =>
      schema.test(
        "is-greater-than-minSurface",
        "El valor máximo no puede ser menor que el mínimo.",
        (value) => {
          if (typeof minSurface === "number" && typeof value === "number") {
            return Math.trunc(value) >= Math.trunc(minSurface);
          }
          return true;
        }
      )
    ),
  minPrice: Yup.number()
    .nullable()
    .typeError("Número no válido")
    .min(0, "Número no válido"),
  maxPrice: Yup.number()
    .nullable()
    .typeError("Número no válido")
    .when("minPrice", (minPrice, schema) =>
      schema.test(
        "is-greater-than-minPrice",
        "El valor máximo no puede ser menor que el mínimo.",
        (value) => {
          if (typeof minPrice === "number" && typeof value === "number") {
            return Math.trunc(value) >= Math.trunc(minPrice);
          }
          return true;
        }
      )
    ),
});

export const createPassSchema = Yup.object().shape({
  password: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.!@#$%^&*])[a-zA-Z\d.!@#$%^&*]{6,}$/,
      "La contraseña debe contener al menos seis caracteres, 1 minúscula, 1 mayúscula, 1 número y 1 símbolo"
    )
    .required("Este campo es obligatorio"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Las contraseñas deben coincidir")
    .required("Este campo es obligatorio"),
});

export const estateSearchSchema = Yup.object().shape({
  field: Yup.string()
  .max(50, "Máximo 50 caracteres"),
});
