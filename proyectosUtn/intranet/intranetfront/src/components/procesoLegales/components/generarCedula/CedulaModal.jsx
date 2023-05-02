import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Col, Form, Modal, Row, Spinner } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { expedienteGetById } from 'redux/actions/expediente';
import RichTextEditor from 'components/varios/richTextEditor/RichTextEditor';
import { EditorState, convertToRaw } from 'draft-js';
import comprimirImagen from 'utils/comprimirImagen';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import RenderPreview from 'components/common/RenderPreview';
import { procesoLegalesCrearCedula } from 'redux/actions/procesoLegales';

const CedulaModal = ({ show, handleClose, expediente, tipo, setKey }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    titulo: '',
    motivo: EditorState.createEmpty()
  });

  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    if (show) {
      setFormData({
        titulo: '',
        motivo: EditorState.createEmpty()
      });
    } else {
      setFormData({
        titulo: '',
        motivo: EditorState.createEmpty()
      });
    }
  }, [expediente]);

  const handleSubmit = async () => {
    if (formData.titulo && formData.motivo && !loading) {
      setLoading(true);
      await dispatch(
        procesoLegalesCrearCedula(
          formData.titulo,
          JSON.stringify(convertToRaw(formData.motivo.getCurrentContent())),
          expediente.carpeta.usuarioId,
          expediente.id,
          expediente.pasoActual,
          tipo,
          files
        )
      );

      await dispatch(expedienteGetById(expediente.id));
      setKey('relaciones');
      setLoading(false);
      handleClose();
    }
  };

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
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          Generar Cédula ({tipo === 'mail' ? 'con email' : 'sin email'})
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label>Título</Form.Label>
          <Form.Control
            type="text"
            placeholder="Título"
            value={formData.titulo}
            onChange={e => setFormData({ ...formData, titulo: e.target.value })}
            required
          />
        </Form.Group>

        <Form.Group>
          <RichTextEditor
            value={formData.motivo}
            onChange={value => setFormData({ ...formData, motivo: value })}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>
            {document ? 'Adjuntar nuevos documentos' : 'Adjuntar documentos'}
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
              Elegir archivos
            </Button>
          </div>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleClose}>
          Cancelar
        </Button>

        <Button
          variant="success"
          onClick={handleSubmit}
          disabled={!formData.titulo || !formData.motivo}
        >
          {loading ? <Spinner animation="border" size="sm" /> : 'Enviar'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

CedulaModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  expediente: PropTypes.object.isRequired,
  tipo: PropTypes.string.isRequired,
  setKey: PropTypes.func.isRequired
};

export default CedulaModal;
