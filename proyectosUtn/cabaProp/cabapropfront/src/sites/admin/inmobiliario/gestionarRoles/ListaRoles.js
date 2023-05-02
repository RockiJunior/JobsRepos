import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ButtonCreate from 'utils/buttons/buttonCreate';
import ButtonDelete from 'utils/buttons/buttonDelete';
import ButtonEdit from 'utils/buttons/buttonEdit';
import ButtonView from 'utils/buttons/buttonView';
import { HavePermission } from 'utils/HavePermission';

const ListaRoles = ({ listaRoles, openDelete, openView }) => {
  const navigate = useNavigate();
  const userLogged = useSelector(state => state.login.currentUser);

  const handleNavigate = id => {
    navigate(`/permisos/roles/editar/${id}`);
  };

  return (
    <div className="w-100">
      <div className="d-flex flex-row align-items-center justify-content-between align-text-center mb-4 w-100 px-3">
        <div className="d-flex align-items-center align-text-center">
          <FontAwesomeIcon
            icon="fa-solid fa-list"
            className="text-dark"
            style={{ marginRight: 10, fontSize: 20 }}
          />

          <h5 className="text-start m-0">Lista de roles</h5>
        </div>
        {userLogged && HavePermission('Create roles', userLogged) && (
          <ButtonCreate
            text="Crear un nuevo rol"
            funcion={() => navigate('/permisos/roles/crear')}
          />
        )}
      </div>

      <div className="d-flex flex-row flex-wrap">
        {listaRoles.map(({ name, id, roleToPermission }) => {
          return (
            <div
              className="d-flex justify-content-end align-items center text-align-center me-4 mb-4 px-3 py-3 border rounded-4 border-light-5"
              key={id}
            >
              <h6 className="d-flex flex-row m-0 pt-1 text-align-center">
                {name}
              </h6>

              <div>
                {HavePermission('Edit roles', userLogged) && (
                  <ButtonView
                    funcion={openView}
                    data={{ name: name, id: id, permisos: roleToPermission }}
                  />
                )}

                {HavePermission('Edit roles', userLogged) && (
                  <ButtonEdit data={id} funcion={handleNavigate} />
                )}

                {HavePermission('Delete roles', userLogged) && (
                  <ButtonDelete
                    funcion={openDelete}
                    data={{
                      name: name,
                      id: id,
                      permisos: roleToPermission
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ListaRoles;
