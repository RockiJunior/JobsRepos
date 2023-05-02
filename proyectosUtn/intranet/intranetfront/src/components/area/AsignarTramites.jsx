import AdvanceTable from 'components/common/advance-table/AdvanceTable';
import AdvanceTableWrapper from 'components/common/advance-table/AdvanceTableWrapper';
import React, { useEffect } from 'react';
import { Button, Card, Form, InputGroup } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { getPartners } from 'redux/actions/area';
import { getSinAsignarPorArea } from 'redux/actions/tramite';
import PropTypes from 'prop-types';
import { useState } from 'react';
import AsignarTramiteModal from './components/AsignarTramiteModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AdvanceTablePagination from 'components/common/advance-table/AdvanceTablePagination';
import { CustomCard } from 'components/common/CustomCard';
import CustomMessage from 'components/varios/messages/CustomMessage';
import { FaStamp } from 'react-icons/fa';

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

const AsignarTramites = () => {
  const { tramitesSinAsignar } = useSelector(state => state.tramiteReducer);
  const { partners } = useSelector(state => state.areaReducer);

  const dispatch = useDispatch();

  const [tramiteId, setTramiteId] = useState(null);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [flagSearch, setFlagSearch] = useState(false);

  useEffect(() => {
    dispatch(getSinAsignarPorArea());
    dispatch(getPartners());
  }, []);

  const handleClick = id => {
    setTramiteId(id);
  };

  const columns = [
    {
      accessor: 'numero',
      Header: 'Nro'
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
      accessor: 'tipo',
      Header: 'Tipo de trámite'
    },
    {
      accessor: 'area',
      Header: 'Área',
      disableSortBy: true
    },
    {
      accessor: 'createdAt',
      Header: 'Fecha de creación',
      Cell: ({ value }) => {
        return new Date(value).toLocaleDateString();
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
    setLimit(tramitesSinAsignar.limite);
  }, [tramitesSinAsignar.limite]);

  return (
    <>
      <CustomCard
        icon="stamp"
        title="Asignar trámites"
        subtitle="Podrás asignar trámites a los empleados"
      >
        {/* <Card.Header>
          <Card.Title className="fs-2">Asignar tramites</Card.Title>
        </Card.Header> */}
        {!!tramitesSinAsignar.tramites?.length && (
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
                          tramites: u,
                          // eslint-disable-next-line no-unused-vars
                          paginasTotales,
                          // eslint-disable-next-line no-unused-vars
                          count,
                          ...queries
                        } = tramitesSinAsignar;

                        dispatch(
                          getSinAsignarPorArea({
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
                          tramites: u,
                          // eslint-disable-next-line no-unused-vars
                          paginasTotales,
                          // eslint-disable-next-line no-unused-vars
                          count,
                          ...queries
                        } = tramitesSinAsignar;

                        dispatch(
                          getSinAsignarPorArea({
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
                data={tramitesSinAsignar.tramites || []}
                perPage={limit}
                sortable
                manualSortBy
                onChangeSort={sortBy => {
                  const {
                    // eslint-disable-next-line no-unused-vars
                    tramites: u,
                    // eslint-disable-next-line no-unused-vars
                    paginasTotales,
                    // eslint-disable-next-line no-unused-vars
                    count,
                    ...queries
                  } = tramitesSinAsignar;
                  if (sortBy.length) {
                    dispatch(
                      getSinAsignarPorArea({
                        ...queries,
                        pagina: 1,
                        columna: sortBy[0].id,
                        orden: sortBy[0].desc ? 'desc' : 'asc'
                      })
                    );
                  } else {
                    dispatch(
                      getSinAsignarPorArea({
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
                  canPreviousPage={tramitesSinAsignar.pagina !== 1}
                  canNextPage={
                    tramitesSinAsignar.pagina !==
                    tramitesSinAsignar.paginasTotales
                  }
                  pageCount={tramitesSinAsignar.paginasTotales}
                  pageIndex={tramitesSinAsignar.pagina}
                  limit={limit}
                  onChangeLimit={limit => {
                    const {
                      // eslint-disable-next-line no-unused-vars
                      tramites: u,
                      // eslint-disable-next-line no-unused-vars
                      paginasTotales,
                      // eslint-disable-next-line no-unused-vars
                      count,
                      ...queries
                    } = tramitesSinAsignar;

                    dispatch(
                      getSinAsignarPorArea({
                        ...queries,
                        pagina: 1,
                        limite: limit
                      })
                    );
                  }}
                  nextPage={() => {
                    const {
                      // eslint-disable-next-line no-unused-vars
                      tramites: u,
                      // eslint-disable-next-line no-unused-vars
                      paginasTotales,
                      // eslint-disable-next-line no-unused-vars
                      count,
                      pagina,
                      ...queries
                    } = tramitesSinAsignar;

                    dispatch(
                      getSinAsignarPorArea({
                        ...queries,
                        pagina: pagina + 1
                      })
                    );
                  }}
                  previousPage={() => {
                    const {
                      // eslint-disable-next-line no-unused-vars
                      tramites: u,
                      // eslint-disable-next-line no-unused-vars
                      paginasTotales,
                      // eslint-disable-next-line no-unused-vars
                      count,
                      pagina,
                      ...queries
                    } = tramitesSinAsignar;

                    dispatch(
                      getSinAsignarPorArea({
                        ...queries,
                        pagina: pagina - 1
                      })
                    );
                  }}
                  gotoPage={value => {
                    const {
                      // eslint-disable-next-line no-unused-vars
                      tramites: u,
                      // eslint-disable-next-line no-unused-vars
                      paginasTotales,
                      // eslint-disable-next-line no-unused-vars
                      count,
                      // eslint-disable-next-line no-unused-vars
                      pagina,
                      ...queries
                    } = tramitesSinAsignar;

                    dispatch(
                      getSinAsignarPorArea({
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
        {!tramitesSinAsignar.tramites?.length && (
          <CustomMessage
            ReactIcon={FaStamp}
            title="Atención!"
            message="No hay trámites sin asignar."
          />
        )}
        {partners && (
          <AsignarTramiteModal
            tramiteId={tramiteId}
            partners={partners}
            setTramiteId={setTramiteId}
          />
        )}
      </CustomCard>
    </>
  );
};

export default AsignarTramites;
