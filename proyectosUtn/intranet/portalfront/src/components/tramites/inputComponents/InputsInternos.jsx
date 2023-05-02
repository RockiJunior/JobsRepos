import React from 'react';
import PropTypes from 'prop-types';
import { Card, Col, InputGroup, Row } from 'react-bootstrap';
import './InputsInternos.css';
import { useDispatch, useSelector } from 'react-redux';
import { tramiteGetById, upsertInputsValues } from 'redux/actions/tramite';

const getInputType = (input, length, handleSubmit) => {
  switch (input.tipo) {
    case 'choose':
      return (
        <Col
          className="d-flex justify-content-around align-items-center"
          key={input.nombre}
          xs={length === 1 ? 12 : 6}
        >
          <InputGroup
            size="sm"
            className="d-flex justify-content-center align-items-center"
          >
            <InputGroup.Text className="bg-primary text-light w-100 mb-4">
              {input.titulo}
            </InputGroup.Text>
            <div className="d-flex justify-content-center align-items-center w-100 mb-2">
              {input.opciones.map((opcion, index) => (
                <Card
                  className="me-4"
                  key={index}
                  onClick={() => handleSubmit(input, opcion.value)}
                >
                  <Card.Body className="d-flex flex-column justify-content-around choose-card">
                    <Card.Title className="text-primary pt-4 pb-2">
                      {opcion.label}
                    </Card.Title>

                    <Card.Text className="text-primary pb-4 pt-2">
                      {opcion.descripcion}
                    </Card.Text>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </InputGroup>
        </Col>
      );

    default:
      return <Col key={input.key}>default</Col>;
  }
};

const InputsInternos = ({ inputs, tramiteId }) => {
  const { user } = useSelector(state => state.authReducer);

  const dispatch = useDispatch();

  const handleSubmit = async (input, value) => {
    await dispatch(
      upsertInputsValues(
        [{ tramiteId, inputNombre: input.nombre, estado: 'approved', value }],
        tramiteId,
        [],
        user.id
      )
    );
    await dispatch(tramiteGetById(tramiteId));
  };

  return (
    <Row>
      {inputs.map(input => getInputType(input, inputs.length, handleSubmit))}
    </Row>
  );
};

InputsInternos.propTypes = {
  inputs: PropTypes.array.isRequired,
  tramiteId: PropTypes.number.isRequired
};

export default InputsInternos;
