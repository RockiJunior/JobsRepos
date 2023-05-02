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
  Offcanvas
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import SoftBadge from 'components/common/SoftBadge';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  expedientesGetAllByAdminId,
  expedientesGetAllByArea
} from 'redux/actions/expediente';
import AreaPartners from 'components/area/partners/AreaPartners';
import AreaPartnersToggle from 'components/area/partners/AreaPartnersToggle';
import permisosData from 'data/permisos';
import { getPartners } from 'redux/actions/area';
import { CustomCard } from 'components/common/CustomCard';
import CustomMessage from 'components/varios/messages/CustomMessage';
import { FaBoxes } from 'react-icons/fa';

const estadosExpediente = [
  {
    value: 'proceso_legal_abierto',
    label: 'Proceso Legal Abierto'
  },
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
  <SoftBadge
    bg={classNames({
      warning: value === 'pendiente',
      success: value === 'finalizado',
      info: value === 'archivado' || value === 'proceso_legal_abierto'
    })}
    className="fs--1"
  >
    {value ? value[0].toUpperCase() + value.substring(1) : '-'}
  </SoftBadge>
);

StatusBadge.propTypes = {
  value: PropTypes.string
};

const columns = [
  {
    accessor: 'numero',
    Header: 'Número',
    disableSortBy: true
  },
  {
    accessor: 'createdAt',
    Header: 'Fecha de Creación',
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
    accessor: 'estado',
    Header: 'Estado',
    // eslint-disable-next-line react/prop-types
    Cell: ({ value }) => <StatusBadge value={value} />
  }
];

const Expedientes = ({ byArea }) => {
  const navigate = useNavigate();

  const { expedientes } = useSelector(state => state.expedienteReducer);
  const { user } = useSelector(state => state.authReducer);
  const { partners } = useSelector(state => state.areaReducer);

  const [search, setSearch] = useState('');
  const [flagSearch, setFlagSearch] = useState(false);
  const [limit, setLimit] = useState(10);
  const [filter, setFilter] = useState(null);

  const dispatch = useDispatch();

  const [puedeVerArea, setPuedeVerArea] = useState(false);
  const [showAreaPartners, setShowAreaPartners] = useState(false);

  const [bandeja, setBandeja] = useState({
    id: user.id,
    nombre: user.nombre,
    apellido: user.apellido
  });

  useEffect(() => {
    dispatch(getPartners());
  }, []);

  useEffect(() => {
    dispatch(
      byArea
        ? expedientesGetAllByArea({ filter })
        : expedientesGetAllByAdminId(bandeja.id, { filter })
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
        user.empleado.permisos.includes(
          permisosData.expedientes.ver_expedientes_area
        )
      );
  }, [user]);

  useEffect(() => {
    setLimit(expedientes.limite);
  }, [expedientes.limite]);

  useEffect(() => {
    if (search.length) {
      const {
        // eslint-disable-next-line no-unused-vars
        expedientes: u,
        // eslint-disable-next-line no-unused-vars
        paginasTotales,
        // eslint-disable-next-line no-unused-vars
        count,
        ...queries
      } = expedientes;

      dispatch(
        byArea
          ? expedientesGetAllByArea({
              ...queries,
              pagina: 1,
              busqueda: search,
              filter
            })
          : expedientesGetAllByAdminId(bandeja.id, {
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
        expedientes: u,
        // eslint-disable-next-line no-unused-vars
        paginasTotales,
        // eslint-disable-next-line no-unused-vars
        count,
        ...queries
      } = expedientes;

      dispatch(
        byArea
          ? expedientesGetAllByArea({
              ...queries,
              pagina: 1,
              busqueda: undefined,
              filter
            })
          : expedientesGetAllByAdminId(bandeja.id, {
              ...queries,
              pagina: 1,
              busqueda: undefined,
              filter
            })
      );
    }
  }, [filter]);

  return (
    <>
      <AdvanceTableWrapper
        columns={columns}
        data={expedientes.expedientes || []}
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
          } = expedientes;
          if (sortBy.length) {
            dispatch(
              byArea
                ? expedientesGetAllByArea({
                    ...queries,
                    pagina: 1,
                    columna: sortBy[0].id,
                    orden: sortBy[0].desc ? 'desc' : 'asc'
                  })
                : expedientesGetAllByAdminId(bandeja.id, {
                    ...queries,
                    pagina: 1,
                    columna: sortBy[0].id,
                    orden: sortBy[0].desc ? 'desc' : 'asc'
                  })
            );
          } else {
            dispatch(
              byArea
                ? expedientesGetAllByArea({
                    ...queries,
                    pagina: 1,
                    columna: undefined,
                    orden: undefined
                  })
                : expedientesGetAllByAdminId(bandeja.id, {
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
          icon="box-archive"
          title={
            byArea
              ? 'Expedientes en el área de ' + user.empleado.area.nombre
              : `Expedientes asignados a ${bandeja.nombre} ${bandeja.apellido}`
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
                        expedientes: u,
                        // eslint-disable-next-line no-unused-vars
                        paginasTotales,
                        // eslint-disable-next-line no-unused-vars
                        count,
                        ...queries
                      } = expedientes;

                      dispatch(
                        byArea
                          ? expedientesGetAllByArea({
                              ...queries,
                              pagina: 1,
                              busqueda: ''
                            })
                          : expedientesGetAllByAdminId(bandeja.id, {
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
                      } = expedientes;

                      dispatch(
                        byArea
                          ? expedientesGetAllByArea({
                              ...queries,
                              pagina: 1,
                              busqueda: search
                            })
                          : expedientesGetAllByAdminId(bandeja.id, {
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
                    primary: !filter,
                    warning: filter && filter.split(':')[1] === 'pendiente',
                    success: filter && filter.split(':')[1] === 'finalizado',
                    info: filter && filter.split(':')[1] === 'archivado'
                  })}
                  className="fs-0"
                >
                  {filter
                    ? estadosExpediente.find(
                        e => e.value === filter.split(':')[1]
                      ).label
                    : 'Todos'}
                </SoftBadge>
              </Dropdown.Toggle>
              <Dropdown.Menu className="bg-light p-0">
                {estadosExpediente.map(estado => (
                  <Dropdown.Item
                    key={estado.value}
                    className="p-1"
                    onClick={() => setFilter(`estado:${estado.value}`)}
                  >
                    <SoftBadge
                      bg={classNames({
                        warning: estado.value === 'pendiente',
                        success: estado.value === 'finalizado',
                        info: estado.value === 'archivado'
                      })}
                      className="fs--1 w-100"
                    >
                      {estado.label}
                    </SoftBadge>
                  </Dropdown.Item>
                ))}

                <Dropdown.Item className="p-1" onClick={() => setFilter(null)}>
                  <SoftBadge bg="primary" className="fs--1 w-100">
                    Todos
                  </SoftBadge>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Card.Body>

          <Card.Body className="p-0">
            {expedientes.expedientes?.length ? (
              <AdvanceTable
                table
                headerClassName="bg-white text-900 text-nowrap align-middle"
                rowClassName="align-middle white-space-nowrap"
                tableProps={{
                  className: 'fs--1 mb-0 overflow-hidden'
                }}
                rowOnClick={row => navigate(`/expedientes/${row.id}`)}
              />
            ) : (
              <CustomMessage
                ReactIcon={FaBoxes}
                title="Atención!"
                message="No se encontraron expedientes."
              />
            )}
          </Card.Body>

          <Card.Footer className="p-3">
            {!!expedientes.expedientes?.length &&
            expedientes.paginasTotales > 1 ? (
              <AdvanceTablePagination
                canPreviousPage={expedientes.pagina !== 1}
                canNextPage={expedientes.pagina !== expedientes.paginasTotales}
                pageCount={expedientes.paginasTotales}
                pageIndex={expedientes.pagina}
                limit={expedientes.limite}
                onChangeLimit={limit => {
                  const {
                    // eslint-disable-next-line no-unused-vars
                    expedientes: u,
                    // eslint-disable-next-line no-unused-vars
                    paginasTotales,
                    // eslint-disable-next-line no-unused-vars
                    count,
                    ...queries
                  } = expedientes;

                  dispatch(
                    byArea
                      ? expedientesGetAllByArea({
                          ...queries,
                          pagina: 1,
                          limite: limit
                        })
                      : expedientesGetAllByAdminId(bandeja.id, {
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
                  } = expedientes;

                  dispatch(
                    byArea
                      ? expedientesGetAllByArea({
                          ...queries,
                          pagina: pagina + 1
                        })
                      : expedientesGetAllByAdminId(bandeja.id, {
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
                  } = expedientes;

                  dispatch(
                    byArea
                      ? expedientesGetAllByArea({
                          ...queries,
                          pagina: pagina - 1
                        })
                      : expedientesGetAllByAdminId(bandeja.id, {
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
                  } = expedientes;

                  dispatch(
                    byArea
                      ? expedientesGetAllByArea({
                          ...queries,
                          pagina: value + 1
                        })
                      : expedientesGetAllByAdminId(bandeja.id, {
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
                type="expedientes"
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

Expedientes.propTypes = {
  byArea: PropTypes.bool
};

export default Expedientes;
