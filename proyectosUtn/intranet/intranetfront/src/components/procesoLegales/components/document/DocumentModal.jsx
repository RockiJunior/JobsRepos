import { UploadFilesPreviews } from 'components/varios/UploadFilesPreviews';
import { acceptFileTypes } from 'components/varios/acceptFileTypes';
import RichTextEditor from 'components/varios/richTextEditor/RichTextEditor';
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { expedienteGetById } from 'redux/actions/expediente';
import {
  procesoLegalesCrearDictamen,
  procesoLegalesCrearFallo,
  procesoLegalesCrearInforme,
  procesoLegalesCrearResolucion,
  procesoLegalesUpdateDictamen,
  procesoLegalesUpdateFallo,
  procesoLegalesUpdateInforme,
  procesoLegalesUpdateResolucion
} from 'redux/actions/procesoLegales';
import comprimirImagen from 'utils/comprimirImagen';

export const TipoFallosOptions = [
  { value: 'sin_sancion', label: 'Sin Sanción' },
  { value: 'advertencia_privada', label: 'Advertencia Privada' },
  { value: 'apercibiento_publico', label: 'Apercibimiento Público' },
  { value: 'multa', label: 'Multa' },
  { value: 'suspension', label: 'Suspensión' },
  { value: 'cancelacion', label: 'Cancelación' }
];

const getDispatchCreate = (
  type,
  procesoLegalId,
  expedienteId,
  expedienteUserId,
  titulo,
  descripcion,
  archivos,
  tipo
) => {
  switch (type) {
    case 'resolucion':
      return procesoLegalesCrearResolucion(
        procesoLegalId,
        expedienteId,
        expedienteUserId,
        titulo,
        descripcion,
        archivos
      );

    case 'fallo':
      return procesoLegalesCrearFallo(
        procesoLegalId,
        expedienteId,
        expedienteUserId,
        titulo,
        descripcion,
        tipo,
        archivos
      );

    case 'dictamen':
      return procesoLegalesCrearDictamen(
        procesoLegalId,
        expedienteId,
        expedienteUserId,
        titulo,
        descripcion,
        archivos
      );

    case 'informe':
      return procesoLegalesCrearInforme(
        procesoLegalId,
        expedienteId,
        expedienteUserId,
        titulo,
        descripcion,
        archivos
      );

    default:
      return null;
  }
};

const getDispatchUpdate = (
  type,
  procesoLegalId,
  expedienteId,
  expedienteUserId,
  documentId,
  titulo,
  descripcion,
  archivos,
  tipo
) => {
  switch (type) {
    case 'resolucion':
      return procesoLegalesUpdateResolucion(
        procesoLegalId,
        expedienteId,
        expedienteUserId,
        documentId,
        titulo,
        descripcion,
        archivos
      );

    case 'fallo':
      return procesoLegalesUpdateFallo(
        procesoLegalId,
        expedienteId,
        expedienteUserId,
        documentId,
        titulo,
        descripcion,
        tipo,
        archivos
      );

    case 'dictamen':
      return procesoLegalesUpdateDictamen(
        procesoLegalId,
        expedienteId,
        expedienteUserId,
        documentId,
        titulo,
        descripcion,
        archivos
      );

    case 'informe':
      return procesoLegalesUpdateInforme(
        procesoLegalId,
        expedienteId,
        expedienteUserId,
        documentId,
        titulo,
        descripcion,
        archivos
      );

    default:
      return null;
  }
};

const DocumentModal = ({
  show,
  handleClose,
  title,
  handleConfirm,
  expediente,
  procesoLegalId,
  document,
  goToSection,
  setKey,
  type
}) => {
  const initialValues = {
    title: title ? title : '',
    descripcion: EditorState.createEmpty()
  };

  const [formValues, setFormValues] = useState(initialValues);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const [loading, setLoading] = useState(false);
  const [fileError, setFileError] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (document) {
      if (type === 'fallo') {
        setFormValues({
          title: document.titulo,
          descripcion: EditorState.createWithContent(
            convertFromRaw(JSON.parse(document.comentario))
          ),
          tipo: document.tipo
        });
      } else {
        setFormValues({
          title: document.titulo,
          descripcion: EditorState.createWithContent(
            convertFromRaw(JSON.parse(document.comentario))
          )
        });
      }
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
        handleConfirm && handleConfirm();
        setLoading(true);

        if (document) {
          await dispatch(
            getDispatchUpdate(
              type,
              procesoLegalId,
              expediente.id,
              expediente.carpeta?.usuarioId || 'cucicba',
              document.id,
              formValues.title,
              JSON.stringify(
                convertToRaw(formValues.descripcion.getCurrentContent())
              ),
              files,
              formValues.tipo
            )
          );
        } else {
          await dispatch(
            getDispatchCreate(
              type,
              procesoLegalId,
              expediente.id,
              expediente.carpeta?.usuarioId || 'cucicba',
              formValues.title,
              JSON.stringify(
                convertToRaw(formValues.descripcion.getCurrentContent())
              ),
              files,
              formValues.tipo
            )
          );
        }

        await dispatch(expedienteGetById(expediente.id));
        setFiles([]);
        goToSection && goToSection(type);
        setKey && setKey('informacion');
        handleClose();
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
        <Modal.Title>
          {document ? 'Editar' : 'Generar'} {type}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group
            className="mb-3"
            controlId="formBasicEmail"
            style={{ maxWidth: 600 }}
          >
            {type === 'fallo' && (
              <Form.Group className="mb-3">
                <Form.Label>Tipo de fallo</Form.Label>
                <Form.Select
                  required
                  value={formValues.tipo}
                  onChange={e =>
                    setFormValues({ ...formValues, tipo: e.target.value })
                  }
                >
                  <option value="">Seleccione un tipo de fallo</option>
                  {TipoFallosOptions.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            )}
            <Form.Label>Título</Form.Label>
            <Form.Control
              type="text"
              required
              placeholder={`Ingrese el titulo del ${type}`}
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

        <UploadFilesPreviews
          dispatch={dispatch}
          expedienteId={expediente.id}
          fileError={fileError}
          files={files}
          handleClickFile={handleClickFile}
          previews={previews}
          documentos={document?.documento}
          isEdit={!!document}
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

DocumentModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  handleConfirm: PropTypes.func,
  expediente: PropTypes.object.isRequired,
  document: PropTypes.object,
  goToSection: PropTypes.func,
  setKey: PropTypes.func,
  type: PropTypes.oneOf(['dictamen', 'fallo', 'resolucion', 'informe']),
  procesoLegalId: PropTypes.number.isRequired
};

export default DocumentModal;
