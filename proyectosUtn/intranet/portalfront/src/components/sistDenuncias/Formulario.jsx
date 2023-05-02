import Flex from 'components/common/Flex';
import ProcedureInputComponent from 'components/tramites/inputComponents/ProcedureInputComponent';
import {
  flatInputs,
  regex
} from 'components/tramites/inputComponents/ProcedureInputs';
import React, { useEffect, useState } from 'react';
import { Button, Form, Row } from 'react-bootstrap';
import comprimirImagen from 'utils/comprimirImagen';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { tramiteCrearExterno } from 'redux/actions/tramite';
import tramites from 'assets/json/tramites';
import ReCAPTCHA from 'react-google-recaptcha';

export const Formulario = ({ secciones }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [inputs, setInputs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [captcha, setCaptcha] = useState(false);

  const onChangeCaptcha = value => {
    setCaptcha(value);
  };

  useEffect(() => {
    if (secciones) {
      const newInputs = [];
      secciones.forEach(seccion => {
        newInputs.push(...seccion.inputs);
      });
      setInputs(newInputs);
    }
  }, [secciones]);

  const validate = async inputs => {
    let newErrors = {};

    for (const input of inputs) {
      if (input.validaciones && formData[input.nombre]?.value) {
        for (const validation in input.validaciones) {
          switch (validation) {
            case 'regex':
              if (input.validaciones[validation]) {
                if (input.multiple) {
                  const values = formData[input.nombre].value.split('/');
                  values.forEach((value, index) => {
                    if (!regex[input.validaciones[validation]].test(value)) {
                      if (!newErrors[input.nombre]) {
                        newErrors[input.nombre] = [];
                      }

                      newErrors[input.nombre][
                        index
                      ] = `${input.titulo} invalido`;
                    }
                  });
                } else {
                  if (
                    input.validaciones[validation] &&
                    !regex[input.validaciones[validation]].test(
                      formData[input.nombre].value
                    )
                  ) {
                    newErrors[input.nombre] = `${input.titulo} invalido`;
                  }
                }
              }
              break;

            case 'min':
              if (input.validaciones[validation]) {
                if (input.multiple) {
                  const values = formData[input.nombre].value.split('/');
                  values.forEach((value, index) => {
                    if (value.length < input.validaciones[validation]) {
                      if (!newErrors[input.nombre]) {
                        newErrors[input.nombre] = [];
                      }

                      if (input.validaciones.min === input.validaciones.max) {
                        newErrors[input.nombre][
                          index
                        ] = `${input.titulo} debe tener ${input.validaciones[validation]} caracteres`;
                      } else {
                        newErrors[input.nombre][
                          index
                        ] = `${input.titulo} debe tener al menos ${input.validaciones[validation]} caracteres`;
                      }
                    }
                  });
                } else {
                  if (
                    input.validaciones[validation] &&
                    formData[input.nombre].value.length <
                      input.validaciones[validation]
                  ) {
                    if (input.validaciones.min === input.validaciones.max) {
                      newErrors[
                        input.nombre
                      ] = `${input.titulo} debe tener ${input.validaciones[validation]} caracteres`;
                    } else {
                      newErrors[
                        input.nombre
                      ] = `${input.titulo} debe tener al menos ${input.validaciones[validation]} caracteres`;
                    }
                  }
                }
              }

              break;

            case 'max':
              if (input.validaciones[validation]) {
                if (input.multiple) {
                  const values = formData[input.nombre].value.split('/');
                  values.forEach((value, index) => {
                    if (value.length > input.validaciones[validation]) {
                      if (!newErrors[input.nombre]) {
                        newErrors[input.nombre] = [];
                      }

                      if (input.validaciones.min === input.validaciones.max) {
                        newErrors[input.nombre][
                          index
                        ] = `${input.titulo} debe tener ${input.validaciones[validation]} caracteres`;
                      } else {
                        newErrors[input.nombre][
                          index
                        ] = `${input.titulo} debe tener menos de ${input.validaciones[validation]} caracteres`;
                      }
                    }
                  });
                } else {
                  if (
                    input.validaciones[validation] &&
                    formData[input.nombre].value.length >
                      input.validaciones[validation]
                  ) {
                    if (input.validaciones.min === input.validaciones.max) {
                      newErrors[
                        input.nombre
                      ] = `${input.titulo} debe tener ${input.validaciones[validation]} caracteres`;
                    } else {
                      newErrors[
                        input.nombre
                      ] = `${input.titulo} debe tener menos de ${input.validaciones[validation]} caracteres`;
                    }
                  }
                }
              }
              break;

            case 'number':
              if (input.validaciones[validation]) {
                const value = formData[input.nombre].value;
                if (isNaN(value)) {
                  newErrors[
                    input.nombre
                  ] = `${input.titulo} debe ser un numero`;
                } else {
                  const number = Number(value);

                  if (
                    input.validaciones[validation].min &&
                    input.validaciones[validation].max &&
                    (number < input.validaciones[validation].min ||
                      number > input.validaciones[validation].max)
                  ) {
                    newErrors[
                      input.nombre
                    ] = `${input.titulo} debe estar entre ${input.validaciones[validation].min} y ${input.validaciones[validation].max}`;
                  } else if (
                    input.validaciones[validation].min &&
                    number < input.validaciones[validation].min
                  ) {
                    newErrors[
                      input.nombre
                    ] = `${input.titulo} debe ser mayor o igual a ${input.validaciones[validation].min}`;
                  } else if (
                    input.validaciones[validation].max &&
                    number > input.validaciones[validation].max
                  ) {
                    newErrors[
                      input.nombre
                    ] = `${input.titulo} debe ser menor o igual a ${input.validaciones[validation].max}`;
                  }
                }
              }

              break;

            default:
              break;
          }
        }
      }

      for (const req of input.requerido) {
        if (input.multiple && input.tipo !== 'file') {
          const values = formData[input.nombre].value.split('/');
          values.forEach((value, index) => {
            if (req === true && !value) {
              if (!newErrors[input.nombre]) {
                newErrors[input.nombre] = [];
              }

              newErrors[input.nombre][index] = 'Campo requerido';
            } else if (formData[req] && formData[req].value && !value) {
              if (!newErrors[input.nombre]) {
                newErrors[input.nombre] = [];
              }

              newErrors[input.nombre][index] = 'Campo requerido';
            }
          });
        } else {
          if (req === true && !formData[input.nombre]?.value) {
            newErrors[input.nombre] = 'Campo requerido';
          } else if (formData[req]?.value && !formData[input.nombre]?.value) {
            newErrors[input.nombre] = 'Campo requerido';
          }
        }
      }

      if (input.tipo === 'file') {
        const files = formData[input.nombre]?.files;

        if (files?.length) {
          const filesArray = [];
          for (const file of files) {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file, document);

            const result = await new Promise((resolve, reject) => {
              reader.onload = () => resolve(reader.result);
              reader.onerror = error => reject(error);
            });

            if (file.type !== 'application/pdf') {
              if (file.size > 2097152) {
                const archivo = await comprimirImagen(file);
                filesArray.push(archivo);
              } else {
                filesArray.push(file);
              }
            } else {
              filesArray.push(file);
              if (file.size > 2097152) {
                newErrors[input.nombre] =
                  'Un PDF supera el tamaño máximo permitido';
              } else {
                const files = new Blob([result], {
                  type: 'application/pdf'
                });
                const text = await files.text();

                if (
                  text.includes('Encrypt') ||
                  text
                    .substring(text.lastIndexOf('<<'), text.lastIndexOf('>>'))
                    .includes('/Encrypt')
                ) {
                  newErrors[input.nombre] = 'Un PDF está encriptado';
                }
              }
            }

            setFormData(a => ({
              ...a,
              [input.nombre]: { ...a[input.nombre], files: filesArray }
            }));
          }
        }
      }

      if (input.hijos) {
        newErrors = { ...newErrors, ...(await validate(input.hijos)) };
      }
    }

    return newErrors;
  };

  const handleChange = (e, inputNombre) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: {
        value: type === 'checkbox' ? e.target.checked : value,
        inputNombre
      }
    });

    setErrors(state => ({ ...state, [name]: undefined }));
  };

  const handleChangeFileMultiple = async (e, inputNombre) => {
    const files = e.target.files;
    const filesArray = Array.from(files);

    const previewArray = filesArray.map(file => {
      const extension = file.name.substring(file.name.lastIndexOf('.'));
      let preview = URL.createObjectURL(file);

      if (extension === '.pdf') {
        preview = preview + '.pdf';
      }

      return preview;
    });

    setFormData({
      ...formData,
      [e.target.name]: {
        value: previewArray,
        files: filesArray,
        inputNombre,
        type: 'file'
      }
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const errors = await validate(inputs);
    setErrors(errors);

    const newInputs = flatInputs(inputs, formData);

    if (Object.keys(errors).length === 0 && !loading && captcha) {
      setLoading(true);
      const data = newInputs
        .map(input => ({
          ...formData[input.nombre],
          estado: 'sent',
          inputName: input.nombre
        }))
        .filter(input => {
          return (
            input.value !== '' ||
            newInputs.find(i => i.nombre === input.inputName).InputValues?.value
          );
        });

      const dataNoFile = data
        .filter(input => input.type !== 'file' && input.value)
        .map(input => {
          // eslint-disable-next-line no-unused-vars
          const { inputName, value, ...rest } = input;
          return {
            ...rest,
            value: value === true ? 'true' : value === false ? 'false' : value
          };
        });

      const dataFile = data
        .filter(input => input.type === 'file')
        .map(input => ({
          files: input.files,
          inputNombre: input.inputNombre,
          inputName: input.inputName
        }));

      await dispatch(
        tramiteCrearExterno(tramites.denunciaExterna, dataNoFile, dataFile)
      );

      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <div>
        {secciones.map((seccion, index) => {
          return (
            <div key={index} className="mt-4">
              <h5>
                <strong>{seccion.titulo}</strong>
              </h5>

              <div>
                <Row className="d-flex align-items-start">
                  {seccion.inputs.map(campo => {
                    return (
                      <ProcedureInputComponent
                        key={campo.id}
                        formData={formData}
                        errors={errors}
                        input={campo}
                        handleChange={handleChange}
                        handleChangeFileMultiple={handleChangeFileMultiple}
                      />
                    );
                  })}
                </Row>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 d-flex justify-content-center">
        <ReCAPTCHA
          sitekey={process.env.REACT_APP_CAPTCHA_KEY}
          onChange={onChangeCaptcha}
        />
      </div>

      <Flex justifyContent="end" className="mt-3 mx-0">
        <Flex direction="column" justifyContent="center" alignItems="end">
          <Button type="submit" disabled={loading || !captcha}>
            Enviar
          </Button>
        </Flex>
      </Flex>
    </Form>
  );
};
Formulario.propTypes = {
  secciones: PropTypes.array
};
