import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import RenderPreview from 'components/common/RenderPreview';
import ConfirmacionModal from 'components/tramites/components/actions/buttons/ConfirmacionModal';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Col, Form, Modal, Row, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  aprobarRechazarTransaccion,
  transaccionGetAll,
  transaccionGetAllByAdminId,
  transaccionGetById,
  transaccionUploadPayment
} from 'redux/actions/transaccion';
import comprimirImagen from 'utils/comprimirImagen';

const getTitle = (tramite, expediente) => {
  if (tramite) {
    return tramite.tipo.titulo;
  } else if (expediente) {
    const numeroLegales = expediente.numeroLegales;
    const numeroFiscalizacion = expediente.numeroFiscalizacion;

    return `Expediente Nroº ${numeroLegales ? 'L-' + numeroLegales : ''}${
      numeroLegales && numeroFiscalizacion ? '/' : ''
    }${numeroFiscalizacion ? 'F-' + numeroFiscalizacion : ''}`;
  } else {
    return '';
  }
};

const ViewTransaction = ({
  transactionId,
  setTransactionId,
  all,
  onlyView
}) => {
  const { transaccion } = useSelector(state => state.transaccionReducer);
  const { user } = useSelector(state => state.authReducer);

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [comentario, setComentario] = useState('');
  const [showModalRequest, setShowModalRequest] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

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

          preview = preview + extension;

          return preview;
        })
      );
    }
  }, [files]);

  useEffect(() => {
    transactionId && dispatch(transaccionGetById(transactionId));

    if (!transactionId) {
      setFiles([]);
      setPreviews([]);
    }
  }, [transactionId]);

  const inputRef = useRef();

  return (
    <>
      <Modal
        show={transactionId}
        onHide={() => {
          setTransactionId(null);
        }}
        size="xl"
        centered
      >
        {transaccion ? (
          <>
            <Modal.Header className="d-inline">
              <Modal.Title>
                {getTitle(
                  transaccion.tramite,
                  transaccion.fiscalizacion?.expediente
                )}
              </Modal.Title>
              <Card.Subtitle className="mb-2">
                Transacción Nº {transaccion.id}
              </Card.Subtitle>
            </Modal.Header>
            <Modal.Body style={{ overflow: 'visible' }}>
              <Row className="g-2">
                <Col className="px-4">
                  <Card.Title className="text-dark mt-2">
                    <strong>Detalle:</strong>
                  </Card.Title>

                  <ul className="mb-0 ps-0 text-dark w-100">
                    {transaccion.info?.conceptos
                      ? transaccion.info.conceptos.map(concepto => (
                          <li
                            key={concepto.id}
                            className="w-100 d-flex justify-content-between align-items-start"
                          >
                            <span>{concepto.nombre}</span>
                            <span className="ms-3">
                              ${concepto.monto?.toFixed(2)}
                            </span>
                          </li>
                        ))
                      : transaccion.tipoTransaccion?.TipoTransaccionConcepto.map(
                          tc => (
                            <li
                              className="w-100 d-flex justify-content-between align-items-start"
                              key={tc.concepto.id}
                            >
                              <span>{tc.concepto.nombre}</span>
                              {tc.concepto.monto && (
                                <span className="ms-3">
                                  ${tc.concepto.monto?.toFixed(2)}
                                </span>
                              )}
                            </li>
                          )
                        )}
                  </ul>
                </Col>
                {!!transaccion.monto && (
                  <Col xs={12} className="mb-3 px-4">
                    <div className="d-flex justify-content-between">
                      <span>
                        <Card.Title className="text-dark text-end m-0">
                          Total:
                        </Card.Title>
                      </span>
                      <span>
                        <Card.Title className="text-dark text-end m-0">
                          <strong>${transaccion.monto?.toFixed(2)}</strong>
                        </Card.Title>
                        {transaccion.tipoCuota.cantidad > 1 && (
                          <p className="m-0 text-center fs--1 fw-semi-bold">
                            Cuota {transaccion.cuotaNro}/
                            {transaccion.tipoCuota.cantidad}
                          </p>
                        )}
                      </span>
                    </div>
                  </Col>
                )}
              </Row>
              <hr />
              <Row>
                <Col xs={12}>
                  <Row>
                    <Col xs={12}>
                      <p className="m-0 text-dark">
                        Nombre:{' '}
                        <strong>
                          {transaccion.usuario?.nombre ||
                            transaccion.fiscalizacion?.expediente.denuncia
                              ?.nombreDenunciado}{' '}
                          {transaccion.usuario?.apellido ||
                            transaccion.fiscalizacion?.expediente.denuncia
                              ?.apellidoDenunciado}
                        </strong>
                      </p>
                    </Col>
                    <Col xs={12}>
                      <p className="m-0 text-dark">
                        DNI:{' '}
                        <strong>
                          {transaccion.usuario?.dni ||
                            transaccion.fiscalizacion?.expediente.denuncia
                              ?.dniDenunciado ||
                            '-'}
                        </strong>
                      </p>
                    </Col>
                    <Col xs={12}>
                      <p className="m-0 text-dark">
                        Email:{' '}
                        <strong>{transaccion.usuario?.email || '-'}</strong>
                      </p>
                    </Col>
                  </Row>
                </Col>
                <Col xs={12} className="mb-3">
                  {transaccion.tipoCuota.cantidad > 1 && (
                    <div className="mt-1">
                      <strong className="text-danger fs--2">
                        *El usuario debe haber subido su constancia de CBU
                        además del comprobante de la primera cuota
                      </strong>
                    </div>
                  )}
                </Col>
                <Col xs={12}>
                  <Row className="g-2 d-flex justify-content-center">
                    {transaccion.comprobante.map(comprobante => {
                      return (
                        <Col
                          xs={6}
                          key={comprobante.id}
                          className="position-relative d-flex flex-column justify-content-between"
                        >
                          <Card>
                            <RenderPreview
                              preview={comprobante.archivoUbicacion}
                              alt="preview"
                            />
                          </Card>
                        </Col>
                      );
                    })}
                  </Row>
                </Col>
              </Row>
            </Modal.Body>

            {!onlyView && transaccion.estado === 'pending' && (
              <Modal.Footer className="d-inline">
                {transaccion.opcionCuotasId && (
                  <>
                    <hr />
                    <Form.Group className="mb-3">
                      {previews && !!previews.length && (
                        <Row className="g-2">
                          {files.map((file, i) => {
                            return (
                              <Col
                                xs={12}
                                sm={6}
                                md={4}
                                lg={3}
                                xl={2}
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
                                    right: -20,
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
                    </Form.Group>

                    <div>
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
                          style={{
                            backgroundColor: 'var(--falcon-input-color)'
                          }}
                          onClick={() => inputRef.current.click()}
                        >
                          Elegir archivos
                        </Button>
                      </div>
                      {transaccion.tipoCuota.cantidad > 1 && (
                        <div className="mt-1">
                          <strong className="text-danger fs--2">
                            *Recuerde subir la constancia de su CBU además del
                            comprobante de la primera cuota
                          </strong>
                        </div>
                      )}
                    </div>

                    <div className="d-flex justify-content-end">
                      {!!files.length && (
                        <Button
                          variant="primary"
                          size="sm"
                          className="mt-2"
                          onClick={async () => {
                            if (files.length || !loading) {
                              setLoading(true);
                              await dispatch(
                                transaccionUploadPayment(
                                  files,
                                  transaccion.id,
                                  transaccion.usuarioId || 'cucicba'
                                )
                              );
                              await dispatch(
                                all
                                  ? transaccionGetAll()
                                  : transaccionGetAllByAdminId(user.id)
                              );
                              setTransactionId(null);
                              setLoading(false);
                            }
                          }}
                          disabled={loading || !files.length}
                        >
                          Enviar comprobante/s y aprobar la transacción
                        </Button>
                      )}
                    </div>
                  </>
                )}
              </Modal.Footer>
            )}

            {!onlyView && transaccion.estado !== 'pending' && (
              <>
                <Modal.Footer>
                  <Button
                    size="sm"
                    variant="warning"
                    onClick={() => setShowModalRequest(true)}
                  >
                    Solicitar modificación
                  </Button>
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => setOpenModal(true)}
                  >
                    {loading ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      'Aprobar'
                    )}
                  </Button>
                </Modal.Footer>

                <ConfirmacionModal
                  openModal={openModal}
                  setOpenModal={setOpenModal}
                  handleAccept={async () => {
                    await dispatch(
                      aprobarRechazarTransaccion(transaccion.id, 'approved')
                    );
                    await dispatch(
                      all
                        ? transaccionGetAll()
                        : transaccionGetAllByAdminId(user.id)
                    );
                    setTransactionId(null);
                  }}
                  loading={loading}
                  setLoading={setLoading}
                  title="aprobar la transacción"
                />
              </>
            )}
          </>
        ) : (
          <Modal.Body className="d-flex justify-content-center align-items-center">
            <Spinner animation="border" />
          </Modal.Body>
        )}
      </Modal>

      {!onlyView && transaccion?.estado !== 'pending' && (
        <Modal
          show={showModalRequest}
          onHide={() => {
            setComentario('');
            setShowModalRequest(false);
          }}
        >
          <Modal.Header>
            <Modal.Title>Solicitud de modificación</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Comentario</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={comentario}
                onChange={e => setComentario(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              size="sm"
              variant="danger"
              onClick={() => {
                setComentario('');
                setShowModalRequest(false);
              }}
            >
              Cancelar
            </Button>

            <Button
              size="sm"
              variant="success"
              disabled={!comentario}
              onClick={async () => {
                if (!loading) {
                  setLoading(true);
                  await dispatch(
                    aprobarRechazarTransaccion(
                      transaccion.id,
                      'request',
                      comentario
                    )
                  );
                  await dispatch(
                    all
                      ? transaccionGetAll()
                      : transaccionGetAllByAdminId(user.id)
                  );
                  setShowModalRequest(false);
                  setTransactionId(null);
                  setLoading(false);
                }
              }}
            >
              {loading ? <Spinner animation="border" size="sm" /> : 'Enviar'}
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

ViewTransaction.propTypes = {
  transactionId: PropTypes.number,
  setTransactionId: PropTypes.func.isRequired,
  all: PropTypes.bool,
  onlyView: PropTypes.bool
};

export default ViewTransaction;
