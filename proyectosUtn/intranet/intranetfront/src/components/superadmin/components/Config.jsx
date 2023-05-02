import React, { useEffect, useState } from 'react';
import { Button, Col, Form, InputGroup, Row, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getConfig, updateConfig } from 'redux/actions/superadmin';

const Config = () => {
  const dispatch = useDispatch();

  const { config, loading } = useSelector(state => state.saReducer);

  const [formData, setFormData] = useState({
    sueldoVitalMovil: 0,
    matriculaAnual: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(getConfig());
  }, []);

  useEffect(() => {
    config && setFormData(config);
  }, [config]);

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: Number(e.target.value) });
  };

  return loading ? (
    <center>
      <Spinner animation="border" variant="primary" />
    </center>
  ) : config ? (
    <Row className="g-3">
      <Col xs={12} lg={6}>
        <InputGroup size="sm">
          <InputGroup.Text className="bg-primary text-light">
            Salario Minimo Vital y Móvil
          </InputGroup.Text>
          <Form.Control
            type="number"
            value={formData.sueldoVitalMovil}
            name="sueldoVitalMovil"
            className="text-right"
            onChange={onChange}
          />
        </InputGroup>
      </Col>

      <Col xs={12} lg={6}>
        <InputGroup size="sm">
          <InputGroup.Text className="bg-primary text-light">
            Cuota Anual
          </InputGroup.Text>
          <Form.Control
            type="number"
            value={formData.matriculaAnual}
            name="matriculaAnual"
            className="text-right"
            onChange={onChange}
          />
        </InputGroup>
      </Col>

      <Col xs={12} className="d-flex justify-content-end">
        <Button
          variant="primary"
          size="sm"
          disabled={isLoading}
          onClick={async () => {
            if (!isLoading) {
              setIsLoading(true);
              await dispatch(updateConfig(formData));
              await dispatch(getConfig());
              setIsLoading(false);
            }
          }}
        >
          Guardar
        </Button>
      </Col>
    </Row>
  ) : (
    <div>
      <center>
        <h3>No se pudo obterner la configuración</h3>
      </center>
    </div>
  );
};

export default Config;
