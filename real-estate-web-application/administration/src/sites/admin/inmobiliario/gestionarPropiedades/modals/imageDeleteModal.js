import React, { useState } from 'react'
import FalconCloseButton from 'components/common/FalconCloseButton';
import { Modal } from 'react-bootstrap';
import axios from 'axios';
import ButtonClose from 'utils/buttonClose';
import ButtonAccept from 'utils/buttonAccept';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { imageDelete } from 'redux/propsSlice';
import { useDispatch } from 'react-redux';
import messageHandler from 'utils/messageHandler';

const ImageDeleteModal = ({ image, imageType, setShow, setData, data }) => {
  const dispatch = useDispatch()
  const token = localStorage.getItem("token")
  const [isLoading, setIsLoading] = useState(false)
  const handleClose = () => setShow(false);

  const handleDelete = async ({ id, url, imageType, token }) => {
    try {
      if (!isLoading && imageType === "image") {
        setIsLoading(true)
        const response = await dispatch(imageDelete(id, url, imageType, token));
        if (response?.status < 400) {
          setData({ ...data, images: response.data })
          messageHandler("success", "Imagen borrada correctamente")
          handleClose()
        }
      } else if (!isLoading && imageType === "houseMap") {
        setIsLoading(true)
        const response = await dispatch(imageDelete(data._id, image, imageType, token))
        if (response?.status < 400) {
          setData({ ...data, houseMap: response.data })
          messageHandler("success", "Plano borrado correctamente")
          handleClose()
        }
      }
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <>
      <Modal keyboard={true} show={true} onHide={handleClose} backdrop="static" >

        <Modal.Header closeButton>
          <FontAwesomeIcon
            icon='fa-trash-can'
            title='Eliminar'
            size='1x'
            style={{ marginRight: 8, color: '#e63757' }} />
          <Modal.Title >Eliminar imagen</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='mb-4'>
            <img src={image} className="rounded my-3" style={{ width: "100%" }} />
            <p className="mt-2">
              ¿Está seguro que quiere borrar {imageType === "image" ? "esta imagen? No podrá recuperarla." : "este plano? No podrá recuperarlo."}
            </p>
          </div>
          <div className='d-flex justify-content-end' style={{ gap: 30 }}>
            {ButtonClose('Cancelar', handleClose)}
            {ButtonAccept(
              isLoading ? 'Cargando' : 'Confirmar',
              handleDelete,
              {
                id: data._id,
                url: image,
                imageType: imageType,
                token: token
              },
              isLoading
            )}
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default ImageDeleteModal