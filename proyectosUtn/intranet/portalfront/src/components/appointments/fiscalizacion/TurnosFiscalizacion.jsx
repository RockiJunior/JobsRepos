import { CustomCard } from 'components/common/CustomCard';
import Flex from 'components/common/Flex';
import ProcedureInputComponent from 'components/tramites/inputComponents/ProcedureInputComponent';
import { regex } from 'components/tramites/inputComponents/ProcedureInputs';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Card, Row } from 'react-bootstrap';
import ReCAPTCHA from 'react-google-recaptcha';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { reservarTurnoFiscalizacion } from 'redux/actions/turnos';
import comprimirImagen from 'utils/comprimirImagen';
import Turnero from './Turnero';
import PropTypes from 'prop-types';

const getHijosSelect = opcion => {
  switch (opcion) {
    case 'apoderado':
      return [
        {
          nombre: 'nombreConcurre',
          titulo: 'Nombre y Apellido / Apoderada',
          tipo: 'text',
          requerido: [true]
        },
        {
          nombre: 'dniConcurre',
          titulo: 'DNI / Apoderada',
          tipo: 'number',
          requerido: [true],
          validaciones: {
            regex: 'onlyNumbers',
            min: 7,
            max: 8
          }
        }
      ];

    case 'autorizado':
      return [
        {
          nombre: 'nombreConcurre',
          titulo: 'Nombre y Apellido / Autorizada',
          tipo: 'text',
          requerido: [true]
        },
        {
          nombre: 'dniConcurre',
          titulo: 'DNI / Autorizada',
          tipo: 'number',
          requerido: [true],
          validaciones: {
            regex: 'onlyNumbers',
            min: 7,
            max: 8
          }
        }
      ];

    default:
      return undefined;
  }
};

const getDatos = formData => [
  {
    nombre: 'motivo',
    titulo: 'Motivo',
    tipo: 'select',
    requerido: [true],
    opciones: [
      { value: 'abonar_arancel', label: 'Abonar Arancel' },
      { value: 'acta_requerimiento', label: 'Acta de Requerimiento' },
      {
        value: 'calco_carteleria_ocasional',
        label: 'Calco para Cartelería Ocasional'
      },
      { value: 'carta_documento', label: 'Carta Documento' },
      { value: 'cedula_notificacion', label: 'Cédula de Notificación' },
      {
        value: 'declaracion_jurada_abstencion',
        label: 'Declaración Jurada Abstención'
      },
      { value: 'inspecciones', label: 'Inspecciones' },
      {
        value: 'licencia_pasividad_2023',
        label: 'Licencia por Pasividad 2023'
      },
      {
        value: 'notificacion_citacion_aviso_visita',
        label: 'Notificación / Citación / Aviso de visita'
      },
      {
        value: 'retiro_certificado_habilitacion_profesional',
        label: 'Retiro de Certificado de Habilitacion Profesional'
      },
      {
        value: 'retiro_listado_infractor',
        label: 'Retiro del listado de infractor'
      },
      { value: 'vista_expediente', label: 'Vista de Expediente' }
    ],
    fluid: true
  },
  {
    nombre: 'nombreTitular',
    titulo: 'Nombre del titular',
    tipo: 'text',
    requerido: [true]
  },
  {
    nombre: 'apellidoTitular',
    titulo: 'Apellido del titular',
    tipo: 'text',
    requerido: [true]
  },
  {
    nombre: 'dniTitular',
    titulo: 'DNI del titular',
    tipo: 'number',
    requerido: [true],
    validaciones: {
      regex: 'onlyNumbers',
      min: 7,
      max: 8
    }
  },
  {
    nombre: 'mailTitular',
    titulo: 'Mail del titular',
    tipo: 'text',
    requerido: [true],
    validaciones: {
      regex: 'email'
    }
  },
  {
    nombre: 'telefono',
    titulo: 'Teléfono',
    tipo: 'number',
    requerido: [false],
    validaciones: {
      regex: 'onlyNumbers'
    }
  },
  {
    nombre: 'empresa',
    titulo: 'Empresa',
    tipo: 'text',
    requerido: [true]
  },
  {
    nombre: 'calle',
    titulo: 'Calle',
    tipo: 'text',
    requerido: [true]
  },
  {
    nombre: 'numero',
    titulo: 'Número',
    tipo: 'number',
    requerido: [true]
  },
  {
    nombre: 'piso',
    titulo: 'Piso',
    tipo: 'number',
    requerido: [false],
    hijos: [
      {
        nombre: 'depto',
        titulo: 'Depto',
        tipo: 'text',
        requerido: [false]
      }
    ]
  },
  {
    nombre: 'localidad',
    titulo: 'Localidad',
    tipo: 'text',
    requerido: [false]
  },
  {
    nombre: 'concurre',
    titulo: 'La persona que concurre es',
    tipo: 'select',
    requerido: [true],
    ayuda:
      'Recuerde que si es Apoderado o Autorizado debe concurrir con la documentación que acredite identidad.',
    opciones: [
      { value: 'titular', label: 'Titular' },
      { value: 'apoderado', label: 'Apoderada' },
      { value: 'autorizado', label: 'Autorizada' }
    ],
    hijos: getHijosSelect(formData.concurre.value),
    fluid: true
  },
  {
    nombre: 'acta',
    titulo: 'Nro. Acta',
    tipo: 'number',
    requerido: [false],
    validaciones: {
      regex: 'onlyNumbers'
    }
  },
  {
    nombre: 'visita',
    titulo: 'Nro. Visita',
    tipo: 'number',
    requerido: [false],
    validaciones: {
      regex: 'onlyNumbers'
    }
  },
  {
    nombre: 'inspeccion',
    titulo: 'Se le ha realizado una inspección?',
    tipo: 'select',
    requerido: [true],
    opciones: [
      { value: 'si', label: 'Si' },
      { value: 'no', label: 'No' }
    ]
  },
  {
    nombre: 'nombreInspector',
    titulo: 'Nombre del inspector',
    tipo: 'text',
    requerido: [false]
  },
  {
    nombre: 'formaPago',
    titulo: 'Forma de pago',
    tipo: 'select',
    requerido: [true],
    opciones: [
      { value: 'contado', label: 'Contado' },
      { value: 'tarjeta', label: 'Tarjeta Crédito/Débito' },
      { value: 'plan_pagos', label: 'Plan de Pagos' }
    ]
  }
];

const initialFormData = {
  motivo: '',
  nombreTitular: '',
  apellidoTitular: '',
  dniTitular: '',
  mailTitular: '',
  telefono: '',
  empresa: '',
  direccion: '',
  numero: '',
  piso: '',
  depto: '',
  localidad: '',
  concurre: '',
  nombreConcurre: '',
  apellidoConcurre: '',
  matricula: '',
  numeroMatricula: '',
  acta: '',
  visita: '',
  inspeccion: '',
  nombreInspector: '',
  formaPago: ''
};

const TurnosFiscalizacion = ({ datosUsuario, usuarioId }) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [inputs, setInputs] = useState([]);
  const [captcha, setCaptcha] = useState(false);

  const [turnoPedido, setTurnoPedido] = useState(null);

  const [appointment, setAppointment] = useState({});

  const onChangeCaptcha = value => {
    setCaptcha(value);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: { value } });
  };

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

  const handleSubmit = async e => {
    e.preventDefault();

    const errors = await validate(inputs);
    setErrors(errors);

    if (
      Object.keys(errors).length === 0 &&
      !loading &&
      (captcha || usuarioId)
    ) {
      setLoading(true);

      const newData = {};

      for (const data in formData) {
        if (formData[data].value) {
          newData[data] = formData[data].value;
        }
      }

      dispatch(
        reservarTurnoFiscalizacion(
          { ...newData, fecha: appointment.inicio },
          setTurnoPedido,
          usuarioId
        )
      );

      setLoading(false);
    }
  };

  useEffect(() => {
    setInputs(getDatos(formData));
  }, [formData]);

  useEffect(() => {
    if (datosUsuario) {
      setFormData({
        motivo: '',
        nombreTitular: { value: datosUsuario.nombre?.value },
        apellidoTitular: { value: datosUsuario.apellido?.value },
        dniTitular: { value: datosUsuario.dni?.value },
        mailTitular: { value: datosUsuario.mailParticular?.value },
        telefono: { value: datosUsuario.telefonoParticular?.value },
        empresa: '',
        direccion: '',
        numero: '',
        piso: '',
        depto: '',
        localidad: '',
        concurre: '',
        nombreConcurre: '',
        apellidoConcurre: '',
        matricula: '',
        numeroMatricula: '',
        acta: '',
        visita: '',
        inspeccion: '',
        nombreInspector: '',
        formaPago: ''
      });
    }
  }, [datosUsuario]);

  return turnoPedido ? (
    <CustomCard
      title="Solicitud de turnos"
      subtitle="Departamento de fiscalización e inspecciones"
      icon="calendar-alt"
    >
      <Card.Body>
        <Alert variant="info" className="mb-0">
          <Alert.Heading>Ya tenés tu turno.</Alert.Heading>
          <p>
            Tu turno es el día {dayjs(turnoPedido.inicio).format('DD/MM/YYYY')}{' '}
            a las {dayjs(turnoPedido.inicio).format('HH:mm')}. Recorda que debes
            presentar toda la documentación que subiste anteriormente. Si tenes
            alguna duda podés comunicarte con las oficinas de CUCICBA.
          </p>
        </Alert>
      </Card.Body>

      <Card.Footer className="d-flex justify-content-center pt-0">
        <Button
          variant="outline-primary"
          onClick={() => {
            setTurnoPedido(null);
            setFormData(initialFormData);
            setCaptcha(false);
            setErrors({});
            setAppointment(null);
          }}
        >
          Solicitar otro turno
        </Button>
      </Card.Footer>
    </CustomCard>
  ) : (
    <CustomCard
      title="Solicitud de turnos"
      subtitle="Departamento de fiscalización e inspecciones"
      icon="calendar-alt"
    >
      <Card.Body>
        <div className="d-flex justify-content-center">
          <div style={{ maxWidth: '1000px' }}>
            {!usuarioId && (
              <div className="d-flex justify-content-end mb-2">
                <Button variant="outline-primary" as={Link} to="/login">
                  Soy Matriculado
                </Button>
              </div>
            )}

            <Row className="d-flex align-items-start">
              {inputs.map(campo => {
                return (
                  <ProcedureInputComponent
                    key={campo.nombre}
                    formData={formData}
                    errors={errors}
                    input={campo}
                    handleChange={handleChange}
                  />
                );
              })}
            </Row>

            <Turnero
              appointment={appointment}
              setAppointment={setAppointment}
            />

            {!usuarioId && (
              <div className="mt-4 d-flex justify-content-center">
                <ReCAPTCHA
                  sitekey={process.env.REACT_APP_CAPTCHA_KEY}
                  onChange={onChangeCaptcha}
                />
              </div>
            )}

            <Flex justifyContent="end" className="mt-3 mx-0">
              <Flex direction="column" justifyContent="center" alignItems="end">
                <Button
                  onClick={handleSubmit}
                  disabled={loading || (!captcha && !usuarioId)}
                >
                  Enviar
                </Button>
              </Flex>
            </Flex>
          </div>
        </div>
      </Card.Body>
    </CustomCard>
  );
};

TurnosFiscalizacion.propTypes = {
  datosUsuario: PropTypes.object,
  usuarioId: PropTypes.number
};

export default TurnosFiscalizacion;
