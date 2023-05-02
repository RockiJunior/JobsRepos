/* eslint-disable no-case-declarations */
import React from 'react';
import PropTypes from 'prop-types';
import { Col, InputGroup, Row } from 'react-bootstrap';
import dayjs from 'dayjs';
import ViewFileLinkArrayModal from 'components/common/ViewFileLinkArrayModal';
import BuscadorMatriculado from '../components/BuscadorMatriculado';

const getValueType = value => {
  switch (value.tipo) {
    case 'checkbox':
      return value.multiple ? (
        value.InputValues?.value?.split('/').map((v, i) =>
          i === 0 ? (
            <span className="form-control">{v === 'true' ? 'Si' : 'No'}</span>
          ) : (
            <InputGroup>
              <InputGroup.Text
                style={{
                  backgroundColor: 'transparent',
                  color: 'transparent'
                }}
              >
                {value.nombre}
              </InputGroup.Text>
              <span className="form-control">{v === 'true' ? 'Si' : 'No'}</span>
            </InputGroup>
          )
        )
      ) : (
        <span className="form-control">
          {value.InputValues?.value === 'true' ? 'Si' : 'No'}
        </span>
      );

    case 'file':
      const inputValue = value.InputValues;
      const archivos = inputValue?.archivos;

      return (
        <span className="form-control">
          {archivos?.length ? (
            <ViewFileLinkArrayModal
              previews={archivos.map(archivo => archivo.archivoUbicacion)}
              alt={value.nombre}
            />
          ) : (
            '-'
          )}
        </span>
      );

    case 'date':
      return (
        <span className="form-control">
          {value.InputValues?.value
            ? dayjs(value.InputValues?.value).format('DD/MM/YYYY')
            : '-'}
        </span>
      );

    case 'buscadorMatriculado':
      return (
        <BuscadorMatriculado
          isDisabled
          matriculadoId={value.InputValues?.value}
        />
      );

    default:
      return value.multiple ? (
        value.InputValues?.value?.split('/').map((v, i) =>
          i === 0 ? (
            <span className="form-control">{v || '-'}</span>
          ) : (
            <InputGroup size="sm">
              <InputGroup.Text className="bg-primary text-light">
                {`${value.titulo} ${i + 1}`}
              </InputGroup.Text>
              <span className="form-control">{v || '-'}</span>
            </InputGroup>
          )
        )
      ) : (
        <span className="form-control">{value.InputValues?.value || '-'}</span>
      );
  }
};

const ProcedureValueComponent = ({ value, isChildren }) => {
  return (
    <>
      <Col
        xs={12}
        lg={isChildren ? 12 : 6}
        style={{
          backgroundColor:
            (value.multiple &&
              value.tipo !== 'file' &&
              value.InputValues?.value.split('/').length > 1) ||
            (value.hijos &&
              value.InputValues?.value &&
              value.tipo === 'checkbox' &&
              value.InputValues?.value === 'true')
              ? 'var(--falcon-300)'
              : '',
          transition: 'background-color 0.5s ease'
        }}
        className="pb-1 pt-2"
      >
        <div className="d-flex align-items-center">
          <InputGroup size="sm" className="d-flex align-items-center">
            {value.tipo !== 'buscadorMatriculado' && (
              <InputGroup.Text
                className="bg-primary text-light"
                style={{
                  overflow: 'hidden',
                  width: value.tipo === 'textarea' ? '100%' : ''
                }}
              >
                {`${value.titulo}${
                  value.multiple && value.tipo !== 'file' ? ' 1' : ''
                }`}
              </InputGroup.Text>
            )}
            {getValueType(value)}
          </InputGroup>
        </div>

        {value.hijos &&
          value.InputValues?.value &&
          value.tipo === 'checkbox' &&
          value.InputValues?.value !== 'false' && (
            <Row className="g-3 d-flex align-items-start mt-1">
              {value.hijos.map(child => (
                <ProcedureValueComponent
                  key={child.nombre}
                  value={child}
                  isChildren
                />
              ))}
            </Row>
          )}
      </Col>
    </>
  );
};

ProcedureValueComponent.propTypes = {
  value: PropTypes.object,
  isChildren: PropTypes.bool
};

export default ProcedureValueComponent;
