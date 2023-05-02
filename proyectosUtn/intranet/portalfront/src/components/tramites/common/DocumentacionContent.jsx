import React from 'react';
import { Accordion, Badge, Button, Form, InputGroup } from 'react-bootstrap';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function FormDocumentationContent() {
  return (
    <div className="p-2">
      <InputGroup className="mb-3">
        <InputGroup.Text id="inputGroup-sizing-default">Nombre</InputGroup.Text>
        <Form.Control
          aria-label="Nombre"
          aria-describedby="inputGroup-sizing-default"
        />
        <InputGroup.Text
          id="inputGroup-sizing-default"
          style={{ marginLeft: 15 }}
        >
          Apellido
        </InputGroup.Text>
        <Form.Control
          aria-label="Apellido"
          aria-describedby="inputGroup-sizing-default"
        />
      </InputGroup>
      <InputGroup className="mb-3 ">
        <div
          style={{
            display: 'flex'
          }}
        >
          <InputGroup.Text id="inputGroup-sizing-default">
            Fecha de nacimiento
          </InputGroup.Text>
          <ReactDatePicker
            selected={new Date()}
            style={{
              backgroundColor: 'transparent'
            }}
          />
        </div>
        <InputGroup.Text
          id="inputGroup-sizing-default"
          style={{ marginLeft: 15 }}
        >
          DNI N°
        </InputGroup.Text>
        <Form.Control
          aria-label="Dni"
          type="number"
          aria-describedby="inputGroup-sizing-default"
        />
      </InputGroup>
      <InputGroup className="mb-3 ">
        <InputGroup.Text id="inputGroup-sizing-default">
          Domicilio Fisio
        </InputGroup.Text>
        <Form.Control
          aria-label="domicilio-fisico"
          aria-describedby="inputGroup-sizing-default"
        />
        <InputGroup.Text
          id="inputGroup-sizing-default"
          style={{ marginLeft: 15 }}
        >
          Celular
        </InputGroup.Text>
        <Form.Control
          aria-label="celular"
          aria-describedby="inputGroup-sizing-default"
          style={{ width: 20 }}
        />
        <Form.Control
          aria-label="celular"
          aria-describedby="inputGroup-sizing-default"
        />
      </InputGroup>
      <Button className="btn mt-3">Enviar</Button>
    </div>
  );
}

function InputDniContent() {
  return (
    <div
      style={{
        padding: 20
      }}
    >
      <Form.Group controlId="formFile" className="mb-3">
        <Form.Label>Foto del frente del DNI</Form.Label>
        <Form.Control type="file" />
        <Form.Label className="mt-3">Foto del dorso del DNI</Form.Label>
        <Form.Control type="file" />
        <Button className="btn mt-3">Enviar</Button>
      </Form.Group>
    </div>
  );
}

function InputAnaliticoContent() {
  return (
    <div>
      <Form.Group controlId="formFile" className="mb-3">
        <Form.Label>Foto del analitico</Form.Label>
        <Form.Control type="file" />
      </Form.Group>
    </div>
  );
}

export function DocumentacionContent() {
  return (
    <div>
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <Badge bg="secondary" style={{ marginRight: 10 }}>
              Pendiente de subir
            </Badge>
            Informacion personal
          </Accordion.Header>
          <Accordion.Body>
            <FormDocumentationContent />
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>
            <Badge bg="primary" style={{ marginRight: 10 }}>
              En revision
            </Badge>{' '}
            Foto Dni
          </Accordion.Header>
          <Accordion.Body>
            <InputDniContent />
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
          <Accordion.Header>
            <Badge bg="success" style={{ marginRight: 10 }}>
              Aprobado
            </Badge>{' '}
            Foto Analitico
          </Accordion.Header>
          <Accordion.Body>
            <InputAnaliticoContent />
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="3">
          <Accordion.Header>
            <Badge bg="warning" style={{ marginRight: 10 }}>
              Solicitud de modificacion
            </Badge>{' '}
            Foto Certificado de estudios
          </Accordion.Header>
          <Accordion.Body>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="4">
          <Accordion.Header>
            <Badge bg="danger" style={{ marginRight: 10 }}>
              Rechazado
            </Badge>{' '}
            Foto Certificado de estudios
          </Accordion.Header>
          <Accordion.Body>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </Accordion.Body>
        </Accordion.Item>
        `
      </Accordion>
    </div>
  );
}
