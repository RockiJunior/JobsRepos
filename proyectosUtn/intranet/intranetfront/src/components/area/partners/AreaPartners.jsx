import React from 'react';
import SoftBadge from 'components/common/SoftBadge';
import { Card } from 'react-bootstrap';
import AreaTableWrapper from './AreaTableWrapper';
import AreaTable from './AreaTable';
import PropTypes from 'prop-types';

const AreaPartners = ({
  bandeja,
  setBandeja,
  partners,
  setShowAreaPartners,
  type
}) => {
  const columns = [
    {
      accessor: 'nombre',
      Header: 'Nombre',
      headerProps: {
        className: 'text-center'
      },
      cellProps: {
        className: 'text-center'
      },
      Cell: rowData => {
        return (
          <p className="m-0 fw-bold">
            {rowData.row.original.usuario.nombre}{' '}
            {rowData.row.original.usuario.apellido}
          </p>
        );
      }
    },
    {
      accessor:
        type === 'cedulas'
          ? 'numeroCedulas'
          : type === 'expedientes'
          ? 'numeroExpedientes'
          : 'numeroTramites',
      Header:
        type === 'cedulas'
          ? 'Cédulas'
          : type === 'expedientes'
          ? 'Expedientes'
          : 'Trámites',
      headerProps: {
        className: 'text-center'
      },
      cellProps: {
        className: 'text-center'
      },
      Cell: rowData => {
        return (
          <SoftBadge pill bg={rowData.row.original.variant}>
            {rowData.value}
          </SoftBadge>
        );
      }
    }
  ];

  return (
    <AreaTableWrapper
      columns={columns}
      data={partners}
      selection
      selectionColumnWidth={30}
      sortable
      pagination
      perPage={10}
    >
      <Card bg="white">
        <Card.Body className="p-0">
          <AreaTable
            table
            headerClassName="bg-white text-900 text-nowrap align-middle"
            tableProps={{
              className: 'fs--1 mb-0 overflow-hidden'
            }}
            bandeja={bandeja}
            setBandeja={setBandeja}
            setShowAreaPartners={setShowAreaPartners}
          />
        </Card.Body>
      </Card>
    </AreaTableWrapper>
  );
};

AreaPartners.propTypes = {
  bandeja: PropTypes.object.isRequired,
  setBandeja: PropTypes.func.isRequired,
  partners: PropTypes.array.isRequired,
  setShowAreaPartners: PropTypes.func.isRequired,
  type: PropTypes.string
};

export default AreaPartners;
