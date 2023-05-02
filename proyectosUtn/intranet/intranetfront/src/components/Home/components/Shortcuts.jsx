import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { appRoutes } from 'routes/routes';
import getShortcuts from 'utils/getShortcuts';
import { IoApps } from 'react-icons/io5';

const Shortcuts = () => {
  const { user } = useSelector(state => state.authReducer);

  return (
    <>
      <Row>
        <Col>
          <Card className="h-100 bg-white">
            <Card.Header className="bg-light">
              <div className="d-flex align-items-center">
                <h5 className="fs-0 fw-normal text-800 mb-0">
                  <IoApps /> Accesos Directos
                </h5>
              </div>
            </Card.Header>

            <Card.Body className="pb-1">
              <Row className="pt-0 ask-analytics g-2 d-flex justify-content-center">
                {getShortcuts(user, appRoutes.children)}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Shortcuts;
