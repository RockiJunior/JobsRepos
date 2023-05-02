import React from 'react';
import { Col, Row } from 'react-bootstrap';
import Wizard from 'components/wizard/Wizard';

const WizardAuth = ({ statusType }) => {
  return (
    <Row className="justify-content-center ms-1 p-0">
      <Col className="p-0 m-0">
        <Wizard statusType={statusType} validation={true} />
      </Col>
    </Row>
  );
};

export default WizardAuth;
