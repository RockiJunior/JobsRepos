import AdvanceTable from 'components/common/advance-table/AdvanceTable';
import AdvanceTablePagination from 'components/common/advance-table/AdvanceTablePagination';
import AdvanceTableWrapper from 'components/common/advance-table/AdvanceTableWrapper';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import {
  Button,
  Card,
  Col,
  Dropdown,
  Form,
  InputGroup,
  OverlayTrigger,
  Row,
  Tooltip
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import SoftBadge from 'components/common/SoftBadge';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CustomCard } from 'components/common/CustomCard';
import {
  saGetAllTramites,
  saGetAreas,
  saGetTramitesByArea
} from 'redux/actions/superadmin';
import CustomMessage from 'components/varios/messages/CustomMessage';
import { TbPlaylistX } from 'react-icons/tb';

const StatusBadge = ({ value }) => (
  <SoftBadge
    bg={classNames({
      success: value === 'aprobado',
      warning: value === 'cancelado',
      danger: value === 'rechazado',
      primary: value === 'pendiente'
    })}
    className="fs--1"
  >
    {value[0].toUpperCase() + value.substring(1)}
  </SoftBadge>
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
    accessor: 'pasoActual',
    Header: 'Paso Actual',
    Cell: PasoBadge
  },
  {
    accessor: 'tiempoTotal',
    Header: 'Tiempo Total',
    Cell: ({
      row: {
        original: { createdAt }
      }
    }) => {
      const diff = dayjs().diff(dayjs(createdAt), 'days');
      return `${diff} ${diff === 1 ? 'día' : 'días'}`;
    },
    disableSortBy: true
  },
  {
    accessor: 'titulo',
    Header: 'Tipo de Trámite'
  },
  {
    accessor: 'area',
    Header: 'Área Actual',
    Cell: ({ value }) => (value?.length ? value.join(', ') : 'Sin área'),
    disableSortBy: true
  },
  {
    accessor: 'estado',
    Header: 'Estado',
    Cell: StatusBadge
  }
];

const TramitesSA = () => {
  const navigate = useNavigate();

  const { tramites, areas } = useSelector(state => state.saReducer);

  const [search, setSearch] = useState('');
  const [flagSearch, setFlagSearch] = useState(false);
  const [limit, setLimit] = useState(10);
  const [filter, setFilter] = useState(null);
  const [area, setArea] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    setLimit(tramites.limite);
  }, [tramites.limite]);

  useEffect(() => {
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
      area
        ? saGetTramitesByArea(area.id, {
            ...queries,
            pagina: 1,
            busqueda: undefined,
            filter
          })
        : saGetAllTramites({
            ...queries,
            pagina: 1,
            busqueda: undefined,
            filter
          })
    );

    dispatch(saGetAreas());
  }, [filter, area]);

  return (
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
            saGetAllTramites({
              ...queries,
              pagina: 1,
              columna: sortBy[0].id,
              orden: sortBy[0].desc ? 'desc' : 'asc'
            })
          );
        } else {
          dispatch(
            saGetAllTramites({
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
      <CustomCard
        icon="stamp"
        title="Trámites"
        subtitle="Visualice los trámites de distintas áreas"
      >
        <Card.Header>
          <Row>
            <Col
              xs={6}
              lg={4}
              className="d-flex justify-content-start align-items-center"
            >
              <div>
                <Form.Label className="mb-0">
                  <strong>Área:</strong>
                </Form.Label>
                <Dropdown>
                  <Dropdown.Toggle
                    size="sm"
                    style={{ boxShadow: 'none', border: 'none' }}
                  >
                    {area?.nombre || 'Sin seleccionar'}
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="bg-light p-0">
                    <Dropdown.Item
                      onClick={() => {
                        setArea(null);
                      }}
                    >
                      Ningun área
                    </Dropdown.Item>
                    {areas.map(a => (
                      <Dropdown.Item
                        key={a.id}
                        onClick={() => {
                          setArea(a);
                        }}
                      >
                        {a.nombre}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </Col>

            <Col
              xs={12}
              lg={4}
              className="order-first order-lg-0 d-flex align-items-center justify-content-center"
            >
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
                        } = tramites;

                        dispatch(
                          saGetAllTramites({
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
                          saGetAllTramites({
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
            </Col>

            <Col
              xs={6}
              lg={4}
              className="d-flex justify-content-end align-items-center"
            >
              <div>
                <Form.Label className="mb-0">
                  <strong>Estado:</strong>
                </Form.Label>

                <Dropdown className="me-2">
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
                        primary: filter?.split(':')[1] === 'pendiente'
                      })}
                      className={classNames('fs-0', {
                        'text-dark': !filter
                      })}
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
                      onClick={() => setFilter('estado:pendiente')}
                    >
                      <SoftBadge bg="primary" className="fs--1 w-100">
                        Pendientes
                      </SoftBadge>
                    </Dropdown.Item>

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

                    <Dropdown.Item
                      className="p-1"
                      onClick={() => setFilter(null)}
                    >
                      <SoftBadge
                        bg="secondary"
                        className="fs--1 w-100 text-dark"
                      >
                        Todos
                      </SoftBadge>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </Col>
          </Row>
        </Card.Header>

        <Card.Body className="p-0">
          {tramites.tramites?.length ? (
            <AdvanceTable
              table
              headerClassName="bg-white text-900 text-nowrap align-middle text-center"
              rowClassName="align-middle white-space-nowrap text-center"
              tableProps={{
                className: 'fs--1 mb-0 overflow-hidden'
              }}
              rowOnClick={row => navigate(`/tramites/${row.id}`)}
            />
          ) : (
            <CustomMessage
              ReactIcon={TbPlaylistX}
              title="Atención!"
              message="No se encontraron trámites."
            />
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
                  saGetAllTramites({
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
                  saGetAllTramites({
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
                  saGetAllTramites({
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
                  saGetAllTramites({
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
      </CustomCard>
    </AdvanceTableWrapper>
  );
};

TramitesSA.propTypes = {
  byArea: PropTypes.bool
};

export default TramitesSA;
