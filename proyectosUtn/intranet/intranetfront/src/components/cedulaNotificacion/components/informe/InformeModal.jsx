import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Col, Form, Modal, Row, Spinner } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import RenderPreview from 'components/common/RenderPreview';
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import { deleteDocument } from 'redux/actions/tramite';
import {
  cedulaCrearInforme,
  cedulaEditarInforme,
  cedulaGetById
} from 'redux/actions/cedula';
import RichTextEditor from 'components/varios/richTextEditor/RichTextEditor';
import comprimirImagen from 'utils/comprimirImagen';
import { toast } from 'react-toastify';

const InformeModal = ({
  show,
  handleClose,
  title,
  handleConfirm,
  cedula,
  informe
}) => {
  const initialValues = {
    title: title ? title : '',
    descripcion: ''
  };

  const [formValues, setFormValues] = useState(initialValues);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (informe) {
      setFormValues({
        title: informe.titulo,
        descripcion: EditorState.createWithContent(
          convertFromRaw(JSON.parse(informe.comentario))
        )
      });
    } else {
      show &&
        setFormValues({
          title: title || '',
          descripcion: EditorState.createEmpty()
        });
    }
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
    arr = arr.filter(file => !files.some(f => f.name === file.name));
    let newArray = [];

    for (let archivo of arr) {
      const extension = archivo.name.substring(archivo.name.lastIndexOf('.'));

      if (extension !== '.pdf') {
        const comprimido = await comprimirImagen(archivo);
        newArray.push(comprimido);
      } else if (archivo.size < 2097152) {
        newArray.push(archivo);
      } else {
        toast.error(
          <p className="text-dark m-0">
            <strong>Los archivos no pueden pesar más de 2MB.</strong>
          </p>,
          {
            position: 'bottom-center',
            closeButton: true,
            autoClose: false
          }
        );
      }
    }

    if (newArray.length) {
      setFiles([...files, ...newArray]);
    }
  };

  const handleSubmit = async () => {
    if (!loading) {
      if (formValues.descripcion && formValues.title) {
        handleConfirm && handleConfirm();
        setLoading(true);

        if (informe) {
          await dispatch(
            cedulaEditarInforme(
              cedula.id,
              cedula.usuarioId,
              informe.id,
              formValues.title,
              JSON.stringify(
                convertToRaw(formValues.descripcion.getCurrentContent())
              ),
              files
            )
          );
        } else {
          await dispatch(
            cedulaCrearInforme(
              cedula.id,
              cedula.usuarioId,
              cedula.pasoActual,
              formValues.title,
              JSON.stringify(
                convertToRaw(formValues.descripcion.getCurrentContent())
              ),
              files
            )
          );
        }

        await dispatch(cedulaGetById(cedula.id));
        setFiles([]);
        handleClose();

        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (files) {
      setPreviews(
        files.map(file => {
          const extension = file.name.substring(file.name.lastIndexOf('.'));
          let preview = URL.createObjectURL(file);

          if (extension === '.pdf') {
            preview = preview + '.pdf';
          }

          return preview;
        })
      );
    }
  }, [files]);

  const inputRef = useRef();

  return (
    <Modal
      show={show}
      onHide={() => {
        handleClose();
        setFiles([]);
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Generar informe</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Título</Form.Label>
            <Form.Control
              type="text"
              required
              placeholder="Ingrese el titulo del informe"
              value={title ? title : formValues.title}
              onChange={e =>
                setFormValues({ ...formValues, title: e.target.value })
              }
              disabled={title ? true : false}
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

        {informe && (
          <Row className="g-2 mb-4">
            {informe.documento.map(documento => (
              <Col
                xs={6}
                key={documento.id}
                className="position-relative d-flex flex-column justify-content-between"
              >
                <Button
                  size="small"
                  variant="link"
                  style={{
                    position: 'absolute',
                    top: -8,
                    right: -20,
                    zIndex: 2000
                  }}
                  onClick={async () => {
                    await dispatch(deleteDocument(documento.id));
                    await dispatch(cedulaGetById(informe.cedulaId));
                  }}
                >
                  <FontAwesomeIcon
                    className="p-0 m-0 text-danger"
                    icon="xmark-circle"
                  />
                </Button>

                <Card>
                  <RenderPreview
                    preview={documento.archivoUbicacion}
                    alt="preview"
                    isSmall
                  />
                </Card>
              </Col>
            ))}
          </Row>
        )}

        <Form.Group className="mb-3">
          <Form.Label>
            {informe ? 'Adjuntar nuevos documentos' : 'Adjuntar documentos'}
          </Form.Label>
          {previews && !!previews.length && (
            <Row className="mb-4">
              {files.map((file, i) => {
                return (
                  <Col
                    xs={4}
                    key={`p${i}`}
                    className="position-relative d-flex flex-column justify-content-between"
                  >
                    <Button
                      name={i}
                      size="small"
                      variant="link"
                      style={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        zIndex: 2000
                      }}
                      onClick={e => handleClickFile(e)}
                    >
                      <FontAwesomeIcon
                        className="p-0 m-0 text-danger"
                        icon="xmark-circle"
                      />
                    </Button>
                    <Card>
                      {previews[i] && (
                        <RenderPreview
                          preview={previews[i]}
                          alt="preview"
                          isSmall
                        />
                      )}
                    </Card>
                    <Card.Text className="text-center">
                      {file.name.length > 15
                        ? file.name.substring(0, 13) + '...'
                        : file.name}
                    </Card.Text>
                  </Col>
                );
              })}
            </Row>
          )}

          <div className="d-flex justify-content-end">
            <Form.Control
              type="file"
              multiple
              size="sm"
              accept="image/*, .pdf"
              onChange={async e => onFileChange(e)}
              value=""
              ref={inputRef}
              style={{ display: 'none' }}
            />
            <Button
              size="sm"
              style={{ backgroundColor: 'var(--falcon-input-color)' }}
              onClick={() => inputRef.current.click()}
            >
              Elegir archivos
            </Button>
          </div>
        </Form.Group>
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
          disabled={!formValues.descripcion || !formValues.title || loading}
          onClick={handleSubmit}
        >
          {loading ? <Spinner animation="border" size="sm" /> : 'Confirmar'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

InformeModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  handleConfirm: PropTypes.func,
  cedula: PropTypes.object.isRequired,
  informe: PropTypes.object
};

export default InformeModal;
