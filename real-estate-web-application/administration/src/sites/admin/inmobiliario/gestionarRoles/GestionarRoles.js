/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import ListaRoles from './ListaRoles';
import ConfirmarBorrado from './modals/ConfirmarBorrado';
import { useDispatch, useSelector } from 'react-redux';
import { getPermisos } from 'redux/permisosSlice';
import { deleteRol, getRoles } from 'redux/rolesSlice';
import FalconComponentCard from 'components/common/FalconComponentCard';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Breadcrumb } from 'react-bootstrap';

const GestionarRoles = () => {
  //Modal borrar rol
  const [openDelete, setOpenDelete] = useState(false)

  //Toast borrado
  const token = localStorage.getItem("token")
  const [consultar, setConsultar] = useState(false)

  const listaRoles = useSelector((state) => state.roles.data)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getPermisos(token))
    dispatch(getRoles(token))
  }, [consultar])


  const [rolBorrado, setRolBorrado] = useState({})


  //Handlers

  const openModalDelete = (data) => {
    setOpenDelete(true)
    setRolBorrado({
      name: data.name,
      id: data.id
    })
    setConsultar(!consultar)
  }

  const closeModalDelete = (name) => {
    setOpenDelete(false)
  }

  const handleDelete = async (id) => {
    await dispatch(deleteRol(id, token))
    setOpenDelete(false)
    setConsultar(!consultar)
  }

  return (
    <div className="ms-4">
      <FalconComponentCard>
        <FalconComponentCard.Body>
          <div className='d-flex w-100 align-items-center justify-content-between px-3 mt-4 mb-7'>
            <h4 className='m-0'>
              <FontAwesomeIcon icon='fa-shield-halved' className='text-primary' style={{ marginRight: 10 }} />
              Gestionar roles
            </h4>
            <Breadcrumb>
              <Breadcrumb.Item href="#" active>
                Gestionar roles
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div className='d-flex flex-wrap'>
            <ListaRoles
              listaRoles={listaRoles}
              openDelete={openModalDelete}
            />
          </div>
          {openDelete &&
            <ConfirmarBorrado
              closeModalDelete={closeModalDelete}
              handleDelete={handleDelete}
              rol={rolBorrado}
            />
          }
        </FalconComponentCard.Body>
      </FalconComponentCard>
    </div>
  );
};

export default GestionarRoles;
