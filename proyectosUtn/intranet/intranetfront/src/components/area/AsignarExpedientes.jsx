import AdvanceTable from 'components/common/advance-table/AdvanceTable';
import AdvanceTableWrapper from 'components/common/advance-table/AdvanceTableWrapper';
import React, { useEffect } from 'react';
import { Button, Card, Form, InputGroup } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { getPartners } from 'redux/actions/area';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AdvanceTablePagination from 'components/common/advance-table/AdvanceTablePagination';
import { expedienteGetSinAsignarPorArea } from 'redux/actions/expediente';
import AsignarExpedienteModal from './components/AsignarExpedienteModal';
import { CustomCard } from 'components/common/CustomCard';
import CustomMessage from 'components/varios/messages/CustomMessage';
import { FaBoxes } from 'react-icons/fa';
import dayjs from 'dayjs';

const AssignButton = ({
  handleClick,
  row: {
    original: { id }
  }
}) => (
  <Button size="sm" onClick={() => handleClick(id)}>
    Asignar responsable
  </Button>
);

AssignButton.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      id: PropTypes.number.isRequired
    })
  }),
  handleClick: PropTypes.func.isRequired
};

const AsignarExpedientes = () => {
  const { expedientesSinAsignar } = useSelector(
    state => state.expedienteReducer
  );

  const { partners } = useSelector(state => state.areaReducer);

  const dispatch = useDispatch();

  const [expedienteId, setExpedienteId] = useState(null);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [flagSearch, setFlagSearch] = useState(false);

  useEffect(() => {
    dispatch(expedienteGetSinAsignarPorArea());
    dispatch(getPartners());
  }, []);

  const handleClick = id => {
    setExpedienteId(id);
  };

  const columns = [
    {
      accessor: 'numero',
      Header: 'Número',
      disableSortBy: true
    },
    {
      accessor: 'createdAt',
      Header: 'Fecha de creación',
      Cell: ({ value }) => dayjs(value).format('DD/MM/YYYY HH:mm')
    },
    {
      accessor: 'nombre',
      Header: 'Nombre'
    },
    {
      accessor: 'apellido',
      Header: 'Apellido'
    },
    {
      accessor: 'dni',
      Header: 'DNI'
    },
    {
      accessor: 'areas',
      Header: 'Áreas',
      disableSortBy: true,
      Cell: ({ value }) => {
        return value.map(area => area.area.nombre).join(', ');
      }
    },
    {
      accessor: 'action',
      Header: 'Acciones',
      Cell: props => <AssignButton {...props} handleClick={handleClick} />,
      disableSortBy: true
    }
  ];

  useEffect(() => {
    setLimit(expedientesSinAsignar.limite);
  }, [expedientesSinAsignar.limite]);

  return (
    <CustomCard icon="box-archive" title="Asignar expedientes">
      {!!expedientesSinAsignar.expedientes?.length && (
        <>
          <Card.Body className="d-flex justify-content-center pb-0">
            <InputGroup size="sm" style={{ width: 'auto' }}>
              <Form.Control
                type="text"
                placeholder="Buscar..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                disabled={flagSearch}
              />

              <InputGroup.Text className="p-0" style={{ overflow: 'hidden' }}>
                {flagSearch ? (
                  <Button
                    size="sm"
                    className="rounded-0"
                    variant="danger"
                    onClick={() => {
                      const {
                        // eslint-disable-next-line no-unused-vars
                        expedientes: u,
                        // eslint-disable-next-line no-unused-vars
                        paginasTotales,
                        // eslint-disable-next-line no-unused-vars
                        count,
                        ...queries
                      } = expedientesSinAsignar;

                      dispatch(
                        expedienteGetSinAsignarPorArea({
                          ...queries,
                          pagina: 1,
                          busqueda: ''
                        })
                      );

                      setFlagSearch(false);
                      setSearch('');
                    }}
                  >
                    <FontAwesomeIcon icon="circle-xmark" />
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="rounded-0"
                    onClick={() => {
                      const {
                        // eslint-disable-next-line no-unused-vars
                        expedientes: u,
                        // eslint-disable-next-line no-unused-vars
                        paginasTotales,
                        // eslint-disable-next-line no-unused-vars
                        count,
                        ...queries
                      } = expedientesSinAsignar;

                      dispatch(
                        expedienteGetSinAsignarPorArea({
                          ...queries,
                          pagina: 1,
                          busqueda: search
                        })
                      );

                      setFlagSearch(true);
                    }}
                  >
                    <FontAwesomeIcon icon="search" />
                  </Button>
                )}
              </InputGroup.Text>
            </InputGroup>
          </Card.Body>
          <Card.Body>
            <AdvanceTableWrapper
              columns={columns}
              data={expedientesSinAsignar.expedientes || []}
              perPage={limit}
              sortable
              manualSortBy
              onChangeSort={sortBy => {
                const {
                  // eslint-disable-next-line no-unused-vars
                  expedientes: u,
                  // eslint-disable-next-line no-unused-vars
                  paginasTotales,
                  // eslint-disable-next-line no-unused-vars
                  count,
                  ...queries
                } = expedientesSinAsignar;
                if (sortBy.length) {
                  dispatch(
                    expedienteGetSinAsignarPorArea({
                      ...queries,
                      pagina: 1,
                      columna: sortBy[0].id,
                      orden: sortBy[0].desc ? 'desc' : 'asc'
                    })
                  );
                } else {
                  dispatch(
                    expedienteGetSinAsignarPorArea({
                      ...queries,
                      pagina: 1,
                      columna: 'createdAt',
                      orden: 'desc'
                    })
                  );
                }
              }}
              pagination
            >
              <AdvanceTable
                table
                headerClassName="bg-white text-900 text-nowrap align-middle"
                rowClassName="align-middle white-space-nowrap"
                tableProps={{
                  className: 'fs--1 mb-0 overflow-hidden bg-light'
                }}
              />
              <AdvanceTablePagination
                className="mt-4"
                canPreviousPage={expedientesSinAsignar.pagina !== 1}
                canNextPage={
                  expedientesSinAsignar.pagina !==
                  expedientesSinAsignar.paginasTotales
                }
                pageCount={expedientesSinAsignar.paginasTotales}
                pageIndex={expedientesSinAsignar.pagina}
                limit={limit}
                onChangeLimit={limit => {
                  const {
                    // eslint-disable-next-line no-unused-vars
                    expedientes: u,
                    // eslint-disable-next-line no-unused-vars
                    paginasTotales,
                    // eslint-disable-next-line no-unused-vars
                    count,
                    ...queries
                  } = expedientesSinAsignar;

                  dispatch(
                    expedienteGetSinAsignarPorArea({
                      ...queries,
                      pagina: 1,
                      limite: limit
                    })
                  );
                }}
                nextPage={() => {
                  const {
                    // eslint-disable-next-line no-unused-vars
                    expedientes: u,
                    // eslint-disable-next-line no-unused-vars
                    paginasTotales,
                    // eslint-disable-next-line no-unused-vars
                    count,
                    pagina,
                    ...queries
                  } = expedientesSinAsignar;

                  dispatch(
                    expedienteGetSinAsignarPorArea({
                      ...queries,
                      pagina: pagina + 1
                    })
                  );
                }}
                previousPage={() => {
                  const {
                    // eslint-disable-next-line no-unused-vars
                    expedientes: u,
                    // eslint-disable-next-line no-unused-vars
                    paginasTotales,
                    // eslint-disable-next-line no-unused-vars
                    count,
                    pagina,
                    ...queries
                  } = expedientesSinAsignar;

                  dispatch(
                    expedienteGetSinAsignarPorArea({
                      ...queries,
                      pagina: pagina - 1
                    })
                  );
                }}
                gotoPage={value => {
                  const {
                    // eslint-disable-next-line no-unused-vars
                    expedientes: u,
                    // eslint-disable-next-line no-unused-vars
                    paginasTotales,
                    // eslint-disable-next-line no-unused-vars
                    count,
                    // eslint-disable-next-line no-unused-vars
                    pagina,
                    ...queries
                  } = expedientesSinAsignar;

                  dispatch(
                    expedienteGetSinAsignarPorArea({
                      ...queries,
                      pagina: value + 1
                    })
                  );
                }}
              />
            </AdvanceTableWrapper>
          </Card.Body>
        </>
      )}
      {!expedientesSinAsignar.expedientes?.length && (
        <CustomMessage
          ReactIcon={FaBoxes}
          title="Atención!"
          message="No hay expedientes sin asignar."
        />
      )}
      {partners && (
        <AsignarExpedienteModal
          expedienteId={expedienteId}
          partners={partners}
          setExpedienteId={setExpedienteId}
        />
      )}
    </CustomCard>
  );
};

export default AsignarExpedientes;
