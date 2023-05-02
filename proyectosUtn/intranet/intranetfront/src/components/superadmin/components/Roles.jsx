import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  saCreateRol,
  saDeleteRol,
  saGetPermissions,
  saGetRoles,
  saUpdateRol
} from 'redux/actions/superadmin';
import AdvanceTable from 'components/common/advance-table/AdvanceTable';
import AdvanceTablePagination from 'components/common/advance-table/AdvanceTablePagination';
import AdvanceTableWrapper from 'components/common/advance-table/AdvanceTableWrapper';
import { Col, Row, Form, Button, Spinner, Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { capitalize, decapitalize } from 'utils/capitalize';
import permisosData from 'data/permisos';
import { checkPermissions } from 'utils/checkPermissionsArea';

const transformRolData = rol => {
  const { nombre, PermisoRol, id } = rol;
  const permisos = PermisoRol.map(permisoRol => permisoRol.permiso.id);

  return { nombre, permisos, id };
};

const Roles = ({ createRol, setCreateRol }) => {
  const dispatch = useDispatch();

  const { roles } = useSelector(state => state.saReducer);
  const { user } = useSelector(state => state.authReducer);

  const [pageIndex, setPageIndex] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [pageArray, setPageArray] = useState([]);

  const [selectedRol, setSelectedRol] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editSelectedRol, setEditSelectedRol] = useState(false);
  const [newRol, setNewRol] = useState({
    nombre: '',
    permisos: []
  });

  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  useEffect(() => {
    dispatch(saGetRoles());
    dispatch(saGetPermissions());
  }, []);

  useEffect(() => {
    if (roles.length > 0 && !selectedRol) {
      setSelectedRol(transformRolData(roles[0]));
    } else if (roles.length && selectedRol) {
      setSelectedRol(
        transformRolData(
          roles.find(rol => rol.id === selectedRol.id) || roles[0]
        )
      );
    }

    setPageCount(Math.ceil(roles.length / 10));
  }, [roles]);

  useEffect(() => {
    if (roles.length > 0) {
      setPageArray(roles.slice((pageIndex - 1) * 10, pageIndex * 10));
    }
  }, [pageIndex, roles]);

  useEffect(() => {
    if (!createRol) {
      setNewRol({
        nombre: '',
        permisos: []
      });
    }
  }, [createRol]);

  return (
    <>
      <Row>
        <Col
          xs={12}
          md={4}
          lg={3}
          xl={2}
          className="d-flex flex-column justify-content-start"
        >
          <Form.Select
            size="md"
            className="mb-4 d-md-none"
            onChange={e => {
              const rol = roles.find(rol => rol.id === Number(e.target.value));
              setSelectedRol(transformRolData(rol));
              setEditSelectedRol(false);
              setCreateRol(false);
              setNewRol({
                nombre: '',
                permisos: []
              });
            }}
          >
            {roles.map(rol => (
              <option
                key={rol.id}
                value={rol.id}
                selected={selectedRol && rol.id === selectedRol.id}
              >
                {capitalize(rol.nombre)}
              </option>
            ))}
          </Form.Select>

          <div className="border border-primary rounded p-1 pb-3 d-none d-md-inline">
            <AdvanceTableWrapper
              columns={[
                {
                  Header: 'Nombre',
                  accessor: 'nombre',
                  Cell: ({ value }) => capitalize(value)
                }
              ]}
              data={pageArray}
              pagination
              perPage={10}
            >
              <AdvanceTable
                table
                headerClassName="text-center d-none"
                rowClassName="text-center fw-bold"
                noResponsive
                rowOnClick={row => {
                  setSelectedRol(transformRolData(row));
                  setEditSelectedRol(false);
                  setCreateRol(false);
                  setNewRol({
                    nombre: '',
                    permisos: []
                  });
                }}
              />

              <AdvanceTablePagination
                pageIndex={pageIndex}
                pageCount={pageCount}
                limit={10}
                gotoPage={pageIndex => {
                  setPageIndex(pageIndex + 1);
                }}
                canNextPage={pageIndex < pageCount}
                canPreviousPage={pageIndex > 1}
                nextPage={() => {
                  setPageIndex(pageIndex + 1);
                }}
                previousPage={() => {
                  setPageIndex(pageIndex - 1);
                }}
              />
            </AdvanceTableWrapper>
          </div>
        </Col>
        {createRol &&
        checkPermissions([permisosData.roles.crear_roles], user.empleado) ? (
          <Col xs={12} md={8} lg={9} xl={10}>
            <div className="d-flex align-items-center">
              <Form.Group>
                <Form.Control
                  size="lg"
                  className="py-0"
                  type="text"
                  value={capitalize(newRol.nombre)}
                  onChange={e => {
                    setNewRol({
                      ...newRol,
                      nombre: decapitalize(e.target.value)
                    });
                  }}
                  style={{ width: 'fit-content' }}
                />
              </Form.Group>
            </div>
            <hr />
            <Row>
              {Object.keys(permisosData)
                .sort(
                  (a, b) =>
                    Object.keys(permisosData[b]).length -
                    Object.keys(permisosData[a]).length
                )
                .map(key => {
                  const permisos = permisosData[key];

                  return (
                    <Col xs={12} sm={6} xl={4} xxl={3} key={key}>
                      <Form.Label className="text-dark">
                        <strong>{capitalize(key)}</strong>
                      </Form.Label>
                      {Object.keys(permisos).map(key => {
                        const permisoId = permisos[key];
                        const nombre = key;

                        return (
                          <Form.Group key={permisoId}>
                            <Form.Check
                              type="switch"
                              id={nombre}
                              className="m-0"
                              label={capitalize(nombre)}
                              checked={
                                newRol?.permisos
                                  ? newRol.permisos.includes(permisoId)
                                  : false
                              }
                              onChange={e => {
                                if (e.target.checked) {
                                  setNewRol(state => ({
                                    ...state,
                                    permisos: [...state.permisos, permisoId]
                                  }));
                                } else {
                                  setNewRol(state => ({
                                    ...state,
                                    permisos: state.permisos.filter(
                                      permiso => permiso !== permisoId
                                    )
                                  }));
                                }
                              }}
                            />
                          </Form.Group>
                        );
                      })}
                    </Col>
                  );
                })}
            </Row>

            <hr />

            <div className="float-end">
              <Button
                size="sm"
                variant="danger"
                className="me-2"
                onClick={() => {
                  setCreateRol(false);
                }}
              >
                Cancelar
              </Button>

              <Button
                size="sm"
                variant="success"
                onClick={async () => {
                  setLoading(true);
                  const { nombre, permisos } = newRol;
                  await dispatch(saCreateRol(nombre, permisos));
                  await dispatch(saGetRoles());

                  setCreateRol(false);
                  setNewRol({
                    nombre: '',
                    permisos: []
                  });
                  setLoading(false);
                }}
                disabled={loading}
              >
                {loading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  'Guardar cambios'
                )}
              </Button>
            </div>
          </Col>
        ) : (
          <Col xs={12} md={8} lg={9} xl={10}>
            <div className="d-flex align-items-center">
              <h4 className="m-0">
                {selectedRol ? (
                  editSelectedRol &&
                  checkPermissions(
                    [permisosData.roles.modificar_roles],
                    user.empleado
                  ) ? (
                    <Form.Group>
                      <Form.Control
                        size="lg"
                        className="py-0"
                        type="text"
                        value={capitalize(selectedRol.nombre)}
                        onChange={e => {
                          setSelectedRol({
                            ...selectedRol,
                            nombre: decapitalize(e.target.value)
                          });
                        }}
                        style={{ width: 'fit-content' }}
                      />
                    </Form.Group>
                  ) : (
                    capitalize(selectedRol.nombre)
                  )
                ) : (
                  'Seleccione un rol para ver sus permisos'
                )}
              </h4>
              {checkPermissions(
                [permisosData.roles.modificar_roles],
                user.empleado
              ) && (
                <Button
                  variant="link"
                  className="p-0 ms-2"
                  onClick={() => setEditSelectedRol(state => !state)}
                >
                  <FontAwesomeIcon icon="edit" />
                </Button>
              )}
            </div>
            <hr />
            <Row className="g-3">
              {Object.keys(permisosData)
                .sort(
                  (a, b) =>
                    Object.keys(permisosData[b]).length -
                    Object.keys(permisosData[a]).length
                )
                .map(key => {
                  const permisos = permisosData[key];

                  return (
                    <Col xs={12} sm={6} xl={4} xxl={3} key={key}>
                      <Form.Label className="text-dark">
                        <strong>{capitalize(key)}</strong>
                      </Form.Label>
                      {Object.keys(permisos).map(key => {
                        const permisoId = permisos[key];
                        const nombre = key;

                        return (
                          <Form.Group key={permisoId}>
                            <Form.Check
                              type="switch"
                              id={nombre}
                              className="m-0"
                              label={capitalize(nombre)}
                              checked={
                                selectedRol?.permisos
                                  ? selectedRol.permisos.includes(permisoId)
                                  : false
                              }
                              onChange={e => {
                                if (
                                  checkPermissions(
                                    [permisosData.roles.modificar_roles],
                                    user.empleado
                                  )
                                ) {
                                  if (e.target.checked) {
                                    setSelectedRol({
                                      ...selectedRol,
                                      permisos: [
                                        ...selectedRol.permisos,
                                        permisoId
                                      ]
                                    });
                                  } else {
                                    setSelectedRol({
                                      ...selectedRol,
                                      permisos: selectedRol.permisos.filter(
                                        permiso => permiso !== permisoId
                                      )
                                    });
                                  }
                                }
                              }}
                            />
                          </Form.Group>
                        );
                      })}
                    </Col>
                  );
                })}
            </Row>

            {checkPermissions(
              [
                [
                  permisosData.roles.modificar_roles,
                  permisosData.roles.eliminar_roles
                ]
              ],
              user.empleado
            ) && <hr />}

            {checkPermissions(
              [permisosData.roles.eliminar_roles],
              user.empleado
            ) && (
              <Button
                size="sm"
                variant="danger"
                className="float-start"
                onClick={async () => {
                  setOpenDeleteModal(true);
                }}
              >
                Eliminar rol
              </Button>
            )}

            {checkPermissions(
              [permisosData.roles.modificar_roles],
              user.empleado
            ) && (
              <div className="float-end">
                <Button
                  size="sm"
                  variant="warning"
                  className="me-2"
                  onClick={() => {
                    setEditSelectedRol(false);
                    setSelectedRol(
                      transformRolData(
                        roles.find(rol => rol.id === selectedRol.id)
                      )
                    );
                  }}
                >
                  Cancelar
                </Button>

                <Button
                  size="sm"
                  variant="success"
                  onClick={async () => {
                    setLoading(true);
                    const { id, nombre, permisos } = selectedRol;
                    await dispatch(saUpdateRol(id, nombre, permisos));
                    await dispatch(saGetRoles());

                    setEditSelectedRol(false);
                    setLoading(false);
                  }}
                  disabled={loading}
                >
                  {loading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    'Guardar cambios'
                  )}
                </Button>
              </div>
            )}
          </Col>
        )}
      </Row>

      {selectedRol && (
        <Modal
          show={openDeleteModal}
          onHide={() => setOpenDeleteModal(false)}
          contentClassName="border"
          centered
        >
          <Modal.Header
            closeButton
            className="bg-light px-card border-bottom-0"
          >
            <h5 className="mb-0">
              ¿Está seguro que desea eliminar el rol{' '}
              {capitalize(selectedRol.nombre)}?
            </h5>
          </Modal.Header>
          <Modal.Body className="d-flex justify-content-center">
            <Button
              size="sm"
              variant="success"
              className="me-1"
              onClick={async () => {
                await dispatch(saDeleteRol(selectedRol.id));
                await dispatch(saGetRoles());
                setOpenDeleteModal(false);
              }}
            >
              <span>Si</span>
            </Button>

            <Button
              className="ms-1"
              size="sm"
              variant="danger"
              onClick={() => setOpenDeleteModal(false)}
            >
              <span>No</span>
            </Button>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

Roles.propTypes = {
  createRol: PropTypes.bool,
  setCreateRol: PropTypes.func
};

export default Roles;
