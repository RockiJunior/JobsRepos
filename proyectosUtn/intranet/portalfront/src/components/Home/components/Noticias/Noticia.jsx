import VerifiedBadge from 'components/common/VerifiedBadge';
import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

export const Noticia = ({ noticia, isLast }) => {
  const { imagen, titulo, fecha, link, descripcion, verified } = noticia;

  return (
    <>
      <Row>
        <Col xs={12} md={4} className="d-flex align-items-center mb-3 mb-md-0">
          <div
            style={{
              background: `url(${imagen})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              width: '100%',
              height: '100%',
              minHeight: '140px'
            }}
          />
        </Col>

        <Col
          xs={12}
          md={8}
          className="flex-1 position-relative ps-3 d-flex flex-column justify-content-between"
        >
          <div>
            <h6 className="fs-1 mb-0">
              {titulo}
              {verified && <VerifiedBadge />}
            </h6>
            <p
              className="text-1000 mb-0"
              style={{
                fontSize: '0.8rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 6,
                WebkitBoxOrient: 'vertical'
              }}
            >
              {descripcion}
            </p>
          </div>
          <div className="d-flex justify-content-between pt-2">
            <p className="text-1000 mb-0">{`${fecha} `}</p>
            <p className="mb-1 text-end">
              <Link to={link}>Ver más</Link>
            </p>
          </div>
        </Col>
      </Row>
      {!isLast && <div className="border-dashed-bottom my-3" />}
    </>
  );
};
Noticia.propTypes = {
  noticia: PropTypes.shape({
    imagen: PropTypes.string,
    titulo: PropTypes.string,
    link: PropTypes.string,
    fecha: PropTypes.string,
    verified: PropTypes.bool,
    descripcion: PropTypes.string
  }),
  isLast: PropTypes.bool
};
