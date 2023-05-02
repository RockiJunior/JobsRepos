import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { changeStatus, deleteProp } from 'redux/propsSlice';
import { HavePermission } from 'utils/HavePermission';
import ButtonActive from 'utils/buttons/buttonActive';
import ButtonDelete from 'utils/buttons/buttonDelete';
import ButtonEdit from 'utils/buttons/buttonEdit';
import ButtonFinish from 'utils/buttons/buttonFinish';
import ButtonPause from 'utils/buttons/buttonPause';
import ActiveModal from '../../../modals/ActiveModal';
import DeleteModal from '../../../modals/DeleteModal';
import FinishModal from '../../../modals/FinishModal';
import PauseModal from '../../../modals/PauseModal';
import ButtonView from 'utils/buttons/buttonView';

export const PropActions = ({
  prop,
  userLogged,
  setCheckChanges,
  checkChanges,
  token
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //Modales
  const [deleteModal, setDeleteModal] = useState(false);
  const [pauseModal, setPauseModal] = useState(false);
  const [finishModal, setFinishModal] = useState(false);
  const [activeModal, setActiveModal] = useState(false);
  //Propiedad elegida a modificar
  const [propSelected, setPropSelected] = useState({});

  const handleStatus = async data => {
    let status = data.status;
    let id = data.id;
    if (status === 'deleted') {
      const response = await dispatch(deleteProp(id, token));
      response < 400 && setCheckChanges(!checkChanges);
    } else {
      const response = await dispatch(changeStatus(id, status, token));
      response < 400 && setCheckChanges(!checkChanges);
    }
  };

  const handleEditButton = id => {
    navigate(`/propiedades/editar/${id}`);
  };

  const handleDeleteButton = prop => {
    setPropSelected(prop);
    setDeleteModal(true);
  };

  const handlePauseButton = prop => {
    setPropSelected(prop);
    setPauseModal(true);
  };

  const handleFinishButton = prop => {
    setPropSelected(prop);
    setFinishModal(true);
  };

  const handleActiveButton = prop => {
    setPropSelected(prop);
    setActiveModal(true);
  };

  return (
    <>
      <span className="d-flex gap-2">
        {[
          prop.status === 'published' &&
            HavePermission(
              'Edit properties',
              userLogged,
              prop.branch_office
            ) && (
              <ButtonPause
                funcion={handlePauseButton}
                data={prop}
                key={`pause-${prop._id}`}
              />
            ),

          prop.status === 'paused' &&
            HavePermission(
              'Edit properties',
              userLogged,
              prop.branch_office
            ) && (
              <ButtonActive
                data={prop}
                funcion={handleActiveButton}
                key={`active-${prop._id}`}
              />
            ),

          prop.status !== 'finished' &&
            HavePermission(
              'Edit properties',
              userLogged,
              prop.branch_office
            ) && (
              <ButtonEdit
                data={prop._id}
                key={`edit-${prop._id}`}
                funcion={handleEditButton}
              />
            ),

          (prop.status === 'published' || prop.status === 'paused') &&
            HavePermission(
              'Edit properties',
              userLogged,
              prop.branch_office
            ) && (
              <ButtonFinish
                data={prop}
                funcion={handleFinishButton}
                key={`finish-${prop._id}`}
              />
            ),
          prop.status === 'published' && (
            <ButtonView
              key={`view-${prop._id}`}
              link={`${process.env.REACT_APP_CLIENT_DETAIL}${prop._id}`}
            />
          ),
          prop.status !== 'finished' &&
            HavePermission(
              'Delete properties',
              userLogged,
              prop.branch_office
            ) && (
              <ButtonDelete
                data={prop}
                funcion={handleDeleteButton}
                key={`delete-${prop._id}`}
              />
            )
        ]}
      </span>

      {deleteModal && (
        <DeleteModal
          setShow={setDeleteModal}
          property={propSelected}
          handleStatus={handleStatus}
        />
      )}
      {pauseModal && (
        <PauseModal
          setShow={setPauseModal}
          property={propSelected}
          handleStatus={handleStatus}
        />
      )}

      {finishModal && (
        <FinishModal
          setShow={setFinishModal}
          property={propSelected}
          handleStatus={handleStatus}
        />
      )}
      {activeModal && (
        <ActiveModal
          setShow={setActiveModal}
          property={propSelected}
          handleStatus={handleStatus}
        />
      )}
    </>
  );
};
