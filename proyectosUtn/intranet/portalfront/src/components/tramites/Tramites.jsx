import AdvanceTable from 'components/common/advance-table/AdvanceTable';
import AdvanceTablePagination from 'components/common/advance-table/AdvanceTablePagination';
import AdvanceTableWrapper from 'components/common/advance-table/AdvanceTableWrapper';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import { Button, Card, Dropdown, Form, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import SoftBadge from 'components/common/SoftBadge';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { tramiteGetByUserId } from 'redux/actions/tramite';
import { CustomCard } from 'components/common/CustomCard';

const StatusBadge = ({ value }) => (
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
);

StatusBadge.propTypes = {
  value: PropTypes.string.isRequired
};

const columns = [
  {
    accessor: 'titulo',
    Header: 'Tipo de Trámite'
  },
  {
    accessor: 'createdAt',
    Header: 'Fecha de Inicio',
    Cell: ({ value }) => dayjs(value).format('DD/MM/YYYY')
  },
  {
    accessor: 'fechaFin',
    Header: 'Fecha de Finalizacion',
    Cell: ({ value }) => (value ? dayjs(value).format('DD/MM/YYYY') : '-')
  },
  {
    accessor: 'estado',
    Header: 'Estado',
    Cell: StatusBadge
  }
];

const Procedures = () => {
  const navigate = useNavigate();

  const { tramites } = useSelector(state => state.tramiteReducer);
  const { user } = useSelector(state => state.authReducer);
  const [search, setSearch] = useState('');
  const [flagSearch, setFlagSearch] = useState(false);
  const [limit, setLimit] = useState(10);
  const [filter, setFilter] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    user && dispatch(tramiteGetByUserId(user.id));
  }, [user]);

  useEffect(() => {
    setLimit(tramites.limite);
  }, [tramites.limite]);

  useEffect(() => {
    if (search.length) {
      const {
        // eslint-disable-next-line no-unused-vars
        tramites: u,
        // eslint-disable-next-line no-unused-vars
        paginasTotales,
        // eslint-disable-next-line no-unused-vars
        count,
        ...queries
      } = tramites;

      dispatch(
        tramiteGetByUserId(user.id, {
          ...queries,
          pagina: 1,
          busqueda: search,
          filter
        })
      );

      setFlagSearch(true);
    } else {
      const {
        // eslint-disable-next-line no-unused-vars
        tramites: u,
        // eslint-disable-next-line no-unused-vars
        paginasTotales,
        // eslint-disable-next-line no-unused-vars
        count,
        ...queries
      } = tramites;

      dispatch(
        tramiteGetByUserId(user.id, {
          ...queries,
          pagina: 1,
          busqueda: undefined,
          filter
        })
      );
    }
  }, [filter]);

  return (
    <CustomCard icon="list" title="Mis Trámites">
      <AdvanceTableWrapper
        columns={columns}
        data={tramites.tramites || []}
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
          } = tramites;
          if (sortBy.length) {
            dispatch(
              tramiteGetByUserId(user.id, {
                ...queries,
                pagina: 1,
                columna: sortBy[0].id,
                orden: sortBy[0].desc ? 'desc' : 'asc'
              })
            );
          } else {
            dispatch(
              tramiteGetByUserId(user.id, {
                ...queries,
                pagina: 1,
                columna: undefined,
                orden: undefined
              })
            );
          }
        }}
        pagination
      >
        <Card.Body className="d-flex justify-content-center">
          <InputGroup size="sm" style={{ width: 'auto' }}>
            <Form.Control
              type="text"
              placeholder="Buscar..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              disabled={flagSearch}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  const {
                    // eslint-disable-next-line no-unused-vars
                    tramites: u,
                    // eslint-disable-next-line no-unused-vars
                    paginasTotales,
                    // eslint-disable-next-line no-unused-vars
                    count,
                    ...queries
                  } = tramites;

                  dispatch(
                    tramiteGetByUserId(user.id, {
                      ...queries,
                      pagina: 1,
                      busqueda: search
                    })
                  );

                  setFlagSearch(true);
                }
              }}
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
                    } = tramites;

                    dispatch(
                      tramiteGetByUserId(user.id, {
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
                    } = tramites;

                    dispatch(
                      tramiteGetByUserId(user.id, {
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
          <Dropdown style={{ position: 'absolute', right: 0 }} className="me-2">
            <Dropdown.Toggle
              variant="transparent"
              style={{ boxShadow: 'none', border: 'none' }}
              className="p-0"
            >
              <SoftBadge
                bg={classNames({
                  secondary: !filter,
                  success: filter?.split(':')[1] === 'aprobado',
                  warning: filter?.split(':')[1] === 'cancelado',
                  danger: filter?.split(':')[1] === 'rechazado',
                  primary: filter?.split(':')[1] === 'pendiente',
                  'text-dark': !filter
                })}
                className="fs-0"
              >
                {filter
                  ? filter.split(':')[1][0].toUpperCase() +
                    filter.split(':')[1].substring(1) +
                    's'
                  : 'Todos'}
              </SoftBadge>
            </Dropdown.Toggle>
            <Dropdown.Menu className="bg-light p-0">
              <Dropdown.Item
                className="p-1"
                onClick={() => setFilter('estado:aprobado')}
              >
                <SoftBadge bg="success" className="fs--1 w-100">
                  Aprobados
                </SoftBadge>
              </Dropdown.Item>

              <Dropdown.Item
                className="p-1"
                onClick={() => setFilter('estado:pendiente')}
              >
                <SoftBadge bg="primary" className="fs--1 w-100">
                  Pendientes
                </SoftBadge>
              </Dropdown.Item>

              <Dropdown.Item
                className="p-1"
                onClick={() => setFilter('estado:rechazado')}
              >
                <SoftBadge bg="danger" className="fs--1 w-100">
                  Rechazados
                </SoftBadge>
              </Dropdown.Item>

              <Dropdown.Item
                className="p-1"
                onClick={() => setFilter('estado:cancelado')}
              >
                <SoftBadge bg="warning" className="fs--1 w-100">
                  Cancelados
                </SoftBadge>
              </Dropdown.Item>

              <Dropdown.Item className="p-1" onClick={() => setFilter(null)}>
                <SoftBadge bg="secondary" className="fs--1 w-100 text-dark">
                  Todos
                </SoftBadge>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Card.Body>
        <Card.Body className="p-0">
          {tramites.tramites?.length ? (
            <AdvanceTable
              table
              headerClassName="bg-white text-900 text-nowrap align-middle"
              rowClassName="align-middle white-space-nowrap"
              tableProps={{
                className: 'fs--1 mb-0 overflow-hidden'
              }}
              rowOnClick={row => navigate(`/tramites/${row.id}`)}
            />
          ) : (
            <Card.Title className="text-center py-3">
              No se encontraron trámites
            </Card.Title>
          )}
        </Card.Body>

        <Card.Footer className="p-3">
          {!!tramites.tramites?.length && tramites.paginasTotales > 1 ? (
            <AdvanceTablePagination
              canPreviousPage={tramites.pagina !== 1}
              canNextPage={tramites.pagina !== tramites.paginasTotales}
              pageCount={tramites.paginasTotales}
              pageIndex={tramites.pagina}
              limit={tramites.limite}
              onChangeLimit={limit => {
                const {
                  // eslint-disable-next-line no-unused-vars
                  tramites: u,
                  // eslint-disable-next-line no-unused-vars
                  paginasTotales,
                  // eslint-disable-next-line no-unused-vars
                  count,
                  ...queries
                } = tramites;

                dispatch(
                  tramiteGetByUserId(user.id, {
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
                } = tramites;

                dispatch(
                  tramiteGetByUserId(user.id, {
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
                } = tramites;

                dispatch(
                  tramiteGetByUserId(user.id, {
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
                } = tramites;

                dispatch(
                  tramiteGetByUserId(user.id, {
                    ...queries,
                    pagina: value + 1
                  })
                );
              }}
            />
          ) : (
            <div />
          )}
        </Card.Footer>
      </AdvanceTableWrapper>
    </CustomCard>
  );
};

Procedures.propTypes = {
  byArea: PropTypes.bool
};

export default Procedures;
