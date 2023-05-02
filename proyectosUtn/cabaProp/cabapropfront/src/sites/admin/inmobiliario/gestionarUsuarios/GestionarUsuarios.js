import React, { useEffect, useState } from 'react';
import { Breadcrumb, Button } from 'react-bootstrap';
import CreateModal from './modals/CreateModal';
import { useDispatch, useSelector } from 'react-redux';
import { getRoles } from 'redux/rolesSlice';
import ListaUsuarios from './tables/ListaUsuarios';
import { getColabs } from 'redux/colabsSlice';
import FalconComponentCard from 'components/common/FalconComponentCard';
import { getRealEstateData } from 'redux/realEstateSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const GestionarUsuarios = () => {
  const roles = useSelector(state => state.roles.data);
  const colaboradores = useSelector(state => state.colabs.data);
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');
  const [modalShow, setModalShow] = useState(false);
  const [switchNewUser, setSwitchNewUser] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const userLogged = useSelector(state => state.login.currentUser);
  const branchOffices = useSelector(
    state => state.realEstate.branchOfficesArray
  );

  useEffect(() => {
    if (userLogged?.realEstate.id) {
      dispatch(getRealEstateData(userLogged?.realEstate?.id, token));
      dispatch(getColabs(token));
      dispatch(getRoles(token));
    }
  }, [userLogged]);

  useEffect(() => {
    dispatch(getColabs(token));
  }, [switchNewUser]);

  return (
    <div className="ms-4">
      <FalconComponentCard>
        <FalconComponentCard.Body>
          <div className="d-flex w-100 align-items-center justify-content-between px-3 mt-4 mb-7">
            <h4 className="m-0">
              <FontAwesomeIcon
                icon="fa-users"
                className="text-primary"
                style={{ marginRight: 10 }}
              />
              Gestionar usuarios
            </h4>
            <Breadcrumb>
              <Breadcrumb.Item href="#" active>
                Gestionar usuarios
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
          {branchOffices && roles.length > 0 && (
            <CreateModal
              modalShow={modalShow}
              setModalShow={setModalShow}
              roles={roles}
              switchNewUser={switchNewUser}
              setSwitchNewUser={setSwitchNewUser}
              branchOffices={branchOffices}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          )}
          <ListaUsuarios
            colaboradores={colaboradores}
            roles={roles}
            setModalShow={setModalShow}
            branchOffices={branchOffices}
            switchNewUser={switchNewUser}
            setSwitchNewUser={setSwitchNewUser}
          />
        </FalconComponentCard.Body>
      </FalconComponentCard>
    </div>
  );
};

export default GestionarUsuarios;
