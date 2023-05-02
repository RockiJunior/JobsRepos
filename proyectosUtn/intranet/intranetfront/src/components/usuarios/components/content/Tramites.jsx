import React from 'react';
import PropTypes from 'prop-types';
import SimpleTable from './SimpleTable';
import SoftBadge from 'components/common/SoftBadge';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const estadosTramite = [
  {
    value: 'aprobado',
    label: 'Aprobado'
  },
  {
    value: 'pendiente',
    label: 'Pendiente'
  },
  {
    value: 'rechazado',
    label: 'Rechazado'
  },
  {
    value: 'cancelado',
    label: 'Cancelado'
  }
];

const StatusBadge = ({ value }) => (
  <div className="d-flex justify-content-center">
    <SoftBadge
      bg={classNames({
        success: value === 'aprobado',
        primary: value === 'pendiente',
        danger: value === 'rechazado',
        warning: value === 'cancelado'
      })}
      className="fs--1"
    >
      {value[0].toUpperCase() + value.substring(1)}
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
    Header: 'Tipo de Trámite'
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
    accessor: 'fechaFin',
    Header: 'Finalización'
  },
  {
    accessor: 'estado',
    Header: 'Estado',
    Cell: StatusBadge,
    headerProps: { className: 'text-center' }
  }
];

const Tramites = ({ tramites }) => {
  const navigate = useNavigate();

  return (
    <SimpleTable
      data={tramites}
      columns={columns}
      rowOnClick={row => navigate('/tramites/' + row.id)}
      estados={estadosTramite}
    />
  );
};

Tramites.propTypes = {
  tramites: PropTypes.array.isRequired
};

export default Tramites;
