import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import AdvanceTableWrapper from 'components/common/advance-table/AdvanceTableWrapper';
import AdvanceTable from 'components/common/advance-table/AdvanceTable';
import AdvanceTablePagination from 'components/common/advance-table/AdvanceTablePagination';
import InviteModal from './InviteModal';

const ListaEsperaUsuariosModal = ({
  show,
  onHide,
  usuarios,
  eventName,
  tipoEventoId
}) => {
  const [pageIndex, setPageIndex] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [pageArray, setPageArray] = useState([]);
  const [sort, setSort] = useState({ id: 'id', desc: false });

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [usuariosInvite, setUsuariosInvite] = useState([]);

  useEffect(() => {
    if (usuarios.length > 0) {
      setPageArray(
        usuarios
          .sort((a, b) => {
            if (!sort.desc) {
              return a[sort.id] > b[sort.id] ? 1 : -1;
            }
            return a[sort.id] < b[sort.id] ? 1 : -1;
          })
          .slice((pageIndex - 1) * 10, pageIndex * 10)
      );
      setPageCount(Math.ceil(usuarios.length / 10));
    }
  }, [pageIndex, usuarios, sort]);

  const columns = [
    {
      Header: 'Nombre',
      accessor: 'nombre'
    },
    {
      Header: 'Apellido',
      accessor: 'apellido'
    },
    {
      Header: 'DNI',
      accessor: 'dni'
    },
    {
      Header: 'Email',
      accessor: 'email'
    },
    {
      Header: 'Acciones',
      accessor: 'acciones',
      disableSortBy: true,
      // eslint-disable-next-line react/prop-types
      Cell: ({ row: { original } }) => (
        <Button
          size="sm"
          variant="primary"
          onClick={() => handleClick([original])}
        >
          Invitar a evento
        </Button>
      )
    }
  ];

  const handleClick = usuarios => {
    setUsuariosInvite(usuarios);
    setShowInviteModal(true);
  };

  return (
    <Modal
      size="xl"
      show={show}
      onHide={onHide}
      style={{ filter: showInviteModal ? 'blur(3px)' : '' }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Matriculados en espera para {eventName}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-0">
        <AdvanceTableWrapper
          columns={columns}
          data={pageArray}
          pagination
          perPage={10}
          sortable
          manualSortBy
          onChangeSort={info => {
            if (info[0]) {
              const { id, desc } = info[0];

              setSort({
                id,
                desc
              });

              setPageIndex(1);
            }
          }}
        >
          <AdvanceTable
            table
            headerClassName="text-center"
            rowClassName="text-center fw-bold"
          />

          <AdvanceTablePagination
            pageIndex={pageIndex}
            pageCount={pageCount}
            limit={10}
            gotoPage={pageIndex => {
              setPageIndex(pageIndex + 1);
            }}
            canNextPage={pageIndex < pageCount}
            canPreviousPage={pageIndex > 1}
            nextPage={() => {
              setPageIndex(pageIndex + 1);
            }}
            previousPage={() => {
              setPageIndex(pageIndex - 1);
            }}
          />
        </AdvanceTableWrapper>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>

        <Button onClick={() => handleClick(usuarios)}>
          Invitar a todos a un evento
        </Button>
      </Modal.Footer>

      <InviteModal
        show={showInviteModal}
        onHide={() => {
          setShowInviteModal(false);
          setUsuariosInvite([]);
        }}
        usuarios={usuariosInvite}
        tipoEventoId={tipoEventoId}
      />
    </Modal>
  );
};

ListaEsperaUsuariosModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  usuarios: PropTypes.array.isRequired,
  eventName: PropTypes.string.isRequire,
  tipoEventoId: PropTypes.number.isRequired
};

export default ListaEsperaUsuariosModal;
