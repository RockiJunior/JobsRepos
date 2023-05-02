import ViewFileLinkArrayModal from 'components/common/ViewFileLinkArrayModal';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import React from 'react';
import { Col, InputGroup, Row } from 'react-bootstrap';
import { getStatusIcon } from 'utils/getStatusIcon';
import BuscadorMatriculado from '../components/BuscadorMatriculado';

const getValueType = value => {
  switch (value.tipo) {
    case 'checkbox':
      return value.multiple ? (
        value.InputValues?.value?.split('/').map((v, i) =>
          i === 0 ? (
            <span key={v.id} className="form-control">
              {v === 'true' ? 'Si' : 'No'}
            </span>
          ) : (
            <InputGroup key={v.id}>
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
          titulo={value.titulo}
        />
      );

    default:
      return value.multiple ? (
        value.InputValues?.value?.split('/').map((v, i) =>
          i === 0 ? (
            <span key={v.id} className="form-control">
              {v || '-'}
            </span>
          ) : (
            <InputGroup key={v.id} size="sm">
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

const ValueComponent = ({
  value,
  requestModification,
  formData,
  setFormData,
  handleChange,
  handleAcceptInput,
  handleCancelInput,
  handleSaveObservation,
  cancelRequestModification,
  setCancelRequestModification,
  allApproved,
  isChildren
}) => {
  return (
    <>
      <Col
        xs={12}
        lg={isChildren || value.tipo === 'textarea' ? 12 : 6}
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
            {getStatusIcon(
              value.InputValues?.estado,
              formData[value.nombre]?.estado
            )}
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
            {getValueType(value, formData)}
          </InputGroup>
        </div>

        {value.hijos &&
          value.InputValues?.value &&
          value.InputValues?.value !== 'false' && (
            <Row className="g-3 d-flex align-items-start mt-1">
              {value.hijos.map(child => (
                <ValueComponent
                  key={child.nombre}
                  value={child}
                  requestModification={requestModification}
                  formData={formData}
                  setFormData={setFormData}
                  handleChange={handleChange}
                  handleAcceptInput={handleAcceptInput}
                  handleCancelInput={handleCancelInput}
                  handleSaveObservation={handleSaveObservation}
                  cancelRequestModification={cancelRequestModification}
                  setCancelRequestModification={setCancelRequestModification}
                  allApproved={allApproved}
                  isChildren
                />
              ))}
            </Row>
          )}
      </Col>
    </>
  );
};

ValueComponent.propTypes = {
  value: PropTypes.object,
  requestModification: PropTypes.bool,
  formData: PropTypes.object,
  handleChange: PropTypes.func,
  handleAcceptInput: PropTypes.func,
  handleCancelInput: PropTypes.func,
  handleSaveObservation: PropTypes.func,
  cancelRequestModification: PropTypes.bool,
  setCancelRequestModification: PropTypes.func,
  allApproved: PropTypes.bool,
  setFormData: PropTypes.func,
  isChildren: PropTypes.bool
};

export default ValueComponent;
