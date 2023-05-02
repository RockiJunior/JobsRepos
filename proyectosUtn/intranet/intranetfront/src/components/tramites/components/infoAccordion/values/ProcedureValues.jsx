import React from 'react';
import PropTypes from 'prop-types';
import { Button, Row, Spinner } from 'react-bootstrap';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { upsertInputsValues } from 'redux/actions/tramite';
import { usePrompt } from 'utils/usePrompt';
import ValueComponent from 'components/tramites/components/infoAccordion/values/ValueComponent';

const ProcedureValues = ({
  values,
  status,
  tramiteId,
  title,
  requestModificationFromProcedure,
  goToSection,
  tramiteStatus,
  tramite
}) => {
  const dispatch = useDispatch();

  const { user } = useSelector(state => state.authReducer);

  const [loading, setLoading] = useState(false);

  const [requestModification, setRequestModification] = useState(false);
  const [allApproved, setAllApproved] = useState(false);
  const [formData, setFormData] = useState({});
  const [cancelRequestModification, setCancelRequestModification] =
    useState(false);

  const message = 'Hay cambios sin guardar. ¿Estás seguro de querer salir?';
  const when = Object.keys(formData).length > 0;

  usePrompt(message, when);

  const handleChange = (e, inputNombre, inputValue) => {
    const { name, value } = e.target;
    setFormData(state => ({
      ...state,
      [name]: { inputNombre, comentario: value, tramiteId, value: inputValue }
    }));
  };

  const handleAcceptInput = (inputNombre, inputValue) => {
    setFormData(state => ({
      ...state,
      [inputNombre]: {
        tramiteId,
        estado: 'approved',
        inputNombre,
        value: inputValue
      }
    }));
  };

  const handleCancelInput = inputNombre => {
    setFormData(state => {
      // eslint-disable-next-line no-unused-vars
      const { [inputNombre]: unused, ...newState } = state;
      return newState;
    });
  };

  const handleSaveObservation = inputNombre => {
    setFormData(state => ({
      ...state,
      [inputNombre]: { ...state[inputNombre], estado: 'request' }
    }));
  };

  const approveAllInputs = values => {
    return values.reduce((acc, value) => {
      if (value.InputValues?.estado === 'sent') {
        acc[value.nombre] = {
          tramiteId,
          estado: 'approved',
          inputNombre: value.nombre,
          value: value.InputValues?.value
        };
      }

      if (value.hijos) {
        const children = approveAllInputs(value.hijos);
        acc = { ...acc, ...children };
      }

      return acc;
    }, {});
  };

  const handleApproveAll = () => {
    const newFormData = approveAllInputs(values);

    setAllApproved(true);
    setFormData(newFormData);
  };

  const getSentValues = values => {
    return values.reduce((acc, value) => {
      if (value.InputValues?.estado === 'sent') {
        acc.push(value);
      }

      if (value.hijos) {
        const children = getSentValues(value.hijos);
        acc = [...acc, ...children];
      }

      return acc;
    }, []);
  };

  const isSendDisabled = () => {
    const sentValues = getSentValues(values).length;

    return (
      sentValues !==
      Object.keys(formData)
        .map(value => formData[value])
        .filter(value => value.estado).length
    );
  };

  const handleSubmit = async () => {
    if (!loading) {
      setLoading(true);
      setCancelRequestModification(true);
      const dataArr = Object.keys(formData).map(value => formData[value]);
      await dispatch(upsertInputsValues(dataArr, tramiteId, user.id, title));
      setFormData({});
      goToSection(state => state + 1);
      setLoading(false);
    }
  };

  return (
    <>
      <Row className="g-3">
        {values.map(value => (
          <ValueComponent
            requestModification={requestModification}
            key={value.nombre}
            value={value}
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
            handleAcceptInput={handleAcceptInput}
            handleCancelInput={handleCancelInput}
            handleSaveObservation={handleSaveObservation}
            cancelRequestModification={cancelRequestModification}
            setCancelRequestModification={setCancelRequestModification}
            allApproved={allApproved}
            requestModificationFromProcedure={requestModificationFromProcedure}
          />
        ))}
      </Row>

      {status === 'sent' &&
        !requestModification &&
        !allApproved &&
        tramiteStatus === 'pendiente' &&
        tramite.tipo.pasos[tramite.pasoActual]?.nextConditions?.some(
          nc => nc === 'allInputsApproved' || nc === 'allInputsSent'
        ) &&
        tramite.empleadoId && (
          <div className="d-flex justify-content-end mt-3">
            <Button
              size="sm"
              variant="warning"
              className="me-3"
              onClick={() => setRequestModification(true)}
            >
              Solicitar modificación
            </Button>
            <Button onClick={handleApproveAll} size="sm" variant="success">
              Aprobar todos
            </Button>
          </div>
        )}

      {status === 'sent' && (requestModification || allApproved) && (
        <div className="mt-3">
          <div className="d-flex justify-content-end mt-3">
            <Button
              size="sm"
              variant="danger"
              className="me-3"
              disabled={loading}
              onClick={() => {
                setRequestModification(false);
                setAllApproved(false);
                setFormData({});
                setCancelRequestModification(true);
              }}
            >
              Cancelar
            </Button>

            <Button
              size="sm"
              variant="success"
              onClick={handleSubmit}
              disabled={isSendDisabled() || loading}
            >
              {loading ? <Spinner animation="border" size="sm" /> : 'Enviar'}
            </Button>
          </div>
        </div>
      )}

      {status === 'request' && (
        <div className="d-flex justify-content-end mt-3">
          <p className="text-success">Solicitud de modificación enviada</p>
        </div>
      )}

      {requestModificationFromProcedure && (
        <div className="mt-3">
          <div className="d-flex justify-content-end mt-3">
            <Button
              size="sm"
              variant="success"
              onClick={handleSubmit}
              disabled={
                Object.keys(formData).filter(
                  key => formData[key].estado === 'request'
                ).length === 0
              }
            >
              Enviar
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

ProcedureValues.propTypes = {
  values: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string,
  status: PropTypes.string,
  tramiteId: PropTypes.number,
  requestModificationFromProcedure: PropTypes.bool,
  goToSection: PropTypes.func,
  tramiteStatus: PropTypes.string,
  tramite: PropTypes.object
};

export default ProcedureValues;
