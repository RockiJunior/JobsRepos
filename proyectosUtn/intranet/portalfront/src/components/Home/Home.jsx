import { CustomCard } from 'components/common/CustomCard';
import React, { useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getAllNotificationsByUserid } from 'redux/actions/notificaciones';
import GreetingCard from './components/GreetingCard';
import Shortcuts from './components/Shortcuts';
import { Noticias } from './components/Noticias/Noticias';

const Home = () => {
  const dispatch = useDispatch();
  const { notificaciones } = useSelector(state => state.notificationReducer);
  const { user } = useSelector(state => state.authReducer);

  useEffect(() => {
    user && dispatch(getAllNotificationsByUserid(user.id));
  }, []);

  return (
    <Row className="g-3 mb-3">
      <Col xs={12} xl={8} xxl={9}>
        <Row className="g-3">
          <Col xs={12}>
            <GreetingCard notifications={notificaciones || []} user={user} />
          </Col>

          <Col xs={12}>
            <Shortcuts user={user} />
          </Col>
        </Row>
      </Col>

      <Col xs={12} xl={4} xxl={3}>
        <CustomCard title="Noticias" icon="newspaper">
          <Noticias />
        </CustomCard>
      </Col>
    </Row>
  );
};

export default Home;
