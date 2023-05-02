import axios from 'axios';
import { CustomCard } from 'components/common/CustomCard';
import RenderPreview from 'components/common/RenderPreview';
import React, { useEffect, useState } from 'react';
import { Card, Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const Oblea = () => {
  const { user } = useSelector(state => state.authReducer);

  const [oblea, setOblea] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(async () => {
    if (user?.datos?.oblea) {
      const { data } = await axios.get(
        process.env.REACT_APP_SERVER + '/pdf/oblea/' + user.id
      );

      setOblea(data);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [user]);

  return (
    <CustomCard title="Oblea" icon="print">
      <Card.Body>
        {loading ? (
          <Spinner animation="border" variant="primary" />
        ) : oblea ? (
          <div style={{ maxWidth: '300px' }}>
            <RenderPreview isSmall alt="oblea" preview={oblea} />
          </div>
        ) : (
          <div>
            <p>No tenés oblea</p>
            <p>
              Para obtener tu oblea, tenés que realizar el trámite de Alta de
              Matriculación y la declaración jurada de Actividad Comercial
            </p>
          </div>
        )}
      </Card.Body>
    </CustomCard>
  );
};

export default Oblea;
