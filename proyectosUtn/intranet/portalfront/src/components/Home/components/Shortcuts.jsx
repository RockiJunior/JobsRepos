import React, { useEffect } from 'react';
import { Card, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { eventosGetAll } from 'redux/actions/eventos';
import { appRoutes } from 'routes/routes';
import getShortcuts from 'utils/getShortcuts';

const Shortcuts = () => {
  const { user } = useSelector(state => state.authReducer);
  const { eventos } = useSelector(state => state.eventoReducer);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(eventosGetAll());
  }, []);

  return (
    <Card className="h-100 bg-white">
      <Card.Header>
        <h5 className="fs-0 fw-normal text-800 mb-0">Accesos Directos</h5>
      </Card.Header>

      <Card.Body className="pt-0">
        <Row className="pt-0 ask-analytics g-2 d-flex justify-content-center">
          {getShortcuts(user, appRoutes.children, eventos)}
        </Row>
      </Card.Body>
    </Card>
  );
};

export default Shortcuts;
