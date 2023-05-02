import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { Table } from 'react-bootstrap';
import DeleteModal from '../modals/DeleteModal';
import EditModal from '../modals/EditModal';
import ViewModal from '../modals/ViewModal';
import moment from 'moment';
moment.locale('es');
import 'moment/locale/es';
import ResendModal from '../modals/ResendModal';
import ActiveModal from '../modals/ActiveModal';
import ButtonDelete from 'utils/buttons/buttonDelete';
import ButtonEdit from 'utils/buttons/buttonEdit';
import ButtonView from 'utils/buttons/buttonView';
import ButtonActive from 'utils/buttons/buttonActive';
import ButtonResend from 'utils/buttons/buttonResend';
import { userColumns } from './usersColumns';
import ButtonCreate from 'utils/buttons/buttonCreate';
import ButtonDisable from 'utils/buttons/buttonDisable';
import DisableModal from '../modals/DisableModal';
import { HavePermission } from 'utils/HavePermission';
import { useSelector } from 'react-redux';
import UsersTable from './usersTable/UsersTable';

const ListaUsuarios = ({
  colaboradores,
  roles,
  branchOffices,
  switchNewUser,
  setSwitchNewUser,
  setModalShow
}) => {
  const userLogged = useSelector(state => state.login.currentUser);
  //UseStates
  const [filterUsers, setFilterUsers] = useState('all');
  const [searchUser, setSearchUser] = useState('');
  const [cleanList, setCleanList] = useState([]);
  const [data, setData] = useState([]);
  const [userSelected, setUserSelected] = useState({});

  //Modals states
  const [deleteModal, setDeleteModal] = useState(false);
  const [disableModal, setDisableModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [activeModal, setActiveModal] = useState(false);
  const [resendModal, setResendModal] = useState(false);

  //Functions
  const openDeleteModal = ({ id, firstName, lastName }) => {
    setUserSelected({ id, firstName, lastName });
    setDeleteModal(true);
  };

  const openDisableModal = user => {
    setUserSelected(user);
    setDisableModal(true);
  };

  const openViewModal = user => {
    setUserSelected(user);
    setViewModal(true);
  };

  const openEditModal = user => {
    setUserSelected(user);
    setEditModal(true);
  };

  const openActiveUser = user => {
    setUserSelected(user);
    setActiveModal(true);
  };

  const openResendModal = user => {
    setUserSelected(user);
    setResendModal(true);
  };

  //SetCollabs
  useEffect(() => {
    setCleanList(colaboradores);
  }, [colaboradores]);

  useEffect(() => {
    colaboradores.length > 0 && setCleanList(handleSearch);
  }, [searchUser, filterUsers]);

  useEffect(() => {
    setData(
      cleanList?.map(colab => {
        return {
          name: `${colab.firstName} ${colab.lastName}`,
          email: colab.email,
          dni: colab.dni,
          status: `${
            colab.status === 'pending'
              ? 'Pendiente'
              : colab.status === 'active'
              ? 'Activo'
              : colab.status === 'expired'
              ? 'Expirado'
              : colab.status === 'disabled' && 'Deshabilitado'
          }`,
          actions: [
            HavePermission('Users', userLogged) &&
              ButtonView(openViewModal, colab),
            HavePermission('Edit users', userLogged) && (
              <ButtonEdit funcion={openEditModal} data={colab.id} />
            ),
            colab.status !== 'disabled' &&
              HavePermission('Edit users', userLogged) &&
              ButtonDisable(openDisableModal, colab),
            colab.status === 'disabled' &&
              HavePermission('Edit users', userLogged) &&
              ButtonActive(openActiveUser, colab),
            colab.status === 'expired' &&
              HavePermission('Create users', userLogged) &&
              ButtonResend(openResendModal, colab),
            colab.status !== 'disabled' &&
              HavePermission('Delete users', userLogged) &&
              ButtonDelete(openDeleteModal, colab)
          ]
        };
      })
    );
  }, [cleanList]);

  const handleSearch = e => {
    let colabs = colaboradores.length > 0 ? colaboradores : cleanList;
    if (filterUsers !== 'all') {
      colabs = colabs.filter(user => user.status === filterUsers);
    }
    if (searchUser !== '') {
      colabs = colabs.filter(user => {
        const completeName = `${user.firstName} ${user.lastName}`;
        return (
          completeName.toLowerCase().includes(searchUser?.toLowerCase()) ||
          user.email.toLowerCase().includes(searchUser?.toLowerCase()) ||
          user.dni.toLowerCase().includes(searchUser?.toLowerCase())
        );
      });
    }
    return colabs;
  };

  return (
    <>
      <div>
        <div className="d-flex flex-row align-items-center justify-content-between align-text-center mb-4 w-100 px-3">
          <div className="d-flex align-items-center align-text-center">
            <FontAwesomeIcon
              icon="fa-solid fa-list"
              className="text-dark"
              style={{ marginRight: 10, fontSize: 20 }}
            />
            <h5 className="text-start m-0">Lista de usuarios</h5>
          </div>
          {userLogged &&
            HavePermission('Create users', userLogged) &&
            ButtonCreate('Crear un nuevo usuario', () => setModalShow(true))}
        </div>
        <div
          className="mt-2 mb-4 ms-3 d-flex justify-content-start align-items-end"
          style={{ gap: 30 }}
        >
          <div>
            <label>Filtrar por estado:</label>
            <select
              style={{ maxWidth: 250 }}
              className="form-select form-select-sm"
              aria-label="Default select example"
              defaultValue={filterUsers}
              onChange={e => {
                setFilterUsers(e.target.value);
              }}
            >
              <option value={'active'}>Activos</option>
              <option value={'pending'}>Pendientes</option>
              <option value={'expired'}>Expirados</option>
              <option value={'disabled'}>Deshabilitados</option>
              <option value={'all'}>Todos</option>
            </select>
          </div>
          <div style={{ maxWidth: 450, minWidth: 350 }}>
            <input
              type="text"
              className="form-control form-control-sm"
              required
              id="lastname"
              aria-describedby="lastnameHelp"
              placeholder="Buscar usuario"
              value={searchUser}
              onChange={e => setSearchUser(e.target.value)}
            />
          </div>
        </div>
        {data && userColumns && (
          <UsersTable columns={userColumns} data={data} />
        )}
      </div>
      {deleteModal && (
        <DeleteModal
          setShow={setDeleteModal}
          user={userSelected}
          switchNewUser={switchNewUser}
          setSwitchNewUser={setSwitchNewUser}
        />
      )}
      {viewModal && (
        <ViewModal
          setShow={setViewModal}
          user={userSelected}
          roles={roles}
          branchOffices={branchOffices}
        />
      )}
      {editModal && (
        <EditModal
          setShow={setEditModal}
          id={userSelected}
          roles={roles}
          switchNewUser={switchNewUser}
          setSwitchNewUser={setSwitchNewUser}
          realEstateBranchOffices={branchOffices}
        />
      )}
      {resendModal && (
        <ResendModal
          show={resendModal}
          setShow={setResendModal}
          user={userSelected}
          switchNewUser={switchNewUser}
          setSwitchNewUser={setSwitchNewUser}
        />
      )}
      {activeModal && (
        <ActiveModal
          show={activeModal}
          setShow={setActiveModal}
          user={userSelected}
          switchNewUser={switchNewUser}
          setSwitchNewUser={setSwitchNewUser}
        />
      )}
      {disableModal && (
        <DisableModal
          show={disableModal}
          setShow={setDisableModal}
          user={userSelected}
          switchNewUser={switchNewUser}
          setSwitchNewUser={setSwitchNewUser}
        />
      )}
    </>
  );
};

export default ListaUsuarios;
