import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Col,
  InputGroup,
  Form,
  Row,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getStatusIcon } from 'utils/getStatusIcon';
import AyudaInput from './AyudaInput';
import ViewFileLinkArrayModal from 'components/common/ViewFileLinkArrayModal';
import dayjs from 'dayjs';
import BuscadorMatriculado from '../components/BuscadorMatriculado';

const getInputType = (
  input,
  formData,
  handleChange,
  handleChangeFileMultiple,
  errors,
  isDisabled
) => {
  switch (input.tipo) {
    case 'dateTime':
      return !isDisabled ? (
        <Form.Control
          name={input.nombre}
          onChange={e => handleChange(e, input.nombre)}
          value={formData[input.nombre]?.value}
          aria-label={input.nombre}
          type="datetime-local"
          isInvalid={errors[input.nombre]}
        />
      ) : (
        <span className="form-control">
          {formData[input.nombre]?.value
            ? dayjs(formData[input.nombre].value).format('DD/MM/YYYY HH:mm')
            : '-'}
        </span>
      );

    case 'textarea':
      return !isDisabled ? (
        <Form.Control
          name={input.nombre}
          onChange={e => handleChange(e, input.nombre)}
          value={formData[input.nombre]?.value}
          aria-label={input.nombre}
          as="textarea"
          rows={3}
          isInvalid={errors[input.nombre]}
        />
      ) : (
        <span className="form-control">
          {formData[input.nombre]?.value || '-'}
        </span>
      );

    case 'select':
      return !isDisabled ? (
        <Form.Select
          name={input.nombre}
          onChange={e => handleChange(e, input.nombre)}
          value={formData[input.nombre]?.value}
          isInvalid={errors[input.nombre]}
        >
          {!formData[input.nombre]?.value && (
            <option value="">Seleccione una opción</option>
          )}
          {input.opciones.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Form.Select>
      ) : (
        <span className="form-control">
          {formData[input.nombre]?.value || '-'}
        </span>
      );

    case 'checkbox':
      return !isDisabled ? (
        <InputGroup.Checkbox
          id={input.nombre}
          name={input.nombre}
          onChange={e => handleChange(e, input.nombre)}
          checked={formData[input.nombre]?.value}
        />
      ) : (
        <span className="form-control">
          {formData[input.nombre]?.value ? 'Si' : 'No'}
        </span>
      );

    case 'file':
      return !isDisabled ? (
        <>
          {formData[input.nombre]?.value && (
            <span className="form-control">
              <ViewFileLinkArrayModal
                previews={formData[input.nombre].value}
                alt={input.nombre}
              />
            </span>
          )}

          {input.multiple ? (
            <Form.Control
              name={input.nombre}
              onChange={e => handleChangeFileMultiple(e, input.nombre)}
              aria-label={input.nombre}
              type={input.tipo}
              isInvalid={errors[input.nombre]}
              style={{ width: formData[input.nombre]?.value ? '100%' : '' }}
              accept={
                input.opciones?.multimedia
                  ? 'application/pdf,image/*,video/*,audio/*,application/msword,application/vnd.ms-excel,application/vnd.ms-powerpoint,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.openxmlformats-officedocument.presentationml.presentation'
                  : 'application/pdf,image/*'
              }
              multiple
            />
          ) : (
            <Form.Control
              name={input.nombre}
              onChange={e => handleChangeFileMultiple(e, input.nombre)}
              aria-label={input.nombre}
              type={input.tipo}
              isInvalid={errors[input.nombre]}
              style={{ width: formData[input.nombre]?.value ? '100%' : '' }}
              accept={
                input.opciones?.multimedia
                  ? 'application/pdf,image/*,video/*,audio/*,application/msword,application/vnd.ms-excel,application/vnd.ms-powerpoint,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.openxmlformats-officedocument.presentationml.presentation'
                  : 'application/pdf,image/*'
              }
            />
          )}
        </>
      ) : (
        <span className="form-control">
          {formData[input.nombre]?.value?.length ? (
            <ViewFileLinkArrayModal
              previews={formData[input.nombre].value}
              alt={input.nombre}
            />
          ) : (
            '-'
          )}
        </span>
      );

    case 'buscadorMatriculado':
      return (
        <BuscadorMatriculado
          isDisabled={isDisabled}
          matriculadoId={formData[input.nombre]?.value}
          handleChange={handleChange}
          nombreInput={input.nombre}
          titulo={input.titulo}
        />
      );

    default:
      return !isDisabled ? (
        <Form.Control
          name={input.nombre}
          onChange={e => handleChange(e, input.nombre)}
          value={formData[input.nombre]?.value}
          aria-label={input.nombre}
          type={input.tipo}
          isInvalid={errors[input.nombre]}
          className={input.tipo === 'date' ? 'pe-4' : ''}
        />
      ) : (
        <span className="form-control">
          {formData[input.nombre]?.value || '-'}
        </span>
      );
  }
};

const InputComponent = ({
  input,
  handleChange,
  handleChangeFileMultiple,
  formData,
  errors,
  isDisabled,
  isChildren
}) => {
  const [multiple, setMultiple] = useState(['']);

  const thisIsDisabled =
    isDisabled || input.InputValues?.estado === 'approved' || input.isDisabled;

  useEffect(() => {
    if (
      input.multiple &&
      input.tipo !== 'file' &&
      formData[input.nombre]?.value
    ) {
      setMultiple(formData[input.nombre]?.value.split('/'));
    }
  }, [input]);

  return (
    <>
      <Col
        xs={12}
        lg={
          isChildren ||
          input.tipo === 'textarea' ||
          input.tipo === 'buscadorMatriculado'
            ? 12
            : 6
        }
        className="d-flex flex-column justify-content-end pt-2"
        style={{
          backgroundColor:
            (input.multiple && input.tipo !== 'file' && multiple.length > 1) ||
            (input.hijos && formData[input.nombre]?.value)
              ? 'var(--falcon-300)'
              : '',
          transition: 'background-color 0.5s ease'
        }}
      >
        <InputGroup size="sm">
          {input.tipo !== 'buscadorMatriculado' && (
            <InputGroup.Text
              className="bg-primary text-light"
              style={{ width: input.tipo === 'textarea' ? '100%' : '' }}
            >
              {`${input.titulo}${
                input.multiple && input.tipo !== 'file' ? ' 1' : ''
              }`}
            </InputGroup.Text>
          )}

          {getStatusIcon(
            input.InputValues?.estado,
            formData[input.nombre]?.estado
          )}

          {(!input.multiple || input.tipo === 'file') &&
            getInputType(
              input,
              formData,
              handleChange,
              handleChangeFileMultiple,
              errors,
              thisIsDisabled
            )}

          {!errors[input.nombre] &&
            input.requerido[0] === true &&
            (input.multiple && input.tipo !== 'file'
              ? !formData[input.nombre]?.value?.replaceAll('/', '')
              : !formData[input.nombre]?.value) && (
              <div
                style={{
                  position: 'absolute',
                  right: input.multiple && input.tipo !== 'file' ? 34 : 7,
                  zIndex: 5
                }}
              >
                <FontAwesomeIcon
                  className="text-danger fs--2"
                  icon="asterisk"
                />
              </div>
            )}

          {input.multiple &&
            input.tipo !== 'file' &&
            multiple.map((item, index) => (
              <Fragment key={`${input.nombre}${index}`}>
                {index === 0 && (
                  <>
                    {!thisIsDisabled ? (
                      <Form.Control
                        name={input.nombre}
                        onChange={e => {
                          const newMultiple = multiple.map((item, i) =>
                            i === index ? e.target.value : item
                          );
                          setMultiple(newMultiple);
                          handleChange(
                            {
                              target: {
                                name: input.nombre,
                                value: newMultiple.join('/')
                              }
                            },
                            input.nombre
                          );
                        }}
                        value={item}
                        aria-label={input.nombre}
                        type={input.tipo}
                        isInvalid={
                          errors[input.nombre] && errors[input.nombre][index]
                        }
                        className={input.tipo === 'date' ? 'pe-4' : ''}
                        size="sm"
                      />
                    ) : (
                      <span className="form-control">{item || '-'}</span>
                    )}

                    {!thisIsDisabled && (
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip id="button-tooltip-2">
                            Agregar otro {input.titulo.toLowerCase()}
                          </Tooltip>
                        }
                      >
                        <span>
                          <InputGroup.Text
                            className="cursor-pointer bg-primary"
                            style={{ paddingLeft: 6, paddingRight: 6 }}
                            onClick={() => setMultiple([...multiple, ''])}
                          >
                            <FontAwesomeIcon
                              icon="plus"
                              className="text-light"
                            />
                          </InputGroup.Text>
                        </span>
                      </OverlayTrigger>
                    )}

                    <Form.Control.Feedback
                      type="invalid"
                      className="d-flex justify-content-end"
                      style={{ whiteSpace: 'pre-line' }}
                    >
                      {errors[input.nombre] && errors[input.nombre][index]}
                    </Form.Control.Feedback>
                  </>
                )}

                {index !== 0 && (
                  <InputGroup className="mt-2" size="sm">
                    <InputGroup.Text className="bg-primary text-light">
                      {input.titulo + ' ' + (index + 1)}
                    </InputGroup.Text>
                    {!thisIsDisabled ? (
                      <Form.Control
                        name={input.nombre}
                        onChange={e => {
                          const newMultiple = multiple.map((item, i) =>
                            i === index ? e.target.value : item
                          );
                          setMultiple(newMultiple);
                          handleChange(
                            {
                              target: {
                                name: input.nombre,
                                value: newMultiple.join('/')
                              }
                            },
                            input.nombre
                          );
                        }}
                        value={item}
                        aria-label={input.nombre}
                        type={input.tipo}
                        isInvalid={errors[input.nombre]}
                        className={input.tipo === 'date' ? 'pe-4' : ''}
                        size="sm"
                      />
                    ) : (
                      <span className="form-control">{item || '-'}</span>
                    )}

                    {!thisIsDisabled && (
                      <InputGroup.Text
                        className="cursor-pointer bg-danger"
                        style={{ paddingLeft: 4, paddingRight: 4 }}
                        onClick={() => {
                          const newMultiple = multiple.filter(
                            (item, i) => i !== index
                          );
                          setMultiple(newMultiple);
                          handleChange(
                            {
                              target: {
                                name: input.nombre,
                                value: newMultiple.join('/')
                              }
                            },
                            input.nombre
                          );
                        }}
                      >
                        <FontAwesomeIcon
                          icon="xmark-circle"
                          className="text-light"
                        />
                      </InputGroup.Text>
                    )}
                    <Form.Control.Feedback
                      type="invalid"
                      className="d-flex justify-content-end"
                      style={{ whiteSpace: 'pre-line' }}
                    >
                      {errors[input.nombre] && errors[input.nombre][index]}
                    </Form.Control.Feedback>
                  </InputGroup>
                )}
              </Fragment>
            ))}

          {!errors[input.nombre]
            ? input.ayuda && (
                <AyudaInput ayuda={input.ayuda} formData={formData} />
              )
            : (!input.multiple || input.tipo === 'file') && (
                <Form.Control.Feedback
                  type="invalid"
                  className="d-flex justify-content-end"
                  style={{ whiteSpace: 'pre-line' }}
                >
                  {errors[input.nombre]}
                </Form.Control.Feedback>
              )}
        </InputGroup>

        <Row className="g-1 d-flex align-items-start mt-1">
          {input.hijos &&
            formData[input.nombre]?.value &&
            input.hijos.map(child => (
              <InputComponent
                key={child.nombre}
                input={child}
                handleChange={handleChange}
                handleChangeFileMultiple={handleChangeFileMultiple}
                formData={formData}
                errors={errors}
                isDisabled={isDisabled}
                isChildren
              />
            ))}
        </Row>
      </Col>
    </>
  );
};
InputComponent.propTypes = {
  input: PropTypes.object,
  handleChange: PropTypes.func,
  formData: PropTypes.object,
  errors: PropTypes.object,
  isDisabled: PropTypes.bool,
  handleChangeFileMultiple: PropTypes.func,
  isChildren: PropTypes.bool
};

export default InputComponent;
