import { Field, Form, Formik } from 'formik';
import moment from 'moment';
import 'moment/locale/es';
import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { createColab, getColabs } from 'redux/colabsSlice';
import { HavePermission } from 'utils/HavePermission';
import ButtonClose from 'utils/buttons/buttonClose';
import ButtonSuccessSubmit from 'utils/buttons/buttonSuccessSubmit';
import { createUserSchema } from '../validations/UserValidation';
moment.locale('es');

const CreateModal = ({ setModalShow, modalShow, roles, branchOffices }) => {
  const userLogged = useSelector(state => state.login.currentUser);
  const token = localStorage.getItem('token');
  const tablaSucursales = [];
  for (let i = 0; i < branchOffices?.length; i++) {
    tablaSucursales.push({ ...branchOffices[i], active: false, roleId: null });
  }
  let sucursalesId = {};

  const dispatch = useDispatch();
  const [validData, setValidData] = useState(true);
  const [loadingButton, setLoadingButton] = useState(false);
  const [newUser, setNewUser] = useState({});
  const [initialValues, setInitialValues] = useState({});

  useEffect(() => {
    branchOffices.length > 0 &&
      branchOffices.map(
        office =>
          (sucursalesId[office.id] = {
            branchOfficeId: office.id,
            active: false,
            roleId: null
          })
      );
    setNewUser(sucursalesId);
    setInitialValues(sucursalesId);
  }, [branchOffices]);

  const handleSubmit = async values => {
    if (loadingButton || !validData) {
      return null;
    } else {
      setLoadingButton(true);
      let userData = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        dni: values.dni,
        branchOffices: Object.values(newUser)
      };
      const response = await dispatch(createColab(userData, token));
      if (response?.status < 400) {
        setModalShow(false);
        setLoadingButton(false);
        setNewUser(initialValues);
        dispatch(getColabs(token));
      } else {
        setLoadingButton(false);
      }
    }
  };

  const handleSwitch = e => {
    setNewUser({
      ...newUser,
      [e.target.id]: {
        ...newUser[e.target.id],
        active: !newUser[e.target.id].active
      }
    });
  };

  const handleSelect = (e, branchOfficeId) => {
    setNewUser({
      ...newUser,
      [branchOfficeId]: {
        ...newUser[branchOfficeId],
        roleId: Number(e.target.value)
      }
    });
  };

  const handleRoles = () => {
    if (tablaSucursales && tablaSucursales.length > 0) {
      let validRoles = true;
      tablaSucursales.map(sucursal => {
        const role = newUser[sucursal.id];
        if (role?.active && role?.roleId === null) validRoles = false;
      });
      setValidData(validRoles);
    }
  };

  useEffect(() => {
    tablaSucursales && newUser && handleRoles();
  }, [newUser]);

  return (
    <Modal
      show={modalShow}
      onHide={() => setModalShow(false)}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Crear nuevo usuario
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            email: '',
            dni: '',
            phoneNumber: ''
          }}
          validationSchema={createUserSchema}
          onSubmit={values => handleSubmit(values)}
        >
          {({ errors, touched }) => (
            <Form>
              <div className="d-flex flex-row justify-content-around w-100">
                <div
                  style={{ maxWidth: '45%', minWidth: '45%' }}
                  className="mb-4 d-flex flex-column"
                >
                  <h5 className="mb-4">Información personal</h5>

                  <div style={{ maxWidth: 250 }}>
                    <label>Nombre*</label>

                    <Field
                      className="form-control form-control-sm"
                      name="firstName"
                    />

                    {errors.firstName && touched.firstName ? (
                      <label style={{ color: '#da1717e8' }}>
                        {errors.firstName}
                      </label>
                    ) : null}
                  </div>

                  <div style={{ maxWidth: 250 }}>
                    <label>Apellido*</label>

                    <Field
                      className="form-control form-control-sm"
                      name="lastName"
                    />

                    {errors.lastName && touched.lastName ? (
                      <label style={{ color: '#da1717e8' }}>
                        {errors.lastName}
                      </label>
                    ) : null}
                  </div>

                  <div style={{ maxWidth: 250 }}>
                    <label>Email*</label>

                    <Field
                      className="form-control form-control-sm"
                      name="email"
                      type="email"
                    />

                    {errors.email && touched.email ? (
                      <label style={{ color: '#da1717e8' }}>
                        {errors.email}
                      </label>
                    ) : null}
                  </div>

                  <div style={{ maxWidth: 250 }}>
                    <label>DNI*</label>

                    <Field
                      className="form-control form-control-sm"
                      name="dni"
                      type="number"
                    />

                    {errors.dni && touched.dni ? (
                      <label style={{ color: '#da1717e8' }}>{errors.dni}</label>
                    ) : null}
                  </div>

                  <div style={{ maxWidth: 250 }}>
                    <label>Teléfono</label>

                    <Field
                      className="form-control form-control-sm"
                      name="phoneNumber"
                      type="number"
                    />

                    {errors.phoneNumber && touched.phoneNumber ? (
                      <label style={{ color: '#da1717e8' }}>
                        {errors.phoneNumber}
                      </label>
                    ) : null}
                  </div>
                </div>

                <div
                  className="d-flex flex-column justify-content-between"
                  style={{ maxWidth: '45%', minWidth: '45%' }}
                >
                  <div>
                    <h5 className="mb-4">Seleccionar Roles:</h5>

                    {newUser &&
                      tablaSucursales.length > 0 &&
                      tablaSucursales.map((sucursal, index) => {
                        if (
                          HavePermission(
                            'Create users',
                            userLogged,
                            sucursal.id
                          )
                        )
                          return (
                            <div key={index} className="form-check form-switch">
                              <div>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id={sucursal.id}
                                  onChange={handleSwitch}
                                  checked={
                                    newUser[sucursal.id]
                                      ? newUser[sucursal.id].active
                                      : false
                                  }
                                />

                                <label
                                  className="form-check-label"
                                  htmlFor="sucursal1"
                                >
                                  {sucursal.branch_office_name}
                                </label>
                              </div>

                              {newUser[sucursal.id] &&
                                newUser[sucursal.id].active && (
                                  <select
                                    id={sucursal.id}
                                    onChange={e => handleSelect(e, sucursal.id)}
                                    style={{ maxWidth: 300 }}
                                    className="form-select form-select-sm mb-1"
                                    aria-label="Default select example"
                                  >
                                    <option defaultValue value={0}>
                                      Seleccionar un rol
                                    </option>

                                    {roles.map((role, index) => (
                                      <option key={index} value={role.id}>
                                        {role.name}
                                      </option>
                                    ))}
                                  </select>
                                )}

                              {newUser[sucursal.id].active &&
                                newUser[sucursal.id].roleId === null && (
                                  <label style={{ color: '#da1717e8' }}>
                                    Para asignar una sucursal debe elegir un
                                    rol.
                                  </label>
                                )}
                            </div>
                          );
                      })}
                  </div>

                  <h6>
                    El usuario recibirá un email con el enlace de activación de
                    su cuenta.
                    <br />
                    No podrá ingresar hasta activarla.
                  </h6>
                </div>
              </div>

              <div
                className="d-flex justify-content-end mt-5"
                style={{ gap: 30 }}
              >
                <ButtonClose
                  text="Cancelar"
                  funcion={() => setModalShow(false)}
                />

                <ButtonSuccessSubmit
                  text={loadingButton ? 'Cargando...' : 'Crear usuario'}
                  disabled={
                    !!errors.firstName ||
                    !!errors.lastName ||
                    !!errors.email ||
                    !!errors.dni ||
                    !!errors.phoneNumber ||
                    loadingButton ||
                    !validData
                  }
                />
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default CreateModal;
