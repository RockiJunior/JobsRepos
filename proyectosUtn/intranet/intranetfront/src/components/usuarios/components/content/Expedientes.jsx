import classNames from 'classnames';
import SoftBadge from 'components/common/SoftBadge';
import PropTypes from 'prop-types';
import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import SimpleTable from './SimpleTable';

const estadosExpediente = [
  {
    value: 'pendiente',
    label: 'Pendiente'
  },
  {
    value: 'finalizado',
    label: 'Finalizado'
  },
  {
    value: 'archivado',
    label: 'Archivado'
  }
];

const StatusBadge = ({ value }) => (
  <div className="d-flex justify-content-center">
    <SoftBadge
      bg={classNames({
        warning: value === 'pendiente',
        success: value === 'finalizado',
        info: value === 'archivado'
      })}
      className="fs--1"
    >
      {value ? value[0].toUpperCase() + value.substring(1) : '-'}
    </SoftBadge>
  </div>
);

StatusBadge.propTypes = {
  value: PropTypes.string
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
    Header: 'Numero'
  },
  {
    accessor: 'createdAt',
    Header: 'Inicio'
  },
  {
    accessor: 'tiempoTotal',
    Header: 'Tiempo Total'
  },
  {
    accessor: 'estado',
    Header: 'Estado',
    Cell: StatusBadge,
    headerProps: { className: 'text-center' }
  }
];

const Expedientes = ({ expedientes }) => {
  const navigate = useNavigate();

  return (
    <SimpleTable
      data={expedientes}
      columns={columns}
      rowOnClick={row => navigate('/expedientes/' + row.id)}
      estados={estadosExpediente}
    />
  );
};

Expedientes.propTypes = {
  expedientes: PropTypes.array.isRequired
};

export default Expedientes;
