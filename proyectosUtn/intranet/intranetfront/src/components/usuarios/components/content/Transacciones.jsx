import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SimpleTable from './SimpleTable';
import SoftBadge from 'components/common/SoftBadge';
import classNames from 'classnames';
import { Button } from 'react-bootstrap';
import ViewTransaction from 'components/transactions/components/ViewTransaction';
import { Link } from 'react-router-dom';

const estadoTransacciones = [
  {
    value: 'aprobada',
    label: 'Aprobada'
  },
  {
    value: 'pendiente',
    label: 'Pendiente'
  },
  {
    value: 'enviada',
    label: 'Enviada'
  },
  {
    value: 'solicitud modificación',
    label: 'Solicitud de modificación'
  },
  {
    value: 'rechazada',
    label: 'Rechazada'
  }
];

const StatusBadge = ({ value }) => (
  <div className="d-flex justify-content-center">
    <SoftBadge
      bg={classNames({
        success: value === 'aprobada',
        info: value === 'enviada',
        danger: value === 'rechazada',
        warning: value === 'solicitud modificación',
        primary: value === 'pendiente'
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
    <div className="d-flex justify-content-center">
      <SoftBadge bg="secondary" className="text-primary">
        {value || '-'}
      </SoftBadge>
    </div>
  );
};

PasoBadge.propTypes = {
  value: PropTypes.object.isRequired
};

const OpenTransacction = ({
  handleClick,
  row: {
    original: { id }
  }
}) => (
  <Button size="sm" onClick={() => handleClick(id)}>
    Ver transacción
  </Button>
);

OpenTransacction.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      id: PropTypes.number.isRequired
    })
  }),
  handleClick: PropTypes.func.isRequired
};

const Transacciones = ({ transacciones }) => {
  const [transactionId, setTransactionId] = useState(null);

  const handleClick = id => {
    setTransactionId(id);
  };

  const columns = [
    {
      accessor: 'tramiteId',
      Header: 'Trámite',
      // eslint-disable-next-line react/prop-types
      Cell: ({ value }) => <Link to={'/tramites/' + value}>Nro. {value}</Link>
    },
    {
      accessor: 'conceptos',
      Header: 'Conceptos',
      Cell: ({ value }) =>
        value.map((c, i) => (
          <>
            {c}
            {i !== value.length - 1 && <br />}
          </>
        )),
      cellProps: { className: 'fs--1' }
    },
    {
      accessor: 'monto',
      Header: 'Monto',
      Cell: ({ value }) => `$ ${value}`
    },
    {
      accessor: 'cuota',
      Header: 'Cuota',
      Cell: PasoBadge,
      headerProps: { className: 'text-center' }
    },
    {
      accessor: 'fecha',
      Header: 'Fecha'
    },
    {
      accessor: 'estado',
      Header: 'Estado',
      Cell: StatusBadge,
      headerProps: { className: 'text-center' }
    },
    {
      accessor: 'action',
      Header: 'Acciones',
      Cell: props => <OpenTransacction {...props} handleClick={handleClick} />,
      disableSortBy: true
    }
  ];

  return (
    <>
      <SimpleTable
        data={transacciones}
        columns={columns}
        estados={estadoTransacciones}
      />

      <ViewTransaction
        transactionId={transactionId}
        setTransactionId={setTransactionId}
        onlyView
      />
    </>
  );
};

Transacciones.propTypes = {
  transacciones: PropTypes.array.isRequired
};

export default Transacciones;
