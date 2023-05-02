import AdvanceTable from 'components/common/advance-table/AdvanceTable';
import AdvanceTableWrapper from 'components/common/advance-table/AdvanceTableWrapper';
import React, { useEffect } from 'react';
import { Button, Card, Form, InputGroup } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AdvanceTablePagination from 'components/common/advance-table/AdvanceTablePagination';
import {
  transaccionGetAll,
  transaccionGetAllByAdminId
} from 'redux/actions/transaccion';
import ViewTransaction from './components/ViewTransaction';
import { CustomCard } from 'components/common/CustomCard';
import CustomMessage from 'components/varios/messages/CustomMessage';
import { RiBillLine } from 'react-icons/ri';

const OpenTransacction = ({
  handleClick,
  row: {
    original: { id }
  }
}) => (
  <Button size="sm" onClick={() => handleClick(id)}>
    Ver transacción
  </Button>
);

OpenTransacction.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      id: PropTypes.number.isRequired
    })
  }),
  handleClick: PropTypes.func.isRequired
};

const Transactions = ({ all }) => {
  const { transacciones } = useSelector(state => state.transaccionReducer);
  const { user } = useSelector(state => state.authReducer);

  const dispatch = useDispatch();

  useEffect(() => {
    user &&
      dispatch(all ? transaccionGetAll() : transaccionGetAllByAdminId(user.id));
  }, []);

  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [flagSearch, setFlagSearch] = useState(false);

  const [transactionId, setTransactionId] = useState(null);

  const handleClick = id => {
    setTransactionId(id);
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
      accessor: 'email',
      Header: 'Email'
    },
    {
      accessor: 'fecha',
      Header: 'Fecha de creación',
      Cell: ({ value }) => {
        return new Date(value).toLocaleDateString();
      }
    },
    {
      accessor: 'monto',
      Header: 'Monto',
      Cell: ({ value }) => {
        return `$${value.toFixed(2)}`;
      }
    },
    {
      accessor: 'action',
      Header: 'Acciones',
      Cell: props => <OpenTransacction {...props} handleClick={handleClick} />,
      disableSortBy: true
    }
  ];

  useEffect(() => {
    setLimit(transacciones.limite);
  }, [transacciones.limite]);

  const handleSearch = () => {
    const {
      // eslint-disable-next-line no-unused-vars
      transacciones: u,
      // eslint-disable-next-line no-unused-vars
      paginasTotales,
      // eslint-disable-next-line no-unused-vars
      count,
      ...queries
    } = transacciones;

    dispatch(
      all
        ? transaccionGetAll({
            ...queries,
            pagina: 1,
            busqueda: search
          })
        : transaccionGetAllByAdminId(user.id, {
            ...queries,
            pagina: 1,
            busqueda: search
          })
    );

    setFlagSearch(true);
  };

  return (
    <CustomCard icon="credit-card" title="Transacciones">
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
                    transacciones: u,
                    // eslint-disable-next-line no-unused-vars
                    paginasTotales,
                    // eslint-disable-next-line no-unused-vars
                    count,
                    ...queries
                  } = transacciones;

                  dispatch(
                    all
                      ? transaccionGetAll({
                          ...queries,
                          pagina: 1,
                          busqueda: ''
                        })
                      : transaccionGetAllByAdminId(user.id, {
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
              <Button size="sm" className="rounded-0" onClick={handleSearch}>
                <FontAwesomeIcon icon="search" />
              </Button>
            )}
          </InputGroup.Text>
        </InputGroup>
      </Card.Body>
      <Card.Body>
        {transacciones.transacciones?.length ? (
          <AdvanceTableWrapper
            columns={
              all
                ? [
                    {
                      accessor: 'empleado',
                      Header: 'Asignada a'
                    },

                    ...columns
                  ]
                : columns
            }
            data={transacciones.transacciones || []}
            perPage={limit}
            sortable
            manualSortBy
            onChangeSort={sortBy => {
              const {
                // eslint-disable-next-line no-unused-vars
                transacciones: u,
                // eslint-disable-next-line no-unused-vars
                paginasTotales,
                // eslint-disable-next-line no-unused-vars
                count,
                ...queries
              } = transacciones;
              if (sortBy.length) {
                dispatch(
                  all
                    ? transaccionGetAll({
                        ...queries,
                        pagina: 1,
                        columna: sortBy[0].id,
                        orden: sortBy[0].desc ? 'desc' : 'asc'
                      })
                    : transaccionGetAllByAdminId(user.id, {
                        ...queries,
                        pagina: 1,
                        columna: sortBy[0].id,
                        orden: sortBy[0].desc ? 'desc' : 'asc'
                      })
                );
              } else {
                dispatch(
                  all
                    ? transaccionGetAll({
                        ...queries,
                        pagina: 1,
                        columna: 'id',
                        orden: 'asc'
                      })
                    : transaccionGetAllByAdminId(user.id, {
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
            />
            <AdvanceTablePagination
              canPreviousPage={transacciones.pagina !== 1}
              canNextPage={
                transacciones.pagina !== transacciones.paginasTotales
              }
              pageCount={transacciones.paginasTotales}
              pageIndex={transacciones.pagina}
              limit={limit}
              onChangeLimit={limit => {
                const {
                  // eslint-disable-next-line no-unused-vars
                  transacciones: u,
                  // eslint-disable-next-line no-unused-vars
                  paginasTotales,
                  // eslint-disable-next-line no-unused-vars
                  count,
                  ...queries
                } = transacciones;

                dispatch(
                  all
                    ? transaccionGetAll({
                        ...queries,
                        pagina: 1,
                        limite: limit
                      })
                    : transaccionGetAllByAdminId(user.id, {
                        ...queries,
                        pagina: 1,
                        limite: limit
                      })
                );
              }}
              nextPage={() => {
                const {
                  // eslint-disable-next-line no-unused-vars
                  transacciones: u,
                  // eslint-disable-next-line no-unused-vars
                  paginasTotales,
                  // eslint-disable-next-line no-unused-vars
                  count,
                  pagina,
                  ...queries
                } = transacciones;

                dispatch(
                  all
                    ? transaccionGetAll({ ...queries, pagina: pagina + 1 })
                    : transaccionGetAllByAdminId(user.id, {
                        ...queries,
                        pagina: pagina + 1
                      })
                );
              }}
              previousPage={() => {
                const {
                  // eslint-disable-next-line no-unused-vars
                  transacciones: u,
                  // eslint-disable-next-line no-unused-vars
                  paginasTotales,
                  // eslint-disable-next-line no-unused-vars
                  count,
                  pagina,
                  ...queries
                } = transacciones;

                dispatch(
                  all
                    ? transaccionGetAll({ ...queries, pagina: pagina - 1 })
                    : transaccionGetAllByAdminId(user.id, {
                        ...queries,
                        pagina: pagina - 1
                      })
                );
              }}
              gotoPage={value => {
                const {
                  // eslint-disable-next-line no-unused-vars
                  transacciones: u,
                  // eslint-disable-next-line no-unused-vars
                  paginasTotales,
                  // eslint-disable-next-line no-unused-vars
                  count,
                  // eslint-disable-next-line no-unused-vars
                  pagina,
                  ...queries
                } = transacciones;

                dispatch(
                  all
                    ? transaccionGetAll({
                        ...queries,
                        pagina: value + 1
                      })
                    : transaccionGetAllByAdminId(user.id, {
                        ...queries,
                        pagina: value + 1
                      })
                );
              }}
            />
          </AdvanceTableWrapper>
        ) : (
          <CustomMessage
            ReactIcon={RiBillLine}
            title="Atención!"
            message="No se encontraron transacciones."
          />
        )}
      </Card.Body>

      {
        <ViewTransaction
          transactionId={transactionId}
          setTransactionId={setTransactionId}
          all={all}
        />
      }
    </CustomCard>
  );
};

Transactions.propTypes = {
  all: PropTypes.bool
};

export default Transactions;
