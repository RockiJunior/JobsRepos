import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Row, Form, Spinner } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import Flex from 'components/common/Flex';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import comprimirImagen from 'utils/comprimirImagen';
import { fiscalizacionUpsertInputsValues } from 'redux/actions/fiscalizacion';
import FiscalizacionInputComponent from './FiscalizacionInputComponent';
import dayjs from 'dayjs';

const regex = {
  email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
  onlyLetters: /^[a-zA-Z]+$/,
  onlyNumbers: /^[0-9]+$/
};

const getValues = inputs => {
  return inputs.reduce((acc, input) => {
    let obj = {};

    obj[input.nombre] = {
      value:
        input.tipo !== 'file'
          ? input.inputValueFiscalizacion?.value === 'true'
            ? true
            : input.inputValueFiscalizacion?.value === 'false'
            ? false
            : input.inputValueFiscalizacion?.value
          : input.inputValueFiscalizacion?.archivos?.map(
              archivo => archivo.archivoUbicacion
            ) || '',
      inputNombre: input.nombre,
      estado: input.inputValueFiscalizacion?.estado
    };

    if (input.hijos) {
      obj = { ...obj, ...getValues(input.hijos) };
    }

    return { ...acc, ...obj };
  }, {});
};

const flatInputs = (inputs, formData) => {
  const newInputs = [];

  for (const input of inputs) {
    if (
      input.hijos &&
      (formData[input.nombre]?.value || formData[input.nombre].files)
    ) {
      const hijos = flatInputs(input.hijos, formData);
      newInputs.push(...hijos);
    }

    // eslint-disable-next-line no-unused-vars
    const { hijos, ...newInput } = input;
    newInputs.push(newInput);
  }

  return newInputs;
};

const validate = async (
  inputs,
  formData,
  setFormData,
  fiscalizacionCreatedAt
) => {
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

                    newErrors[input.nombre][index] = `${input.titulo} invalido`;
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
                newErrors[input.nombre] = `${input.titulo} debe ser un numero`;
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
        const values = formData[input.nombre].value?.split('/');
        if (values) {
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
        } else if (req === true || (formData[req] && formData[req].value)) {
          newErrors[input.nombre] = 'Campo requerido';
        }
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
        let fileError = ``;

        for (const file of files) {
          const reader = new FileReader();
          reader.readAsArrayBuffer(file, document);

          const result = await new Promise((resolve, reject) => {
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
          });

          const acceptFileTypes = input.opciones?.multimedia
            ? [
                'application/pdf',
                'image/',
                'video/',
                'audio/',
                'application/msword',
                'application/vnd.ms-excel',
                'application/vnd.ms-powerpoint',
                'text/plain',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.openxmlformats-officedocument.presentationml.presentation'
              ]
            : ['application/pdf', 'image/'];

          if (acceptFileTypes.some(type => file.type.includes(type))) {
            if (file.type.includes('image/')) {
              if (file.size > 2097152) {
                const archivo = await comprimirImagen(file);
                filesArray.push(archivo);
              } else {
                filesArray.push(file);
              }
            } else if (file.type === 'application/pdf') {
              filesArray.push(file);
              if (file.size > 2097152) {
                fileError += `\nUn PDF supera el tamaño máximo permitido - ${file.name}`;
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
                  fileError += `\nUn PDF está encriptado - ${file.name}`;
                }
              }
            } else {
              filesArray.push(file);
              if (file.size > 2097152) {
                fileError += `\nUn archivo supera el tamaño máximo permitido - ${file.name}`;
              }
            }
          } else {
            fileError += `\nTipo de archivo no permitido - ${file.name}`;
          }
        }

        if (fileError) {
          newErrors[input.nombre] =
            `Por favor vuelva a cargar todos los archivos\n` + fileError;

          setFormData(a => ({
            ...a,
            [input.nombre]: { ...a[input.nombre], files: null, value: null }
          }));
        } else {
          setFormData(a => ({
            ...a,
            [input.nombre]: { ...a[input.nombre], files: filesArray }
          }));
        }
      }
    }

    if (input.nombre === 'fechaActa') {
      if (dayjs(formData[input.nombre].value).isAfter(fiscalizacionCreatedAt)) {
        newErrors[input.nombre] =
          'La fecha de la acta no puede ser mayor a la fecha de la fiscalización';
      }
    }

    if (input.hijos) {
      newErrors = {
        ...newErrors,
        ...(await validate(
          input.hijos,
          formData,
          setFormData,
          fiscalizacionCreatedAt
        ))
      };
    }
  }

  return newErrors;
};

const FiscalizacionInputs = ({
  inputs,
  title,
  isDisabled,
  expediente,
  fiscalizacionId,
  fiscalizacionCreatedAt
}) => {
  const dispatch = useDispatch();
  const [values, setValues] = useState(getValues(inputs));

  const [formData, setFormData] = useState(values);
  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setValues(getValues(inputs));
  }, [inputs]);

  useEffect(() => {
    setFormData(values);
  }, [values]);

  const handleChange = (e, inputNombre) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: {
        value: type === 'checkbox' ? e.target.checked : value,
        inputNombre,
        estado: value && 'request'
      }
    });

    setErrors(state => ({ ...state, [name]: undefined }));
  };

  const handleChangeFileMultiple = async (e, inputNombre) => {
    const files = e.target.files;
    const filesArray = Array.from(files);

    if (filesArray.length) {
      const previewArray = filesArray.map(file => {
        const extension = file.name.substring(file.name.lastIndexOf('.'));
        let preview = URL.createObjectURL(file);

        preview = preview + extension;

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
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errors = await validate(
      inputs,
      formData,
      setFormData,
      fiscalizacionCreatedAt
    );
    setErrors(errors);

    const newInputs = flatInputs(inputs, formData);

    if (Object.keys(errors).length === 0 && !loading) {
      setLoading(true);
      const data = newInputs
        .map(input => ({
          ...formData[input.nombre],
          fiscalizacionId: fiscalizacionId,
          estado: 'approved',
          inputNombre: input.nombre,
          value:
            input.value === true
              ? 'true'
              : input.value === false
              ? 'false'
              : formData[input.nombre].value
        }))
        .filter(input => input.value || input.inputNombre === 'matriculado');

      const dataNoFile = data.filter(input => input.type !== 'file');

      const dataFile = data
        .filter(input => input.type === 'file')
        .map(input => ({
          files: input.files,
          fiscalizacionId: fiscalizacionId,
          inputNombre: input.inputNombre,
          estado: 'approved'
        }));

      await dispatch(
        fiscalizacionUpsertInputsValues(
          dataNoFile,
          expediente.id,
          dataFile,
          expediente.carpeta?.usuarioId || 'cucicba',
          fiscalizacionId
        )
      );
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row className="g-2 d-flex align-items-start">
        {inputs.map(input => (
          <FiscalizacionInputComponent
            key={input.nombre}
            input={input}
            handleChange={handleChange}
            formData={formData}
            errors={errors}
            isDisabled={isDisabled}
            handleChangeFileMultiple={handleChangeFileMultiple}
          />
        ))}
      </Row>
      {!isDisabled && (
        <Flex justifyContent="end" className="mt-3">
          <Button size="sm" type="submit" disabled={loading}>
            {loading ? (
              <Spinner variant="primary" animation="border" size="sm" />
            ) : (
              'Guardar ' + title
            )}
          </Button>
        </Flex>
      )}

      {!isDisabled && (
        <div className="d-flex justify-content-between mt-1">
          <div className="d-flex">
            <div className="d-flex align-items-center">
              <div
                className="bg-info d-flex justify-content-center align-items-center"
                style={{
                  borderRadius: '50%',
                  width: 17,
                  height: 17,
                  marginBottom: 2
                }}
              >
                <FontAwesomeIcon
                  className="text-white"
                  icon="floppy-disk"
                  style={{ fontSize: '11px' }}
                />
              </div>

              <p className="m-0 ms-1 fs--1 fw-semi-bold"> Guardado</p>
            </div>

            <div className="d-flex align-items-center ms-3">
              <FontAwesomeIcon
                className="text-warning"
                icon="exclamation-circle"
                style={{ marginBottom: 2 }}
              />
              <p className="m-0 ms-1 fs--1 fw-semi-bold"> Sin guardar</p>
            </div>
          </div>

          <p className="text-danger fw-bold fs--1 m-0">
            (<FontAwesomeIcon className="text-danger fs--2" icon="asterisk" />)
            Campos obligatorios
          </p>
        </div>
      )}
    </Form>
  );
};

FiscalizacionInputs.propTypes = {
  inputs: PropTypes.arrayOf(PropTypes.object),
  formData: PropTypes.object,
  handleChange: PropTypes.func,
  errors: PropTypes.object,
  title: PropTypes.string,
  isDisabled: PropTypes.bool,
  expedienteId: PropTypes.number,
  status: PropTypes.string,
  expediente: PropTypes.object,
  fiscalizacionId: PropTypes.number.isRequired,
  fiscalizacionCreatedAt: PropTypes.string
};

export default FiscalizacionInputs;
