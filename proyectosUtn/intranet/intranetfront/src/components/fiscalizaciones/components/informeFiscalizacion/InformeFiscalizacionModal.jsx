import { UploadFilesPreviews } from 'components/varios/UploadFilesPreviews';
import { acceptFileTypes } from 'components/varios/acceptFileTypes';
import RichTextEditor from 'components/varios/richTextEditor/RichTextEditor';
import { EditorState, convertToRaw } from 'draft-js';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { fiscalizacionCrearInforme } from 'redux/actions/fiscalizacion';
import comprimirImagen from 'utils/comprimirImagen';

const InformeFiscalizacionModal = ({
  show,
  handleClose,
  handleConfirm,
  fiscalizacionId,
  expedienteUserId,
  expedienteId
}) => {
  const initialValues = {
    title: '',
    descripcion: EditorState.createEmpty()
  };

  const [formValues, setFormValues] = useState(initialValues);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const [loading, setLoading] = useState(false);
  const [fileError, setFileError] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
    !show &&
      setFormValues({ title: '', descripcion: EditorState.createEmpty() });
  }, [show]);

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
      if (formValues.descripcion && formValues.title) {
        setLoading(true);

        await dispatch(
          fiscalizacionCrearInforme(
            fiscalizacionId,
            expedienteUserId,
            expedienteId,
            formValues.title,
            JSON.stringify(
              convertToRaw(formValues.descripcion.getCurrentContent())
            ),
            files
          )
        );

        setFiles([]);
        handleClose();
        handleConfirm && handleConfirm();
        setLoading(false);
      }
    }
  };

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

  return (
    <Modal
      show={show}
      onHide={() => {
        handleClose();
        setFiles([]);
      }}
      size="xl"
    >
      <Modal.Header closeButton>
        <Modal.Title>Generar Informe</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Título</Form.Label>
            <Form.Control
              type="text"
              required
              placeholder={`Ingrese el titulo del informe`}
              value={formValues.title}
              onChange={e =>
                setFormValues({ ...formValues, title: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <RichTextEditor
              value={formValues.descripcion}
              onChange={value =>
                setFormValues({ ...formValues, descripcion: value })
              }
            />
          </Form.Group>
        </Form>

        <UploadFilesPreviews
          dispatch={dispatch}
          expedienteId={expedienteId}
          fileError={fileError}
          files={files}
          handleClickFile={handleClickFile}
          previews={previews}
          onFileChange={onFileChange}
          colSize={{
            xs: 6,
            sm: 4,
            md: 3,
            lg: 2,
            xl: 1
          }}
        />
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="danger"
          disabled={loading}
          onClick={() => {
            handleClose();
            setFiles([]);
          }}
        >
          Cancelar
        </Button>

        <Button
          variant="success"
          type="submit"
          disabled={
            !formValues.descripcion || !formValues.title || loading || fileError
          }
          onClick={handleSubmit}
        >
          {loading ? <Spinner animation="border" size="sm" /> : 'Confirmar'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

InformeFiscalizacionModal.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  handleConfirm: PropTypes.func,
  fiscalizacionId: PropTypes.number,
  expedienteUserId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  expedienteId: PropTypes.number
};

export default InformeFiscalizacionModal;
