import React, { useEffect, useState } from 'react';
import { Container, Fade, Row } from 'react-bootstrap';
import bg1 from 'assets/img/playmatch/bg.jpg';
import Section from 'components/common/Section';
import MobileSelector from './HomeComponents/MobileSelector';
import { useOutletContext } from 'react-router-dom';
import AdminLanding from './AdminComponents/Admin';
import Content from './HomeComponents/Content';
import Processes from './HomeComponents/Processes';
import Services from './HomeComponents/Services';
import AdminServices from './AdminComponents/AdminServices';
import Tour from './AdminComponents/Tour';

const Home = () => {
  const isClub = useOutletContext();
  const [fade1, setFade1] = useState(true);
  const [fade2, setFade2] = useState(false);
  const [breakpoint, setBreakpoint] = useState(window.innerWidth);

  window.addEventListener(
    'resize',
    function (event) {
      setBreakpoint(event.target.innerWidth);
    },
    true
  );

  useEffect(() => {
    if (isClub) {
      setFade2(false);
      setTimeout(() => setFade1(true), 310);
    } else {
      setFade1(false);
      setTimeout(() => setFade2(true), 310);
    }
  }, [isClub]);

  return (
    <>
      <Section
        className={
          'light d-flex align-items-center py-6' + (isClub ? ' mb-4' : '')
        }
        image={bg1}
        position="center"
        overlay
        style={{
          transition: 'all 0.5s ease-out',
          minHeight: breakpoint > 767 ? (isClub ? '95vh' : '400px') : 'auto'
        }}
      >
        <Container>
          <Fade in={fade1} mountOnEnter={true} unmountOnExit={true}>
            <Row className="d-flex justify-content-center align-items-center">
              <AdminLanding />
            </Row>
          </Fade>
          <Fade in={fade2} mountOnEnter={true} unmountOnExit={true}>
            <Row className="d-flex justify-content-center align-items-center">
              <Content />
            </Row>
          </Fade>
        </Container>
      </Section>
      <Fade in={fade2} mountOnEnter={true} unmountOnExit={true}>
        <div>
          <MobileSelector />
          <Processes />
          <Services breakpoint={breakpoint} />
        </div>
      </Fade>
      <Fade in={fade1} mountOnEnter={true} unmountOnExit={true}>
        <div>
          <Tour />
          <AdminServices />
        </div>
      </Fade>
    </>
  );
};

export default Home;
