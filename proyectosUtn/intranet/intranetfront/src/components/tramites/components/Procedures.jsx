import AdvanceTable from 'components/common/advance-table/AdvanceTable';
import AdvanceTablePagination from 'components/common/advance-table/AdvanceTablePagination';
import AdvanceTableWrapper from 'components/common/advance-table/AdvanceTableWrapper';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import {
  Button,
  Card,
  Dropdown,
  Form,
  InputGroup,
  Offcanvas,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import SoftBadge from 'components/common/SoftBadge';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  tramitesGetAllByAdminId,
  tramitesGetAllByArea
} from 'redux/actions/tramite';
import PropTypes from 'prop-types';
import AreaPartners from '../area/partners/AreaPartners';
import { getPartners } from 'redux/actions/area';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AreaPartnersToggle from '../area/partners/AreaPartnersToggle';
import permisosData from 'data/permisos';
import { CustomCard } from 'components/common/CustomCard';
import CustomMessage from 'components/varios/messages/CustomMessage';
import { FaStamp } from 'react-icons/fa';

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
    accessor: 'numero',
    Header: 'Número'
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
    accessor: 'estado',
    Header: 'Estado',
    Cell: StatusBadge
  }
];

const Procedures = ({ byArea }) => {
  const navigate = useNavigate();

  const { tramites } = useSelector(state => state.tramiteReducer);
  const { user } = useSelector(state => state.authReducer);
  const { partners } = useSelector(state => state.areaReducer);
  const [search, setSearch] = useState('');
  const [flagSearch, setFlagSearch] = useState(false);
  const [limit, setLimit] = useState(10);
  const [filter, setFilter] = useState(byArea ? null : 'estado:pendiente');

  const [showAreaPartners, setShowAreaPartners] = useState(false);

  const dispatch = useDispatch();

  const [bandeja, setBandeja] = useState({
    id: user.id,
    nombre: user.nombre,
    apellido: user.apellido
  });
  const [puedeVerArea, setPuedeVerArea] = useState(false);

  useEffect(() => {
    dispatch(getPartners());
  }, []);

  useEffect(() => {
    dispatch(
      byArea
        ? tramitesGetAllByArea()
        : tramitesGetAllByAdminId(bandeja.id, { filter })
    );
  }, [bandeja]);

  useEffect(() => {
    user &&
      setBandeja({
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido
      });

    user.empleado?.permisos &&
      setPuedeVerArea(
        user.empleado.permisos.includes(permisosData.tramites.ver_tramites_area)
      );
  }, [user]);

  useEffect(() => {
    setLimit(tramites.limite);
  }, [tramites.limite]);

  useEffect(() => {
    if (!byArea) {
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
          tramitesGetAllByAdminId(bandeja.id, {
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
          tramitesGetAllByAdminId(bandeja.id, {
            ...queries,
            pagina: 1,
            busqueda: undefined,
            filter
          })
        );
      }
    }
  }, [filter]);

  return (
    <>
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
              byArea
                ? tramitesGetAllByArea({
                    ...queries,
                    pagina: 1,
                    columna: sortBy[0].id,
                    orden: sortBy[0].desc ? 'desc' : 'asc'
                  })
                : tramitesGetAllByAdminId(bandeja.id, {
                    ...queries,
                    pagina: 1,
                    columna: sortBy[0].id,
                    orden: sortBy[0].desc ? 'desc' : 'asc'
                  })
            );
          } else {
            dispatch(
              byArea
                ? tramitesGetAllByArea({
                    ...queries,
                    pagina: 1,
                    columna: undefined,
                    orden: undefined
                  })
                : tramitesGetAllByAdminId(bandeja.id, {
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
          title={
            byArea
              ? 'Trámites en el área de ' + user.empleado.area.nombre
              : `Trámites asignados a ${bandeja.nombre} ${bandeja.apellido}`
          }
        >
          <Card.Body className="d-flex justify-content-center">
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
                        byArea
                          ? tramitesGetAllByArea({
                              ...queries,
                              pagina: 1,
                              busqueda: ''
                            })
                          : tramitesGetAllByAdminId(bandeja.id, {
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
                        byArea
                          ? tramitesGetAllByArea({
                              ...queries,
                              pagina: 1,
                              busqueda: search
                            })
                          : tramitesGetAllByAdminId(bandeja.id, {
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

            {!byArea ? (
              <Dropdown
                style={{ position: 'absolute', right: 0 }}
                className="me-2"
              >
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
                    <SoftBadge bg="secondary" className="fs--1 w-100 text-dark">
                      Todos
                    </SoftBadge>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <div />
            )}
          </Card.Body>
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
                ReactIcon={FaStamp}
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
                    byArea
                      ? tramitesGetAllByArea({
                          ...queries,
                          pagina: 1,
                          limite: limit
                        })
                      : tramitesGetAllByAdminId(bandeja.id, {
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
                    byArea
                      ? tramitesGetAllByArea({
                          ...queries,
                          pagina: pagina + 1
                        })
                      : tramitesGetAllByAdminId(bandeja.id, {
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
                    byArea
                      ? tramitesGetAllByArea({
                          ...queries,
                          pagina: pagina - 1
                        })
                      : tramitesGetAllByAdminId(bandeja.id, {
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
                    byArea
                      ? tramitesGetAllByArea({
                          ...queries,
                          pagina: value + 1
                        })
                      : tramitesGetAllByAdminId(bandeja.id, {
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

      {puedeVerArea && !byArea && (
        <>
          <Offcanvas
            placement="end"
            show={showAreaPartners}
            onHide={() => setShowAreaPartners(false)}
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>
                Empleados de {user.empleado.area.nombre}
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <AreaPartners
                setShowAreaPartners={setShowAreaPartners}
                bandeja={bandeja}
                setBandeja={setBandeja}
                partners={partners ? partners : []}
              />
            </Offcanvas.Body>
          </Offcanvas>

          <AreaPartnersToggle
            setShowAreaPartners={setShowAreaPartners}
            area={user?.empleado.area.nombre}
          />
        </>
      )}
    </>
  );
};

Procedures.propTypes = {
  byArea: PropTypes.bool
};

export default Procedures;
