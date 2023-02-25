import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';

const CreateModal = ({ setModalShow, modalShow }) => {
    return (
        <Modal
            show={modalShow}
            onHide={() => setModalShow(false)}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">Gestión de propiedades</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div
                    style={{ backgroundColor: 'rgba(0,0,0,.1)' }}
                    className="d-flex flex-column justify-content-center px-5 py-3"
                >
                    <form>
                        <h4>Crear nueva propiedad</h4>
                        <div className='d-flex justify-content-'>
                            <div className="mb-4 me-4" style={{ width: '100%' }}>
                                Ubicación
                                <input
                                    type="number"
                                    className="form-control mb-2"
                                    required
                                    id="calle"
                                    aria-describedby="calleHelp"
                                    placeholder="Calle"
                                />
                                <input
                                    type="number"
                                    className="form-control mb-2"
                                    required
                                    id="altura"
                                    aria-describedby="alturaHelp"
                                    placeholder="Altura"
                                />
                                <input
                                    type="number"
                                    className="form-control mb-2"
                                    required
                                    id="piso"
                                    aria-describedby="pisoHelp"
                                    placeholder="Piso"
                                />
                                <input
                                    type="number"
                                    className="form-control mb-2"
                                    required
                                    id="departamento"
                                    aria-describedby="departamentoHelp"
                                    placeholder="Departamento"
                                />
                                <input
                                    type="number"
                                    className="form-control mb-2"
                                    required
                                    id="lat"
                                    aria-describedby="latlHelp"
                                    placeholder="Latitud"
                                />
                                <input
                                    type="number"
                                    className="form-control mb-2"
                                    required
                                    id="long"
                                    aria-describedby="longlHelp"
                                    placeholder="Longitud"
                                />
                            </div>
                            <div className="mb-4 ms-4" style={{ width: '100%' }}>
                                Caracteristicas
                                <div className='d-flex align-items-center'>
                                    <label className="form-check-label" htmlFor="superficieTotal">
                                        Superficie total:
                                    </label>
                                    <input
                                        type="number"
                                        className="form-control mb-2"
                                        required
                                        id="superficeTotal"
                                        aria-describedby="superficeTotalHelp"
                                    />
                                </div>
                                <div className='d-flex align-items-center'>
                                    <label className="form-check-label" htmlFor="superficieCubierta">
                                        Superficie cubierta:
                                    </label>
                                    <input
                                        type="number"
                                        className="form-control mb-2"
                                        required
                                        id="superficieCubierta"
                                        aria-describedby="superficieCubiertaHelp"
                                    />
                                </div>
                                <div className='d-flex align-items-center'>
                                    <label className="form-check-label" htmlFor="dormitorios">
                                        Dormitorios:
                                    </label>
                                    <input
                                        type="number"
                                        className="form-control mb-2"
                                        required
                                        id="dormitorios"
                                        aria-describedby="dormitoriosHelp"
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default CreateModal;