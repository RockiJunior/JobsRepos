import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { imageDelete } from 'redux/propsSlice';
import ButtonAccept from 'utils/buttons/buttonAccept';
import ButtonClose from 'utils/buttons/buttonClose';
import messageHandler from 'utils/messageHandler';

const ImageDeleteModal = ({
  image,
  imageType,
  setShow,
  setData,
  data,
  setStepStatus
}) => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const handleClose = () => setShow(false);

  const handleDelete = async ({ id, fileName }) => {
    try {
      if ((!isLoading && imageType === 'image') || imageType === 'houseMap') {
        setIsLoading(true);
        const response = await dispatch(imageDelete(id, fileName));
        if (response && response?.status < 400) {
          setData(prev => ({ ...prev, images: response.data.result }));
          setStepStatus(prev => ({ ...prev, images: response.data.result }));

          messageHandler(
            'success',
            imageType === 'image'
              ? 'Imagen borrada correctamente'
              : 'Plano borrado correctamente'
          );
          handleClose();
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Modal keyboard={true} show={true} onHide={handleClose} backdrop="static">
      <Modal.Header closeButton>
        <FontAwesomeIcon
          icon="fa-trash-can"
          title="Eliminar"
          size="1x"
          style={{ marginRight: 8, color: '#e63757' }}
        />

        <Modal.Title>Eliminar imagen</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="mb-4">
          <img
            src={process.env.REACT_APP_CLIENT + '/uploads/properties/' + image}
            className="rounded my-3"
            style={{ width: '100%' }}
          />
          <p className="mt-2">
            ¿Está seguro que quiere borrar{' '}
            {imageType === 'image'
              ? 'esta imagen? No podrá recuperarla.'
              : 'este plano? No podrá recuperarlo.'}
          </p>
        </div>

        <div className="d-flex justify-content-end" style={{ gap: 30 }}>
          <ButtonClose text="Cancelar" funcion={handleClose} />

          <ButtonAccept
            text={isLoading ? 'Cargando' : 'Confirmar'}
            funcion={handleDelete}
            data={{ id: data._id, fileName: image }}
            disabled={isLoading}
          />
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ImageDeleteModal;
