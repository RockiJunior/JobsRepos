import React from 'react';
import {
  Card,
  Row,
  Col,
  Image,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap';
import { FiActivity, FiInfo } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import StepsStatus from '../../../common/StepsStatus';

const PropertyListItem = ({ property }) => {
  return (
    <Col xs={12}>
      <Card className="bg-white">
        <Card.Body>
          <Row className="g-3">
            <Col xs={12} lg={5} className="d-flex">
              <Row className="g-3">
                <Col xs={12} md={4}>
                  {property.images?.length ? (
                    <Row className="g-2">
                      <Col
                        xs={12}
                        sm={6}
                        md={12}
                        style={{ maxHeight: '200px' }}
                      >
                        {property.images[0] && (
                          <img
                            src={
                              property.images[0].url
                                ? property.images[0].url
                                : `${process.env.REACT_APP_CLIENT}/uploads/properties/${property.images[0].filename}`
                            }
                            style={{
                              objectFit: 'cover',
                              width: '100%',
                              height: '100%'
                            }}
                          />
                        )}
                      </Col>

                      {property.images[1] && (
                        <Col
                          className="d-none d-sm-inline d-md-none"
                          style={{ maxHeight: '200px' }}
                        >
                          <img
                            src={
                              property.images[1].url
                                ? property.images[1].url
                                : `${process.env.REACT_APP_CLIENT}/uploads/properties/${property.images[1].filename}`
                            }
                            style={{
                              objectFit: 'cover',
                              width: '100%',
                              height: '100%'
                            }}
                          />
                        </Col>
                      )}
                    </Row>
                  ) : (
                    <Image src="https://via.placeholder.com/150" fluid />
                  )}
                </Col>

                <Col xs={12} md={8}>
                  <span className="d-block fs--1">{property.type}</span>
                  <span className="d-block fw-bold">{property.title}</span>
                  <span className="d-block small">
                    <strong>{property.address}</strong>
                  </span>
                  <span className="d-block small">{property.barrio}</span>

                  <span className="d-block small mt-3">
                    Operación: <strong> {property.operation}</strong>
                  </span>
                  <span className="d-block small">
                    Precio: <strong>{property.price}</strong>
                  </span>
                </Col>
              </Row>
            </Col>

            <Col xs={12} lg={7}>
              <Row className="mb-3">
                <Col className="">
                  <Row>
                    <Col>
                      <span className="small">
                        <FiActivity /> <strong>Actividad</strong>
                      </span>
                    </Col>
                    <Col className="d-flex justify-content-end">
                      <span className="small">
                        Estado: <strong>{property.status}</strong>
                      </span>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row className="g-3">
                <Col xs={4} className="border-end">
                  <span className="d-block small">
                    Visualizaciones{' '}
                    <OverlayTrigger
                      overlay={
                        <Tooltip id={`tooltip-top`} className="small">
                          Visualizaciones de la propiedad en el sitio web en el
                          último mes.
                        </Tooltip>
                      }
                    >
                      <span>
                        <FiInfo />
                      </span>
                    </OverlayTrigger>
                  </span>
                  <span className="d-block">
                    {property.statistics?.views || 0}
                  </span>
                </Col>

                <Col xs={4} className="border-end">
                  <span className="d-block small">
                    Interesados{' '}
                    <OverlayTrigger
                      overlay={
                        <Tooltip id={`tooltip-top`} className="small">
                          Interesados de la propiedad en el sitio web en el
                          último mes.
                        </Tooltip>
                      }
                    >
                      <span>
                        <FiInfo />
                      </span>
                    </OverlayTrigger>
                  </span>
                  <span className="d-block">
                    {' '}
                    {property.statistics?.interested || 0}
                  </span>
                </Col>

                <Col xs={4}>
                  <span className="d-block small">
                    Consultas{' '}
                    <OverlayTrigger
                      overlay={
                        <Tooltip id={`tooltip-top`} className="small">
                          Consultas de la propiedad en el sitio web en el último
                          mes.
                        </Tooltip>
                      }
                    >
                      <span>
                        <FiInfo />
                      </span>
                    </OverlayTrigger>
                  </span>
                  <span className="d-block">
                    {property.statistics?.queries || 0}{' '}
                    <Link className="small" to="/">
                      Ver consultas
                    </Link>
                  </span>
                </Col>

                <Col xs={12}>
                  <StepsStatus property={property.rawProp} />
                </Col>
              </Row>
            </Col>
          </Row>
        </Card.Body>

        <Card.Footer className="border-top d-sm-flex justify-content-between align-items-end">
          <div className="d-md-flex">
            <p className="m-1">
              <small className="text-muted">
                <strong>ID:</strong> {property.id}
              </small>
            </p>

            <p className="m-1">
              <small className="text-muted">
                <strong> Última actualización:</strong> {property.updated_at}
              </small>
            </p>
          </div>

          <div className="text-end">{property.actions}</div>
        </Card.Footer>
      </Card>
    </Col>
  );
};

export default PropertyListItem;
