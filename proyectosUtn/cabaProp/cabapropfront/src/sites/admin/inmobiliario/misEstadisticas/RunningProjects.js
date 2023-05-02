import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Badge, Card, Col, Form, ProgressBar, Row } from 'react-bootstrap';
import FalconCardHeader from 'components/common/FalconCardHeader';
import FalconCardFooterLink from 'components/common/FalconCardFooterLink';
import Flex from 'components/common/Flex';
import classNames from 'classnames';

const Project = ({ project, isLast }) => {
  const { color, quantity, amount, title } = project;
  return (
    <Row
      className={classNames('align-items-center py-2', {
        'border-bottom border-200 ': !isLast
      })}
    >
      <Col className="py-1">
        <Flex className="align-items-center">
          <div className="avatar avatar-xl me-3">
            <div className={`avatar-name rounded-circle bg-soft-${color}`}>
              <span className={`fs-0 text-${color}`}>{title[0]}</span>
            </div>
          </div>
          <Flex className="position-relative">
            <Flex tag="h6" align="center" className="mb-0">
              <a className="text-800 stretched-link" href="#!">
                {title}
              </a>
              <Badge pill bg="200" className="ms-2 text-primary">
                {amount}
              </Badge>
            </Flex>
          </Flex>
        </Flex>
      </Col>
      <Col>
        <Row className="justify-content-end align-items-center">
          <Col xs="auto pe-0">
            <div className="fs--1 fw-semi-bold">{quantity}</div>
          </Col>
          <Col xs="5" className="pe-card">
            <ProgressBar now={quantity} style={{ height: 5 }} />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

Project.propTypes = {
  project: PropTypes.shape({
    color: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    amount: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
  }),
  isLast: PropTypes.bool
};

const RunningProjects = ({ alquileres, ventas }) => {

  const [chartNegocios, setChartNegocios] = useState("Mayores vendedores")

  const changeRunningProjects = (value) => {
    setChartNegocios(value)
  }

  return (
    <Card className="w-50 m-4">
      <FalconCardHeader
        title={chartNegocios}
        light
        titleTag="h6"
        endEl={
          <Form.Select onChange={(e) => changeRunningProjects(e.target.value)} size="sm" className="me-2">
            <option value={"Mayores vendedores"}>Ventas</option>
            <option value={"Mayores alquileres"}>Alquileres</option>
          </Form.Select>
        } 
      />

      <Card.Body className="py-0">
        {chartNegocios === "Mayores vendedores" ? 
          ventas.map((project, index) => (
          <Project
            project={project}
            isLast={index === ventas.length - 1}
            key={project.id}
          />
        ))
          :
          alquileres.map((project, index) => (
            <Project
              project={project}
              isLast={index === alquileres.length - 1}
              key={project.id}
            />
          ))
      }
      </Card.Body>

      <FalconCardFooterLink title="Ver todos" size="sm" />
    </Card>
  );
};

RunningProjects.propTypes = {
  data: PropTypes.arrayOf(Project.propTypes.project).isRequired
};

export default RunningProjects;
