import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import RenderPreview from 'components/common/RenderPreview';
import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import { Button, Card, Col, Form, FormGroup, Row } from 'react-bootstrap';
import { expedienteGetById } from 'redux/actions/expediente';
import { deleteDocument, tramiteGetById } from 'redux/actions/tramite';

export const UploadFilesPreviews = ({
  documentos,
  dispatch,
  expedienteId,
  tramiteId,
  isEdit,
  files,
  onFileChange,
  handleClickFile,
  previews,
  fileError,
  colSize
}) => {
  const inputRef = useRef(null);

  return (
    <>
      {documentos && (
        <Row className="g-2 mb-4">
          {documentos.map(documento => (
            <Col
              {...colSize}
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
                  await dispatch(
                    expedienteId
                      ? expedienteGetById(expedienteId)
                      : tramiteGetById(tramiteId)
                  );
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

      <Form.Group>
        <Form.Label>
          {!isEdit ? 'Adjuntar nuevos documentos' : 'Adjuntar documentos'}
        </Form.Label>

        {previews && !!previews.length && (
          <Row className="mb-4">
            {files.map((file, i) => {
              return (
                <Col
                  {...colSize}
                  key={`p${i}`}
                  className="position-relative d-flex flex-column justify-content-between mb-3"
                >
                  <Button
                    name={i}
                    size="small"
                    variant="link"
                    style={{
                      position: 'absolute',
                      top: -8,
                      right: 4,
                      zIndex: 2000,
                      borderRadius: '50%'
                    }}
                    onClick={e => handleClickFile(e)}
                    className="px-1 py-0"
                  >
                    <FontAwesomeIcon
                      className="p-0 m-0 text-danger bg-white"
                      icon="xmark-circle"
                      style={{ borderRadius: '50%' }}
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

                  <div
                    className="w-100 text-dark fs--2 text-center"
                    style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {file.name}
                  </div>
                </Col>
              );
            })}
          </Row>
        )}

        <div className="d-flex justify-content-end">
          <FormGroup>
            <Form.Control
              type="file"
              multiple
              size="sm"
              accept="application/pdf,image/*,video/*,audio/*,application/msword,application/vnd.ms-excel,application/vnd.ms-powerpoint,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.openxmlformats-officedocument.presentationml.presentation"
              onChange={async e => await onFileChange(e)}
              value=""
              ref={inputRef}
              style={{ display: 'none' }}
              isInvalid={fileError}
            />

            <div className="d-flex justify-content-end">
              <Button
                size="sm"
                style={{ backgroundColor: 'var(--falcon-input-color)' }}
                onClick={() => inputRef.current.click()}
              >
                Elegir archivos
              </Button>
            </div>
            <Form.Control.Feedback
              type="invalid"
              className="d-flex justify-content-end"
              style={{ whiteSpace: 'pre-line' }}
            >
              {fileError.substring(1)}
            </Form.Control.Feedback>
          </FormGroup>
        </div>
      </Form.Group>
    </>
  );
};
UploadFilesPreviews.propTypes = {
  documentos: PropTypes.array,
  dispatch: PropTypes.func,
  expedienteId: PropTypes.number,
  tramiteId: PropTypes.number,
  isEdit: PropTypes.bool,
  files: PropTypes.array,
  onFileChange: PropTypes.func,
  handleClickFile: PropTypes.func,
  previews: PropTypes.array,
  fileError: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  colSize: PropTypes.shape({
    xs: PropTypes.number,
    sm: PropTypes.number,
    md: PropTypes.number,
    lg: PropTypes.number,
    xl: PropTypes.number
  })
};
