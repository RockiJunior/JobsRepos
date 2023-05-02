import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { expedienteGetById } from 'redux/actions/expediente';
import {
  fiscalizacionCrearConstatacion,
  fiscalizacionUpdateConstatacion
} from 'redux/actions/fiscalizacion';
import comprimirImagen from 'utils/comprimirImagen';
import { UploadFilesPreviews } from '../../../varios/UploadFilesPreviews';
import { acceptFileTypes } from '../../../varios/acceptFileTypes';

const initialState = {
  titulo: '',
  comentario: '',
  estado: 'pendiente',
  fecha: new Date()
};

const NuevaConstatacion = ({
  show,
  setShow,
  fiscalizacionId,
  expedienteId,
  constatacion,
  expedienteUserId
}) => {
  const [formData, setFormData] = useState(initialState);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileError, setFileError] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
    if (constatacion) {
      setFormData({
        titulo: constatacion.titulo,
        comentario: constatacion.comentario,
        estado: constatacion.estado,
        fecha: constatacion.fecha
      });
    } else {
      show && setFormData(initialState);
    }
    !show && setFormData(initialState);
  }, [show]);

  useEffect(async () => {
    if (files) {
      setPreviews(
        files.map(file => {
          const extension = file.name.substring(file.name.lastIndexOf('.'));
          let preview = URL.createObjectURL(file);

          preview = preview + extension;

          return preview;
        })
      );

      setFileError('');

      for (const file of files) {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file, document);

        const result = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });

        if (acceptFileTypes.some(type => file.type.includes(type))) {
          if (file.type.includes('image/')) {
            null;
          } else if (file.type === 'application/pdf') {
            if (file.size > 2097152) {
              setFileError(
                prev =>
                  prev +
                  `\nUn PDF supera el tamaño máximo permitido - ${file.name}`
              );
            } else {
              const files = new Blob([result], {
                type: 'application/pdf'
              });
              const text = await files.text();

              if (
                text.includes('Encrypt') ||
                text
                  .substring(text.lastIndexOf('<<'), text.lastIndexOf('>>'))
                  .includes('/Encrypt')
              ) {
                setFileError(
                  prev => prev + `\nUn PDF está encriptado - ${file.name}`
                );
              }
            }
          } else {
            if (file.size > 2097152) {
              setFileError(
                prev =>
                  prev +
                  `\nUn archivo supera el tamaño máximo permitido - ${file.name}`
              );
            }
          }
        } else {
          setFileError(
            prev => prev + `\nTipo de archivo no permitido - ${file.name}`
          );
        }
      }
    }
  }, [files]);

  const handleClickFile = e => {
    const arr = [...files];
    arr.splice(e.currentTarget.name, 1);
    setFiles(arr);
  };

  const onFileChange = async e => {
    let arr = Array.from(e.target.files);
    arr = [...arr.filter(file => !files.some(f => f.name === file.name))];

    let filesArray = [];

    for (const file of arr) {
      if (file.type.includes('image/')) {
        if (file.size > 2097152) {
          const archivo = await comprimirImagen(file);
          filesArray.push(archivo);
        } else {
          filesArray.push(file);
        }
      } else if (file.type === 'application/pdf') {
        filesArray.push(file);
      } else {
        filesArray.push(file);
      }
    }

    if (filesArray.length) {
      setFiles(prev => [...prev, ...filesArray]);
    }
  };

  const handleSubmit = async () => {
    if (!loading && !fileError) {
      if (
        formData.comentario &&
        formData.titulo &&
        formData.fecha &&
        formData.estado
      ) {
        setLoading(true);

        if (constatacion) {
          await dispatch(
            fiscalizacionUpdateConstatacion(
              fiscalizacionId,
              constatacion.id,
              formData.titulo,
              formData.comentario,
              formData.estado,
              files,
              expedienteUserId || 'cucicba',
              expedienteId
            )
          );
        } else {
          await dispatch(
            fiscalizacionCrearConstatacion(
              fiscalizacionId,
              formData.titulo,
              formData.comentario,
              formData.estado,
              formData.fecha,
              files,
              expedienteUserId || 'cucicba',
              expedienteId
            )
          );
        }

        await dispatch(expedienteGetById(expedienteId));
        setFiles([]);
        setShow(false);
        setLoading(false);
      }
    }
  };

  return (
    <Modal show={show} onHide={() => setShow(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Añadir Constatación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label>Fecha</Form.Label>
          <Form.Control
            type="date"
            name="fecha"
            value={dayjs(formData.fecha).format('YYYY-MM-DD')}
            disabled={!!constatacion}
            onChange={e =>
              !constatacion &&
              setFormData({
                ...formData,
                fecha: dayjs(e.target.value).toDate()
              })
            }
            className="mb-3"
          />

          <Form.Label>Título</Form.Label>
          <Form.Control
            type="text"
            name="titulo"
            value={formData.titulo}
            onChange={e => setFormData({ ...formData, titulo: e.target.value })}
            className="mb-3"
          />

          <Form.Label>Comentario</Form.Label>
          <Form.Control
            type="text"
            as="textarea"
            name="comentario"
            value={formData.comentario}
            onChange={e =>
              setFormData({ ...formData, comentario: e.target.value })
            }
            className="mb-3"
          />

          <Form.Label>Estado</Form.Label>
          <Form.Select
            name="estado"
            value={formData.estado}
            onChange={e => setFormData({ ...formData, estado: e.target.value })}
            className="mb-3"
          >
            <option value="pendiente">Pendiente</option>
            <option value="en_curso">En curso</option>
            <option value="finalizado">Finalizado</option>
          </Form.Select>
        </Form.Group>

        <UploadFilesPreviews
          dispatch={dispatch}
          documentos={constatacion?.documentos}
          expedienteId={expedienteId}
          fileError={fileError}
          files={files}
          handleClickFile={handleClickFile}
          isEdit={!!constatacion}
          previews={previews}
          onFileChange={onFileChange}
          colSize={{
            xs: 3,
            sm: 3,
            md: 3,
            lg: 3,
            xl: 3
          }}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" size="sm" onClick={() => setShow(false)}>
          Cancelar
        </Button>

        <Button
          variant="success"
          size="sm"
          onClick={handleSubmit}
          disabled={
            loading ||
            !formData.titulo ||
            !formData.comentario ||
            !formData.estado ||
            !formData.fecha ||
            fileError
          }
        >
          {constatacion ? 'Editar' : 'Añadir'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

NuevaConstatacion.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
  fiscalizacionId: PropTypes.number.isRequired,
  expedienteId: PropTypes.number.isRequired,
  expedienteUserId: PropTypes.number,
  constatacion: PropTypes.object
};

export default NuevaConstatacion;
