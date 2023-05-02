import AdvanceTable from 'components/common/advance-table/AdvanceTable';
import AdvanceTablePagination from 'components/common/advance-table/AdvanceTablePagination';
import AdvanceTableWrapper from 'components/common/advance-table/AdvanceTableWrapper';
import SoftBadge from 'components/common/SoftBadge';
import CustomMessage from 'components/varios/messages/CustomMessage';
import React, { useEffect, useState } from 'react';
import { FaRegUser } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { getWaitList } from 'redux/actions/eventos';
import ListaEsperaUsuariosModal from './ListaEsperaUsuariosModal';

export const ListaEspera = () => {
  const { listaEspera } = useSelector(state => state.eventoReducer);
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [eventName, setEventName] = useState('');
  const [tipoEventoId, setTipoEventoId] = useState(null);

  const [pageIndex, setPageIndex] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [pageArray, setPageArray] = useState([]);

  useEffect(() => {
    dispatch(getWaitList());
  }, []);

  useEffect(() => {
    if (listaEspera.length > 0) {
      setPageArray(listaEspera.slice((pageIndex - 1) * 10, pageIndex * 10));
      setPageCount(Math.ceil(listaEspera.length / 10));
    }
  }, [pageIndex, listaEspera]);

  useEffect(() => {
    if (tipoEventoId) {
      const evento = listaEspera.find(e => e.tipoEventoId === tipoEventoId);

      if (evento) {
        setUsuarios(evento.usuarios);
      }
    }
  }, [tipoEventoId, listaEspera]);

  const columns = [
    {
      Header: 'Tipo de evento',
      accessor: 'nombreTipoEvento'
    },
    {
      Header: 'Cantidad de matriculados',
      accessor: 'cantidadUsuarios',
      // eslint-disable-next-line react/prop-types
      Cell: ({ value }) => <SoftBadge className="fs--1">{value}</SoftBadge>
    }
  ];

  return listaEspera?.length ? (
    <AdvanceTableWrapper
      columns={columns}
      data={pageArray}
      pagination
      perPage={10}
    >
      <AdvanceTable
        table
        headerClassName="text-center"
        rowClassName="text-center fw-bold"
        noResponsive
        rowOnClick={row => {
          setShowModal(true);
          setEventName(row.nombreTipoEvento);
          setTipoEventoId(row.tipoEventoId);
        }}
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

      <ListaEsperaUsuariosModal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setUsuarios([]);
        }}
        usuarios={usuarios}
        eventName={eventName}
        tipoEventoId={tipoEventoId}
      />
    </AdvanceTableWrapper>
  ) : (
    <CustomMessage
      ReactIcon={FaRegUser}
      title="Atención!"
      message="No se encontraron usuarios en espera."
    />
  );
};
