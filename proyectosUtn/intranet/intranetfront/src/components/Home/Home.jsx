import React, { useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getAllNotificationsByUserid } from 'redux/actions/notificaciones';
import { getHomeInfo } from 'redux/actions/users';
import GreetingCard from './components/GreetingCard';
import Shortcuts from './components/Shortcuts';
import StatisticsCards from './StatisticsCards';

const Home = () => {
  const dispatch = useDispatch();
  const { homeInfo } = useSelector(state => state.usersReducer);
  const { notificaciones } = useSelector(state => state.notificationReducer);
  const { user } = useSelector(state => state.authReducer);

  useEffect(() => {
    dispatch(getHomeInfo());
    user && dispatch(getAllNotificationsByUserid(user.id));
  }, []);

  return (
    <Row className="g-3 mb-3">
      <Col xs={12} xl={8} xxl={9}>
        <Row className="g-3">
          <Col xs={12}>
            <GreetingCard
              notifications={notificaciones || []}
              user={user}
              homeInfo={homeInfo}
            />
          </Col>

          <Col xs={12}>
            <Shortcuts user={user} />
          </Col>
        </Row>
      </Col>

      <Col xs={12} xl={4} xxl={3}>
        <StatisticsCards data={homeInfo} />
      </Col>
    </Row>
  );
};

export default Home;
