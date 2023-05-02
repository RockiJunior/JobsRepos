import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AdvanceTable from 'components/common/advance-table/AdvanceTable';
import AdvanceTablePagination from 'components/common/advance-table/AdvanceTablePagination';
import AdvanceTableWrapper from 'components/common/advance-table/AdvanceTableWrapper';
import React, { useEffect, useState } from 'react';
import { Button, Form, InputGroup, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { saDeleteEmpleado, saGetEmpleados } from 'redux/actions/superadmin';
import PropTypes from 'prop-types';
import EmpleadoModal from './EmpleadoModal';
import { capitalize } from 'utils/capitalize';
import permisosData from 'data/permisos';
import { checkPermissions } from 'utils/checkPermissionsArea';

const Empleados = ({ createEmpleado, setCreateEmpleado }) => {
  const dispatch = useDispatch();
  const { empleados } = useSelector(state => state.saReducer);
  const { user } = useSelector(state => state.authReducer);

  const [editEmpleado, setEditEmpleado] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(null);

  const columns = [
    {
      Header: 'Nombre',
      accessor: 'usuario.nombre'
    },
    {
      Header: 'Apellido',
      accessor: 'usuario.apellido'
    },
    {
      Header: 'DNI',
      accessor: 'usuario.dni'
    },
    {
      Header: 'Email',
      accessor: 'usuario.email'
    },
    {
      Header: 'Roles',
      accessor: 'rolesNombres',
      Cell: ({ value }) => value.map(v => capitalize(v)).join(' / ')
    },
    {
      Header: 'Área',
      accessor: 'areaNombre'
    }
  ];

  const actions = {
    Header: 'Acciones',
    accessor: 'id',
    // eslint-disable-next-line react/prop-types
    Cell: ({ row: { original } }) => (
      <div className="d-flex">
        {checkPermissions(
          [permisosData.empleados.modificar_empleados],
          user.empleado
        ) && (
          <Button variant="link" onClick={() => setEditEmpleado(original)}>
            <FontAwesomeIcon icon="pencil" className="text-primary" />
          </Button>
        )}

        {checkPermissions(
          [permisosData.empleados.eliminar_empleados],
          user.empleado
        ) && (
          <Button
            variant="link"
            onClick={() => {
              setOpenDeleteModal(original);
            }}
          >
            <FontAwesomeIcon icon="trash" className="text-danger" />
          </Button>
        )}
      </div>
    )
  };

  useEffect(() => {
    dispatch(saGetEmpleados());
  }, []);

  const [search, setSearch] = useState('');
  const [flagSearch, setFlagSearch] = useState(false);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    setLimit(empleados.limite);
  }, [empleados.limite]);

  return (
    <div>
      <div className="d-flex justify-content-center">
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
                    empleados: u,
                    // eslint-disable-next-line no-unused-vars
                    paginasTotales,
                    // eslint-disable-next-line no-unused-vars
                    count,
                    ...queries
                  } = empleados;

                  dispatch(
                    saGetEmpleados({
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
                    empleados: u,
                    // eslint-disable-next-line no-unused-vars
                    paginasTotales,
                    // eslint-disable-next-line no-unused-vars
                    count,
                    ...queries
                  } = empleados;

                  dispatch(
                    saGetEmpleados({
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
      </div>

      <AdvanceTableWrapper
        columns={
          checkPermissions(
            [
              [
                permisosData.empleados.modificar_empleados,
                permisosData.empleados.eliminar_empleados
              ]
            ],
            user.empleado
          )
            ? [...columns, actions]
            : columns
        }
        data={empleados.empleados || []}
        perPage={limit}
        sortable
        manualSortBy
        onChangeSort={sortBy => {
          const {
            // eslint-disable-next-line no-unused-vars
            empleados: u,
            // eslint-disable-next-line no-unused-vars
            paginasTotales,
            // eslint-disable-next-line no-unused-vars
            count,
            ...queries
          } = empleados;
          if (sortBy.length) {
            const columna = sortBy[0].id;
            const lastIndex = columna.lastIndexOf('.');

            dispatch(
              saGetEmpleados({
                ...queries,
                pagina: 1,
                columna: columna.substring(lastIndex + 1),
                orden: sortBy[0].desc ? 'desc' : 'asc'
              })
            );
          } else {
            dispatch(
              saGetEmpleados({
                ...queries,
                pagina: 1,
                columna: 'usuarioId',
                orden: 'asc'
              })
            );
          }
        }}
        pagination
      >
        <AdvanceTable
          table
          noResponsive
          headerClassName="bg-white text-900 text-nowrap align-middle"
          rowClassName="align-middle white-space-nowrap"
          tableProps={{
            className: 'fs--1 mb-0 overflow-hidden'
          }}
          noPadding
        />

        <AdvanceTablePagination
          canPreviousPage={empleados.pagina !== 1}
          canNextPage={empleados.pagina !== empleados.paginasTotales}
          pageCount={empleados.paginasTotales}
          pageIndex={empleados.pagina}
          limit={empleados.limite}
          onChangeLimit={limit => {
            const {
              // eslint-disable-next-line no-unused-vars
              empleados: u,
              // eslint-disable-next-line no-unused-vars
              paginasTotales,
              // eslint-disable-next-line no-unused-vars
              count,
              ...queries
            } = empleados;

            dispatch(
              saGetEmpleados({
                ...queries,
                pagina: 1,
                limite: limit
              })
            );
          }}
          nextPage={() => {
            const {
              // eslint-disable-next-line no-unused-vars
              empleados: u,
              // eslint-disable-next-line no-unused-vars
              paginasTotales,
              // eslint-disable-next-line no-unused-vars
              count,
              pagina,
              ...queries
            } = empleados;

            dispatch(
              saGetEmpleados({
                ...queries,
                pagina: pagina + 1
              })
            );
          }}
          previousPage={() => {
            const {
              // eslint-disable-next-line no-unused-vars
              empleados: u,
              // eslint-disable-next-line no-unused-vars
              paginasTotales,
              // eslint-disable-next-line no-unused-vars
              count,
              pagina,
              ...queries
            } = empleados;

            dispatch(
              saGetEmpleados({
                ...queries,
                pagina: pagina - 1
              })
            );
          }}
          gotoPage={value => {
            const {
              // eslint-disable-next-line no-unused-vars
              empleados: u,
              // eslint-disable-next-line no-unused-vars
              paginasTotales,
              // eslint-disable-next-line no-unused-vars
              count,
              // eslint-disable-next-line no-unused-vars
              pagina,
              ...queries
            } = empleados;

            dispatch(
              saGetEmpleados({
                ...queries,
                pagina: value + 1
              })
            );
          }}
        />
      </AdvanceTableWrapper>

      {checkPermissions(
        [
          [
            permisosData.empleados.crear_empleados,
            permisosData.empleados.modificar_empleados
          ]
        ],
        user.empleado
      ) && (
        <EmpleadoModal
          show={createEmpleado || editEmpleado}
          onHide={() => {
            setCreateEmpleado(false);
            setEditEmpleado(false);
          }}
          hasLabel
          empleado={editEmpleado}
          empleados={empleados}
        />
      )}

      {openDeleteModal && (
        <Modal
          show={openDeleteModal}
          onHide={() => setOpenDeleteModal(false)}
          contentClassName="border"
          centered
        >
          <Modal.Header
            closeButton
            className="bg-light px-card border-bottom-0"
          >
            <h5 className="mb-0">
              ¿Está seguro que desea eliminar al empleado{' '}
              {openDeleteModal.usuario.nombre}{' '}
              {openDeleteModal.usuario.apellido}?
            </h5>
          </Modal.Header>
          <Modal.Body className="d-flex justify-content-center">
            <Button
              size="sm"
              variant="success"
              className="me-1"
              onClick={async () => {
                await dispatch(saDeleteEmpleado(openDeleteModal.usuarioId));
                await dispatch(saGetEmpleados());
                setOpenDeleteModal(null);
              }}
            >
              <span>Si</span>
            </Button>

            <Button
              className="ms-1"
              size="sm"
              variant="danger"
              onClick={() => setOpenDeleteModal(false)}
            >
              <span>No</span>
            </Button>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
};

Empleados.propTypes = {
  createEmpleado: PropTypes.bool,
  setCreateEmpleado: PropTypes.func.isRequired
};

export default Empleados;
