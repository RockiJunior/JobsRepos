import Flex from 'components/common/Flex';
import React, { useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { tramiteGetTiposdeTramite } from 'redux/actions/tramite';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { CustomCard } from '../common/CustomCard';

const removeAccents = str => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

const SingleItem = ({ icon, title, description, to, paddingType }) => {
  return (
    <div
      className={classNames('w-100 w-xl-50 pb-3', {
        'ps-xl-2': paddingType === 'start',
        'pe-xl-2': paddingType === 'end'
      })}
    >
      <div className="border border-1 border-300 rounded-2 p-3 ask-analytics-item position-relative h-100">
        <Flex alignItems="center" className="mb-3">
          <FontAwesomeIcon icon={icon} className="text-primary fs-1" />
          <Link to={to} className="stretched-link text-decoration-none">
            <h5 className="mb-0 ps-2">{title}</h5>
          </Link>
        </Flex>
        <h5 className="fs--1 text-600">{description}</h5>
      </div>
    </div>
  );
};

SingleItem.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  paddingType: PropTypes.oneOf(['start', 'end'])
};

const NewProcedures = () => {
  const dispatch = useDispatch();

  const { tipoTramites } = useSelector(state => state.tramiteReducer);

  useEffect(() => {
    dispatch(tramiteGetTiposdeTramite());
  }, []);

  return (
    <CustomCard title="Nuevo Trámite" icon="plus">
      <Card.Body className="p-0 pt-3">
        <div
          className="pt-0 px-card d-flex flex-wrap ask-analytics"
          style={{ maxHeight: 'none' }}
        >
          {tipoTramites.map((tipoTramite, index) => (
            <SingleItem
              key={`${tipoTramite.id}-${index}`}
              paddingType={index % 2 === 0 ? 'end' : 'start'}
              title={tipoTramite.titulo}
              description={tipoTramite.descripcion}
              to={
                '/tramites/' +
                removeAccents(tipoTramite.titulo)
                  .toLowerCase()
                  .replaceAll(' ', '-')
                  .replaceAll('/', '-')
                  .replaceAll('(', '')
                  .replaceAll(')', '')
              }
              icon="stamp"
            />
          ))}
        </div>
      </Card.Body>
    </CustomCard>
  );
};

export default NewProcedures;
