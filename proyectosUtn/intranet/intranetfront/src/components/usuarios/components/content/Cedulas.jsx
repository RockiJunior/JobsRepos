import React from 'react';
import PropTypes from 'prop-types';
import SimpleTable from './SimpleTable';
import SoftBadge from 'components/common/SoftBadge';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const estadosCedulas = [
  {
    value: 'fisica',
    label: 'Física'
  },
  {
    value: 'electronica',
    label: 'Elecontrónica'
  }
];

const StatusBadge = ({ value }) => (
  <div className="d-flex justify-content-center">
    <SoftBadge
      bg={classNames({
        success: value === 'electronica',
        primary: value === 'fisica'
      })}
      className="fs--1"
    >
      {value === 'fisica' ? 'Física' : 'Electrónica'}
    </SoftBadge>
  </div>
);

StatusBadge.propTypes = {
  value: PropTypes.string.isRequired
};

const PasoBadge = ({ value }) => {
  return (
    <OverlayTrigger
      placement="top"
      overlay={
        <Tooltip>
          <strong>{value?.title}</strong>
        </Tooltip>
      }
    >
      <div className="d-flex justify-content-center">
        <SoftBadge bg="secondary" className="text-primary">
          {value?.label || '-'}
        </SoftBadge>
      </div>
    </OverlayTrigger>
  );
};

PasoBadge.propTypes = {
  value: PropTypes.object.isRequired
};

const columns = [
  {
    accessor: 'numero',
    Header: 'Nro'
  },
  {
    accessor: 'titulo',
    Header: 'Título'
  },
  {
    accessor: 'pasoActual',
    Header: 'Paso Actual',
    Cell: PasoBadge,
    headerProps: { className: 'text-center' }
  },
  {
    accessor: 'createdAt',
    Header: 'Inicio'
  },
  {
    accessor: 'fechaRecepcion',
    Header: 'Recepción'
  },

  {
    accessor: 'estado',
    Header: 'Tipo',
    Cell: StatusBadge,
    headerProps: { className: 'text-center' }
  }
];

const Cedulas = ({ cedulas }) => {
  const navigate = useNavigate();

  return (
    <SimpleTable
      data={cedulas}
      columns={columns}
      rowOnClick={row => navigate('/cedulas/' + row.id)}
      estados={estadosCedulas}
    />
  );
};

Cedulas.propTypes = {
  cedulas: PropTypes.array.isRequired
};

export default Cedulas;
