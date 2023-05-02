import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  InputGroup,
  Form,
  Col,
  Button,
  Card,
  Row,
  Modal
} from 'react-bootstrap';
import {
  deleteDocument,
  elegirCuotas,
  tramiteGetById,
  uploadPayment
} from 'redux/actions/tramite';
import { useDispatch } from 'react-redux';
import getStatusIcon from 'components/common/getStatusIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import RenderPreview from 'components/common/RenderPreview';
import comprimirImagen from 'utils/comprimirImagen';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import InfoTransacciones from './InfoTransacciones';

const Transaccion = ({
  transaccion,
  userId,
  transaccionesPorPagar,
  setTransaccionesPorPagar
}) => {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [paid, setPaid] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

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
    setPreviews(
      transaccion.comprobante.map(comprobante => comprobante.archivoUbicacion)
    );

    setFiles([]);
  }, [transaccion]);

  const inputRef = useRef();

  const [opcionCuota, setOpcionCuota] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [showInfoTransacciones, setShowInfoTransacciones] = useState(false);

  return (
    <>
      <Col xs={12} lg={6} key={transaccion.id} className="border p-2">
        <InputGroup size="sm" className="d-flex justify-content-between mb-3">
          <InputGroup.Text
            style={{ flexGrow: 1 }}
            className="bg-primary text-light"
          >
            Transacción
          </InputGroup.Text>
          <InputGroup.Text className="bg-secondary text-light">
            <strong>{dayjs(transaccion.fecha).format('DD/MM/YY')}</strong>
          </InputGroup.Text>
          {getStatusIcon(transaccion.estado)}
        </InputGroup>

        {transaccion.comentario && transaccion.estado === 'request' && (
          <ul className="text-danger">
            <li className="fw-bold">{transaccion.comentario}</li>
          </ul>
        )}
        <Row>
          <Col xs={12} className="mb-3 px-4">
            <Row>
              <Col>
                <Card.Title className="text-dark">
                  <strong>Detalle:</strong>
                </Card.Title>

                <ul className="mb-0 text-dark">
                  {transaccion.tipoTransaccion?.TipoTransaccionConcepto.map(
                    tc => (
                      <li key={tc.concepto.id}>{tc.concepto.nombre}</li>
                    )
                  )}
                </ul>
              </Col>
              {!!transaccion.monto && (
                <Col xs={12} className="mb-3 px-4">
                  <Card.Title className="text-dark text-end">
                    Monto: <strong>${transaccion.monto}</strong>
                  </Card.Title>
                </Col>
              )}
            </Row>

            {!transaccion.opcionCuotasId && (
              <>
                <div className="d-flex justify-content-center">
                  <Button
                    size="sm"
                    variant="info"
                    className="mt-2 text-dark"
                    onClick={() => setShowInfoTransacciones(true)}
                  >
                    <FontAwesomeIcon icon="info-circle" className="me-2" />
                    <span>Información sobre los pagos</span>
                  </Button>
                </div>

                <InfoTransacciones
                  show={showInfoTransacciones}
                  setShow={setShowInfoTransacciones}
                />

                <Form.Group className="my-3">
                  <Form.Label className="text-dark">
                    Cantidad de pagos:
                    <strong className="text-danger">*</strong>
                  </Form.Label>
                  <Form.Select
                    size="sm"
                    name="cantidadPagos"
                    onChange={e =>
                      setOpcionCuota(
                        transaccion.tipoTransaccion.opcionesCuotas.find(
                          opcionCuotas =>
                            opcionCuotas.id === Number(e.target.value)
                        )
                      )
                    }
                  >
                    <option value="">Seleccione una opción</option>
                    {transaccion.tipoTransaccion.opcionesCuotas.map(
                      opcionCuotas => (
                        <option key={opcionCuotas.id} value={opcionCuotas.id}>
                          {opcionCuotas.cantidad === 1
                            ? `1 pago${
                                transaccion.tipoTransaccion.nombre ===
                                  'matriculacion2' ||
                                transaccion.tipoTransaccion.nombre ===
                                  'matriculacion3'
                                  ? ' (con descuento)'
                                  : ''
                              }`
                            : `${opcionCuotas.cantidad} pagos${
                                opcionCuotas.interes
                                  ? ` (+${opcionCuotas.interes}% de interés)`
                                  : ''
                              }`}
                        </option>
                      )
                    )}
                  </Form.Select>
                </Form.Group>
              </>
            )}

            {opcionCuota && (
              <Row className="position-relative">
                <Col xs={12}>
                  <strong className="text-dark">Cuotas:</strong>
                  <ul className="mb-0 text-dark">
                    {opcionCuota.cuotas.map(cuota => (
                      <li key={cuota.id}>
                        {cuota.id} - $
                        {cuota.monto ||
                          (
                            (transaccion.montoDinamico +
                              (transaccion.montoDinamico *
                                opcionCuota.interes) /
                                100) /
                            opcionCuota.cantidad
                          ).toFixed(0)}
                      </li>
                    ))}
                  </ul>
                  <div className="text-end ">
                    <strong className="text-dark">Total: </strong>
                    <span className="mb-0 text-dark">
                      $
                      {opcionCuota.monto ||
                        transaccion.montoDinamico +
                          (transaccion.montoDinamico * opcionCuota.interes) /
                            100}
                    </span>
                  </div>
                </Col>

                <Col xs={12} className="d-flex justify-content-end">
                  <Button
                    className="mt-2"
                    size="sm"
                    variant="primary"
                    onClick={() => {
                      setOpenModal(true);
                    }}
                  >
                    Elegir
                  </Button>
                </Col>
              </Row>
            )}
          </Col>
        </Row>

        {transaccion.opcionCuotasId && (
          <>
            <hr />

            <Row className="g-2">
              {transaccion.comprobante.map(comprobante => (
                <Col
                  xs={6}
                  key={comprobante.id}
                  className="position-relative d-flex flex-column justify-content-between"
                >
                  {(transaccion.estado === 'pending' ||
                    transaccion.estado === 'request') && (
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
                        await dispatch(deleteDocument(comprobante.id));
                        await dispatch(tramiteGetById(transaccion.tramiteId));
                      }}
                    >
                      <FontAwesomeIcon
                        className="p-0 m-0 text-danger"
                        icon="xmark-circle"
                      />
                    </Button>
                  )}
                  <Card>
                    <RenderPreview
                      preview={comprobante.archivoUbicacion}
                      alt="preview"
                      isSmall
                    />
                  </Card>
                </Col>
              ))}
            </Row>

            <Form.Group className="mb-3">
              {previews && !!previews.length && (
                <Row className="g-2">
                  {files.map((file, i) => {
                    return (
                      <Col
                        xs={6}
                        key={`p${i}`}
                        className="position-relative d-flex flex-column justify-content-between"
                      >
                        {!paid && (
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
                        )}
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

            {(transaccion.estado === 'request' ||
              transaccion.estado === 'pending') &&
              !paid && (
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
                      style={{ backgroundColor: 'var(--falcon-input-color)' }}
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
              )}

            {(transaccion.estado === 'request' ||
              transaccion.estado === 'pending') && (
              <div className="d-flex justify-content-end">
                {!!files.length && !paid && (
                  <Button
                    variant="primary"
                    size="sm"
                    className="mt-2"
                    onClick={async () => {
                      if (files.length || !loading) {
                        setLoading(true);
                        await dispatch(
                          uploadPayment(files, transaccion.id, userId)
                        );
                        setTransaccionesPorPagar(transaccionesPorPagar - 1);
                        setPaid(true);

                        if (transaccionesPorPagar === 1) {
                          await dispatch(tramiteGetById(transaccion.tramiteId));
                          setFiles([]);
                        }
                        setLoading(false);
                      }
                    }}
                    disabled={loading || !files.length}
                  >
                    Enviar comprobante/s
                  </Button>
                )}
              </div>
            )}
          </>
        )}

        {transaccion.estado === 'sent' && (
          <div>
            <strong className="text-warning">
              Tu pago esta pendiente de confirmación, recibirás un correo cuando
              puedas continuar con el trámite.
            </strong>
          </div>
        )}
      </Col>

      {opcionCuota && (
        <Modal
          show={openModal}
          onHide={() => setOpenModal(false)}
          contentClassName="border"
          centered
        >
          <Modal.Header
            closeButton
            className="bg-light px-card border-bottom-0 d-flex align-items-start"
          >
            <Modal.Title as="h5">
              ¿Estás seguro que deseas elegir {opcionCuota.cantidad}{' '}
              {opcionCuota.cantidad === 1 ? 'pago' : 'pagos'}?
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex justify-content-center">
              <Button
                size="sm"
                variant="success"
                className="me-1"
                onClick={async () => {
                  await dispatch(elegirCuotas(transaccion.id, opcionCuota.id));
                  await dispatch(tramiteGetById(transaccion.tramiteId));
                  setOpcionCuota('');
                  setOpenModal(false);
                }}
              >
                <span>Si</span>
              </Button>
              <Button
                className="ms-1"
                size="sm"
                variant="danger"
                onClick={() => setOpenModal(false)}
              >
                <span>No</span>
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

Transaccion.propTypes = {
  transaccion: PropTypes.object.isRequired,
  userId: PropTypes.number.isRequired,
  transaccionesPorPagar: PropTypes.number,
  setTransaccionesPorPagar: PropTypes.func.isRequired
};

export default Transaccion;
