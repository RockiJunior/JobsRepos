import AdvanceTable from 'components/common/advance-table/AdvanceTable';
import AdvanceTableWrapper from 'components/common/advance-table/AdvanceTableWrapper';
import React, { useEffect } from 'react';
import { Button, Card, Form, InputGroup } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AdvanceTablePagination from 'components/common/advance-table/AdvanceTablePagination';
import { CustomCard } from 'components/common/CustomCard';
import CustomMessage from 'components/varios/messages/CustomMessage';
import { FaUsers } from 'react-icons/fa';
import { getUsuariosConCarpeta } from 'redux/actions/users';
import { useNavigate } from 'react-router-dom';

const Usuarios = () => {
  const { usuarios } = useSelector(state => state.usersReducer);
  const { user } = useSelector(state => state.authReducer);

  const dispatch = useDispatch();

  useEffect(() => {
    user && dispatch(getUsuariosConCarpeta());
  }, []);

  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [flagSearch, setFlagSearch] = useState(false);

  const columns = [
    {
      accessor: 'nroUltimaMatricula',
      Header: 'Matrícula',
      Cell: ({ value }) => value || 'N/A'
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
      accessor: 'email',
      Header: 'Email'
    }
  ];

  useEffect(() => {
    setLimit(usuarios.limite);
  }, [usuarios.limite]);

  const handleSearch = () => {
    const {
      // eslint-disable-next-line no-unused-vars
      usuarios: u,
      // eslint-disable-next-line no-unused-vars
      paginasTotales,
      // eslint-disable-next-line no-unused-vars
      count,
      ...queries
    } = usuarios;

    dispatch(
      getUsuariosConCarpeta({
        ...queries,
        pagina: 1,
        busqueda: search
      })
    );

    setFlagSearch(true);
  };

  const navigate = useNavigate();

  return (
    <CustomCard icon="users" title="Usuarios">
      {!!usuarios.usuarios?.length && (
        <>
          <Card.Body className="d-flex justify-content-center pb-0">
            <InputGroup size="sm" style={{ width: 'auto' }}>
              <Form.Control
                type="text"
                placeholder="Buscar..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                disabled={flagSearch}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    handleSearch();
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
                        usuarios: u,
                        // eslint-disable-next-line no-unused-vars
                        paginasTotales,
                        // eslint-disable-next-line no-unused-vars
                        count,
                        ...queries
                      } = usuarios;

                      dispatch(
                        getUsuariosConCarpeta({
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
                    onClick={handleSearch}
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
              data={usuarios.usuarios || []}
              perPage={limit}
              sortable
              manualSortBy
              onChangeSort={sortBy => {
                const {
                  // eslint-disable-next-line no-unused-vars
                  usuarios: u,
                  // eslint-disable-next-line no-unused-vars
                  paginasTotales,
                  // eslint-disable-next-line no-unused-vars
                  count,
                  ...queries
                } = usuarios;
                if (sortBy.length) {
                  dispatch(
                    getUsuariosConCarpeta({
                      ...queries,
                      pagina: 1,
                      columna: sortBy[0].id,
                      orden: sortBy[0].desc ? 'desc' : 'asc'
                    })
                  );
                } else {
                  dispatch(
                    getUsuariosConCarpeta({
                      ...queries,
                      pagina: 1,
                      columna: 'id',
                      orden: 'asc'
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
                  className: 'fs--1 mb-0 overflow-hidden bg-light mb-3'
                }}
                rowOnClick={row => {
                  navigate(`/usuarios/${row.id}`);
                }}
              />
              <AdvanceTablePagination
                canPreviousPage={usuarios.pagina !== 1}
                canNextPage={usuarios.pagina !== usuarios.paginasTotales}
                pageCount={usuarios.paginasTotales}
                pageIndex={usuarios.pagina}
                limit={limit}
                onChangeLimit={limit => {
                  const {
                    // eslint-disable-next-line no-unused-vars
                    usuarios: u,
                    // eslint-disable-next-line no-unused-vars
                    paginasTotales,
                    // eslint-disable-next-line no-unused-vars
                    count,
                    ...queries
                  } = usuarios;

                  dispatch(
                    getUsuariosConCarpeta({
                      ...queries,
                      pagina: 1,
                      limite: limit
                    })
                  );
                }}
                nextPage={() => {
                  const {
                    // eslint-disable-next-line no-unused-vars
                    usuarios: u,
                    // eslint-disable-next-line no-unused-vars
                    paginasTotales,
                    // eslint-disable-next-line no-unused-vars
                    count,
                    pagina,
                    ...queries
                  } = usuarios;

                  dispatch(
                    getUsuariosConCarpeta({
                      ...queries,
                      pagina: pagina + 1
                    })
                  );
                }}
                previousPage={() => {
                  const {
                    // eslint-disable-next-line no-unused-vars
                    usuarios: u,
                    // eslint-disable-next-line no-unused-vars
                    paginasTotales,
                    // eslint-disable-next-line no-unused-vars
                    count,
                    pagina,
                    ...queries
                  } = usuarios;

                  dispatch(
                    getUsuariosConCarpeta({
                      ...queries,
                      pagina: pagina - 1
                    })
                  );
                }}
                gotoPage={value => {
                  const {
                    // eslint-disable-next-line no-unused-vars
                    usuarios: u,
                    // eslint-disable-next-line no-unused-vars
                    paginasTotales,
                    // eslint-disable-next-line no-unused-vars
                    count,
                    // eslint-disable-next-line no-unused-vars
                    pagina,
                    ...queries
                  } = usuarios;

                  dispatch(
                    getUsuariosConCarpeta({
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
      {!usuarios.usuarios?.length && (
        <CustomMessage
          ReactIcon={FaUsers}
          title="Atención!"
          message="No se encontraron usuarios."
        />
      )}
    </CustomCard>
  );
};

export default Usuarios;
