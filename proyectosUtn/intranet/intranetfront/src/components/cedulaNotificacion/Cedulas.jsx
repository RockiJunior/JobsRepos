import AdvanceTable from 'components/common/advance-table/AdvanceTable';
import AdvanceTablePagination from 'components/common/advance-table/AdvanceTablePagination';
import AdvanceTableWrapper from 'components/common/advance-table/AdvanceTableWrapper';

import React, { useEffect } from 'react';
import { Button, Card, Form, InputGroup, Offcanvas } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import SoftBadge from 'components/common/SoftBadge';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { getPartners } from 'redux/actions/area';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  cedulaGetAllByArea,
  cedulaGetByEmpleadoId
} from 'redux/actions/cedula';
import AreaPartnersToggle from 'components/area/partners/AreaPartnersToggle';
import AreaPartners from 'components/area/partners/AreaPartners';
import permisosData from 'data/permisos';
import { CustomCard } from 'components/common/CustomCard';
import CustomMessage from 'components/varios/messages/CustomMessage';
import { FaRegFileAlt } from 'react-icons/fa';

const StatusBadge = ({ value }) => (
  <SoftBadge
    bg={classNames({
      success: value === 'completado',
      warning: value === 'pendiente',
      danger: value === 'rechazado'
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
    Header: 'Titulo'
  },
  {
    accessor: 'usuario.nombre',
    Header: 'Nombre'
  },
  {
    accessor: 'usuario.apellido',
    Header: 'Apellido'
  },
  {
    accessor: 'usuario.dni',
    Header: 'DNI'
  },
  {
    accessor: 'createdAt',
    Header: 'Fecha de creación',
    Cell: ({ value }) => {
      return new Date(value).toLocaleDateString();
    }
  }
];

const Cedulas = ({ byArea }) => {
  const navigate = useNavigate();

  const { cedulas } = useSelector(state => state.cedulaReducer);
  const { user } = useSelector(state => state.authReducer);
  const { partners } = useSelector(state => state.areaReducer);
  const [search, setSearch] = useState('');
  const [flagSearch, setFlagSearch] = useState(false);
  const [limit, setLimit] = useState(10);

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
    dispatch(byArea ? cedulaGetAllByArea() : cedulaGetByEmpleadoId(bandeja.id));
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
        user.empleado.permisos.includes(permisosData.cedulas.ver_cedulas_area)
      );
  }, [user]);

  useEffect(() => {
    setLimit(cedulas.limite);
  }, [cedulas.limite]);

  return (
    <>
      <AdvanceTableWrapper
        columns={columns}
        data={cedulas.cedulas || []}
        perPage={limit}
        sortable
        manualSortBy
        onChangeSort={sortBy => {
          const {
            // eslint-disable-next-line no-unused-vars
            cedulas: u,
            // eslint-disable-next-line no-unused-vars
            paginasTotales,
            // eslint-disable-next-line no-unused-vars
            count,
            ...queries
          } = cedulas;
          if (sortBy.length) {
            dispatch(
              byArea
                ? cedulaGetAllByArea({
                    ...queries,
                    pagina: 1,
                    columna: sortBy[0].id,
                    orden: sortBy[0].desc ? 'desc' : 'asc'
                  })
                : cedulaGetByEmpleadoId(bandeja.id, {
                    ...queries,
                    pagina: 1,
                    columna: sortBy[0].id,
                    orden: sortBy[0].desc ? 'desc' : 'asc'
                  })
            );
          } else {
            dispatch(
              byArea
                ? cedulaGetAllByArea({
                    ...queries,
                    pagina: 1,
                    columna: undefined,
                    orden: undefined
                  })
                : cedulaGetByEmpleadoId(bandeja.id, {
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
          icon="file-alt"
          title={
            byArea
              ? 'Cédulas en el área de ' + user.empleado.area.nombre
              : `Cédulas asignadas a ${bandeja.nombre} ${bandeja.apellido}`
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
                        cedulas: u,
                        // eslint-disable-next-line no-unused-vars
                        paginasTotales,
                        // eslint-disable-next-line no-unused-vars
                        count,
                        ...queries
                      } = cedulas;

                      dispatch(
                        byArea
                          ? cedulaGetAllByArea({
                              ...queries,
                              pagina: 1,
                              busqueda: ''
                            })
                          : cedulaGetByEmpleadoId(bandeja.id, {
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
                        cedulas: u,
                        // eslint-disable-next-line no-unused-vars
                        paginasTotales,
                        // eslint-disable-next-line no-unused-vars
                        count,
                        ...queries
                      } = cedulas;

                      dispatch(
                        byArea
                          ? cedulaGetAllByArea({
                              ...queries,
                              pagina: 1,
                              busqueda: search
                            })
                          : cedulaGetByEmpleadoId(bandeja.id, {
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

          <Card.Body className="p-0">
            {cedulas.cedulas?.length ? (
              <AdvanceTable
                table
                headerClassName="bg-white text-900 text-nowrap align-middle"
                rowClassName="align-middle white-space-nowrap"
                tableProps={{
                  className: 'fs--1 mb-0 overflow-hidden'
                }}
                rowOnClick={row => navigate(`/cedulas/${row.id}`)}
              />
            ) : (
              <CustomMessage
                ReactIcon={FaRegFileAlt}
                title="Atención!"
                message="No se encontraron cédulas."
              />
            )}
          </Card.Body>
          <Card.Footer className="p-3">
            {!!cedulas.cedulas?.length && cedulas.paginasTotales > 1 ? (
              <AdvanceTablePagination
                canPreviousPage={cedulas.pagina !== 1}
                canNextPage={cedulas.pagina !== cedulas.paginasTotales}
                pageCount={cedulas.paginasTotales}
                pageIndex={cedulas.pagina}
                limit={cedulas.limite}
                onChangeLimit={limit => {
                  const {
                    // eslint-disable-next-line no-unused-vars
                    cedulas: u,
                    // eslint-disable-next-line no-unused-vars
                    paginasTotales,
                    // eslint-disable-next-line no-unused-vars
                    count,
                    ...queries
                  } = cedulas;

                  dispatch(
                    byArea
                      ? cedulaGetAllByArea({
                          ...queries,
                          pagina: 1,
                          limite: limit
                        })
                      : cedulaGetByEmpleadoId(bandeja.id, {
                          ...queries,
                          pagina: 1,
                          limite: limit
                        })
                  );
                }}
                nextPage={() => {
                  const {
                    // eslint-disable-next-line no-unused-vars
                    cedulas: u,
                    // eslint-disable-next-line no-unused-vars
                    paginasTotales,
                    // eslint-disable-next-line no-unused-vars
                    count,
                    pagina,
                    ...queries
                  } = cedulas;

                  dispatch(
                    byArea
                      ? cedulaGetAllByArea({
                          ...queries,
                          pagina: pagina + 1
                        })
                      : cedulaGetByEmpleadoId(bandeja.id, {
                          ...queries,
                          pagina: pagina + 1
                        })
                  );
                }}
                previousPage={() => {
                  const {
                    // eslint-disable-next-line no-unused-vars
                    cedulas: u,
                    // eslint-disable-next-line no-unused-vars
                    paginasTotales,
                    // eslint-disable-next-line no-unused-vars
                    count,
                    pagina,
                    ...queries
                  } = cedulas;

                  dispatch(
                    byArea
                      ? cedulaGetAllByArea({
                          ...queries,
                          pagina: pagina - 1
                        })
                      : cedulaGetByEmpleadoId(bandeja.id, {
                          ...queries,
                          pagina: pagina - 1
                        })
                  );
                }}
                gotoPage={value => {
                  const {
                    // eslint-disable-next-line no-unused-vars
                    cedulas: u,
                    // eslint-disable-next-line no-unused-vars
                    paginasTotales,
                    // eslint-disable-next-line no-unused-vars
                    count,
                    // eslint-disable-next-line no-unused-vars
                    pagina,
                    ...queries
                  } = cedulas;

                  dispatch(
                    byArea
                      ? cedulaGetAllByArea({
                          ...queries,
                          pagina: value + 1
                        })
                      : cedulaGetByEmpleadoId(bandeja.id, {
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

      {puedeVerArea && (
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
                type="cedulas"
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

Cedulas.propTypes = {
  byArea: PropTypes.bool
};

export default Cedulas;
