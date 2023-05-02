import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FalconComponentCard from 'components/common/FalconComponentCard';
import { useEffect, useState } from 'react';
import { Breadcrumb } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getPermisos } from 'redux/permisosSlice';
import { deleteRol, getRoles } from 'redux/rolesSlice';
import ListaRoles from './ListaRoles';
import ConfirmarBorrado from './modals/ConfirmarBorrado';
import ViewRol from './modals/ViewRol';

const GestionarRoles = () => {
  const dispatch = useDispatch();

  const listaRoles = useSelector(state => state.roles.data);

  const token = localStorage.getItem('token');
  const [consultar, setConsultar] = useState(false);

  //Modal borrar rol
  const [openDelete, setOpenDelete] = useState(false);
  //Modal ver rol
  const [openView, setOpenView] = useState(false);

  useEffect(() => {
    dispatch(getPermisos(token));
    dispatch(getRoles(token));
  }, [consultar]);

  const initialRole = {
    id: '',
    name: '',
    roleToPermission: []
  };
  const [usedRole, setUsedRole] = useState(initialRole);

  //Handlers

  const openModalDelete = data => {
    setOpenDelete(true);
    setUsedRole({
      name: data.name,
      id: data.id,
      roleToPermission: data.permisos
    });
    setConsultar(!consultar);
  };

  const openModalView = data => {
    setOpenView(true);
    setUsedRole({
      name: data.name,
      id: data.id,
      roleToPermission: data.permisos
    });
    setConsultar(!consultar);
  };

  const closeModalDelete = name => {
    setOpenDelete(false);
    setUsedRole(initialRole);
  };

  const closeModalView = () => {
    setOpenView(false);
    setUsedRole(initialRole);
  };

  const handleDelete = async id => {
    await dispatch(deleteRol(id, token));
    setOpenDelete(false);
    setConsultar(!consultar);
  };

  return (
    <div className="ms-4">
      <FalconComponentCard>
        <FalconComponentCard.Body>
          <div className="d-flex w-100 align-items-center justify-content-between px-3 mt-4 mb-7">
            <h4 className="m-0">
              <FontAwesomeIcon
                icon="fa-shield-halved"
                className="text-primary"
                style={{ marginRight: 10 }}
              />
              Gestionar roles
            </h4>
            <Breadcrumb>
              <Breadcrumb.Item href="/permisos/roles" active>
                Gestionar roles
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div className="d-flex flex-wrap">
            <ListaRoles
              listaRoles={listaRoles}
              openDelete={openModalDelete}
              openView={openModalView}
            />
          </div>
          {openDelete && (
            <ConfirmarBorrado
              closeModalDelete={closeModalDelete}
              handleDelete={handleDelete}
              rol={usedRole}
            />
          )}
          {openView && (
            <ViewRol closeModalView={closeModalView} rol={usedRole} />
          )}
        </FalconComponentCard.Body>
      </FalconComponentCard>
    </div>
  );
};

export default GestionarRoles;
