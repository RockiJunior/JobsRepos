import { Field, Form, Formik } from 'formik';
import moment from 'moment';
import 'moment/locale/es';
import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { editCollab, getCollabById } from 'redux/colabsSlice';
import { HavePermission } from 'utils/HavePermission';
import ButtonClose from 'utils/buttons/buttonClose';
import ButtonSuccessSubmit from 'utils/buttons/buttonSuccessSubmit';
import { createUserSchema } from '../validations/UserValidation';
moment.locale('es');

const EditModal = ({
  setShow,
  realEstateBranchOffices,
  id,
  roles,
  switchNewUser,
  setSwitchNewUser
}) => {
  const dispatch = useDispatch();
  const userLogged = useSelector(state => state.login.currentUser);

  const token = localStorage.getItem('token');
  const [data, setData] = useState();
  const [branchOffices, setBranchOffices] = useState();
  const [validData, setValidData] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingButton, setLoadingButton] = useState(false);

  const fetchUser = async id => {
    try {
      const data = await dispatch(getCollabById(id, token));
      setData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUser(id);
  }, []);

  useEffect(() => {
    if (isLoading && data) {
      let branchOfficesList = {};
      realEstateBranchOffices.map(
        branchOff =>
          (branchOfficesList = {
            ...branchOfficesList,
            [branchOff.id]: {
              branchOfficeId: branchOff.id,
              name: branchOff.branch_office_name,
              active: false,
              roleId: 0,
              roleName: ''
            }
          })
      );
      data.roleToUser.map(office => {
        return (branchOfficesList = {
          ...branchOfficesList,
          [office.branch_office_id]: {
            active: true,
            roleId: office.role.id,
            roleName: office.role.name,
            branchOfficeId: office.branch_office_id
          }
        });
      });
      setBranchOffices(branchOfficesList);
      setIsLoading(false);
    }
  }, [data]);

  //Handlers
  const handleSubmit = async values => {
    try {
      if (!loadingButton) {
        setLoadingButton(true);
        let userData = {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phoneNumber: values.phoneNumber,
          dni: values.dni,
          branchOffices: Object.values(branchOffices)
        };
        const response = await dispatch(
          editCollab(data.id, userData, branchOffices, token)
        );
        setLoadingButton(false);
        handleClose();
        setSwitchNewUser(!switchNewUser);
      }
    } catch (e) {
      setLoadingButton(false);
    }
  };

  const handleSwitch = e => {
    setBranchOffices({
      ...branchOffices,
      [e.target.id]: {
        ...branchOffices[e.target.id],
        roleId: null,
        roleName: null,
        active: !branchOffices[e.target.id].active
      }
    });
  };

  const handleSelect = (e, branchOfficeId) => {
    let rol = roles.find(rol => rol.id === parseInt(e.target.value));
    setBranchOffices({
      ...branchOffices,
      [branchOfficeId]: {
        ...branchOffices[branchOfficeId],
        roleId: rol.id,
        roleName: rol.name
      }
    });
  };

  const handleRoles = () => {
    if (realEstateBranchOffices && realEstateBranchOffices.length > 0) {
      let validRoles = true;
      realEstateBranchOffices.map(sucursal => {
        const role = branchOffices[sucursal.id];
        if (role?.active && role?.roleId === null) validRoles = false;
      });
      setValidData(validRoles);
    }
  };

  useEffect(() => {
    realEstateBranchOffices && branchOffices && handleRoles();
  }, [branchOffices]);

  const handleClose = e => {
    setShow(false);
  };

  return (
    <Modal
      show={true}
      onHide={() => setShow(false)}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          Editar un usuario
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {data && branchOffices && (
          <Formik
            initialValues={{
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
              dni: data.dni,
              phoneNumber: data.phoneNumber
            }}
            validationSchema={createUserSchema}
            onSubmit={values => handleSubmit(values)}
          >
            {({ errors, touched }) => (
              <Form>
                <div className="d-flex flex-row justify-content-around w-100">
                  <div
                    style={{ maxWidth: 400, minWidth: 300 }}
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
                        <label style={{ color: '#da1717e8' }}>
                          {errors.dni}
                        </label>
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

                  <div style={{ maxWidth: 400, minWidth: 250 }}>
                    <h5 className="mb-4">Seleccionar Roles:</h5>

                    {realEstateBranchOffices?.map((office, index) => {
                      if (HavePermission('Edit users', userLogged, office.id))
                        return (
                          <div key={index} className="form-check form-switch">
                            <div>
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={office.id}
                                onChange={handleSwitch}
                                checked={
                                  branchOffices[office.id] !== 'undefined'
                                    ? branchOffices[office.id]?.active
                                    : false
                                }
                              />

                              <label
                                className="form-check-label"
                                htmlFor="sucursal1"
                              >
                                {office.branch_office_name}
                              </label>
                            </div>

                            {branchOffices[office.id] !== 'undefined' &&
                              branchOffices[office.id]?.active && (
                                <select
                                  defaultValue={
                                    branchOffices[office.id]?.roleId
                                  }
                                  id={office.id}
                                  onChange={e => handleSelect(e, office.id)}
                                  style={{ maxWidth: 300 }}
                                  className="form-select form-select-sm mb-1"
                                  aria-label="Default select example"
                                >
                                  <option value={0} hidden>
                                    Seleccionar un rol
                                  </option>

                                  {roles.map((role, index) => (
                                    <option key={index} value={role.id}>
                                      {role.name}
                                    </option>
                                  ))}
                                </select>
                              )}

                            {branchOffices[office.id].active &&
                              branchOffices[office.id].roleId === null && (
                                <label style={{ color: '#da1717e8' }}>
                                  Para asignar una sucursal debe elegir un rol.
                                </label>
                              )}
                          </div>
                        );
                    })}
                  </div>
                </div>

                <div
                  className="d-flex justify-content-end mt-5"
                  style={{ gap: 30 }}
                >
                  <ButtonClose text="Cancelar" funcion={handleClose} />

                  <ButtonSuccessSubmit
                    text={loadingButton ? 'Cargando...' : 'Editar Usuario'}
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
        )}
      </Modal.Body>
    </Modal>
  );
};

export default EditModal;
