import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Col, Form, Modal, Row, Spinner } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { tramiteCrearArchivo, tramiteGetById } from 'redux/actions/tramite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import RenderPreview from 'components/common/RenderPreview';
import comprimirImagen from 'utils/comprimirImagen';
import { toast } from 'react-toastify';

const ArchivoModal = ({
  show,
  handleClose,
  title,
  handleConfirm,
  tramite,
  goToSection,
  setKey
}) => {
  const initialValues = {
    title: title ? title : ''
  };

  const [formValues, setFormValues] = useState(initialValues);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    show && setFormValues({ title: title || '' });

    !show && setFormValues({ title: '' });
  }, [show]);

  const handleClickFile = () => {
    setFile(null);
  };

  const onFileChange = async e => {
    let newArchivo = e.target.files[0];

    const extension = newArchivo.name.substring(
      newArchivo.name.lastIndexOf('.')
    );

    if (extension !== '.pdf') {
      const comprimido = await comprimirImagen(newArchivo);
      newArchivo = comprimido;
    } else if (newArchivo.size > 2097152) {
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

    setFile(newArchivo);
  };

  useEffect(() => {
    if (file) {
      const extension = file.name.substring(file.name.lastIndexOf('.'));
      let preview = URL.createObjectURL(file);

      preview = preview + extension;

      setPreview(preview);
    }
  }, [file]);

  const inputRef = useRef();

  return (
    <Modal
      show={show}
      onHide={() => {
        handleClose();
        setFile(null);
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Subir {title || 'archivo'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Título</Form.Label>

            <Form.Control
              type="text"
              required
              placeholder="Ingrese el titulo del archivo"
              value={title ? title : formValues.title}
              onChange={e =>
                setFormValues({ ...formValues, title: e.target.value })
              }
              disabled={title ? true : false}
            />
          </Form.Group>
        </Form>

        <Form.Group className="mb-3">
          <Form.Label>Adjuntar archivo</Form.Label>

          {preview && file && (
            <Row className="mb-4">
              <Col
                xs={4}
                className="position-relative d-flex flex-column justify-content-between"
              >
                <Button
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
                  <RenderPreview preview={preview} alt="preview" isSmall />
                </Card>
                <Card.Text className="text-center">
                  {file.name.length > 15
                    ? file.name.substring(0, 13) + '...'
                    : file.name}
                </Card.Text>
              </Col>
            </Row>
          )}

          <div className="d-flex justify-content-end">
            <Form.Control
              type="file"
              multiple
              size="sm"
              accept="image/*, .pdf"
              onChange={async e => await onFileChange(e)}
              value=""
              ref={inputRef}
              style={{ display: 'none' }}
            />
            <Button
              size="sm"
              style={{ backgroundColor: 'var(--falcon-input-color)' }}
              onClick={() => inputRef.current.click()}
            >
              Elegir archivo
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
            setFile(null);
          }}
        >
          Cancelar
        </Button>

        <Button
          variant="success"
          type="submit"
          disabled={!file || !formValues.title || loading}
          onClick={async () => {
            if (!loading) {
              if (file && formValues.title) {
                setLoading(true);
                handleConfirm && handleConfirm();

                await dispatch(
                  tramiteCrearArchivo(
                    formValues.title,
                    file,
                    tramite.id,
                    tramite.carpeta?.usuarioId || 'cucicba'
                  )
                );
                await dispatch(tramiteGetById(tramite.id));
                setFile(null);
                goToSection && goToSection('archivos');
                setKey && setKey('informacion');
                handleClose();
                setLoading(false);
              }
            }
          }}
        >
          {loading ? <Spinner animation="border" size="sm" /> : 'Confirmar'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

ArchivoModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  handleConfirm: PropTypes.func,
  tramite: PropTypes.object.isRequired,
  goToSection: PropTypes.func,
  sectionsLength: PropTypes.number,
  setKey: PropTypes.func
};

export default ArchivoModal;
