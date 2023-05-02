import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Button, Spinner, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { ToastContent } from 'components/common/Toast';
import { toast } from 'react-toastify';
import handleError from 'utils/errorHandler';
import { capitalize } from 'utils/capitalize';
import {
  saGetAreas,
  saGetEmpleados,
  saGetRoles
} from 'redux/actions/superadmin';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Select from 'react-select';

const validate = formData => {
  const errors = {};
  if (!formData.name) errors.name = 'El nombre es requerido';
  if (!formData.lastname) errors.lastname = 'El apellido es requerido';
  if (!formData.dni) errors.dni = 'El DNI es requerido';
  if (!formData.email) errors.email = 'El email es requerido';
  if (!formData.password) errors.password = 'La contraseña es requerida';
  if (!formData.confirm_password)
    errors.confirm_password = 'La confirmación de contraseña es requerida';
  if (formData.password !== formData.confirm_password)
    errors.confirm_password = 'Las contraseñas no coinciden';
  if (!formData.roles?.length) errors.roles = 'Se requiere al menos 1 rol';
  if (!formData.area) errors.area = 'El área es requerida';

  if (formData.dni.length !== 8) errors.dni = 'El DNI debe tener 8 dígitos';
  if (
    !formData.email.match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
  )
    errors.email = 'El email no es válido';

  return errors;
};

const EmpleadoModal = ({ show, onHide, hasLabel, empleado, empleados }) => {
  const { roles, areas } = useSelector(state => state.saReducer);

  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: empleado?.usuario?.nombre || '',
    lastname: empleado?.usuario?.apellido || '',
    dni: empleado?.usuario?.dni || '',
    email: empleado?.usuario?.email || '',
    roles:
      empleado?.roles?.map(r => ({
        value: r.id,
        label: capitalize(r.nombre)
      })) ||
      [] ||
      [],
    area: empleado?.area?.id || ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(saGetRoles());
    dispatch(saGetAreas());
  }, []);

  useEffect(() => {
    if (empleado) {
      setFormData({
        name: empleado?.usuario?.nombre,
        lastname: empleado?.usuario?.apellido,
        dni: empleado?.usuario?.dni,
        email: empleado?.usuario?.email,
        roles:
          empleado?.roles?.map(r => ({
            value: r.id,
            label: capitalize(r.nombre)
          })) || [],
        area: empleado?.area?.id
      });
    } else {
      setFormData({
        name: '',
        lastname: '',
        dni: '',
        email: '',
        roles: [],
        area: ''
      });
    }
  }, [empleado]);

  const handleFieldChange = e => {
    const errors = validate({ ...formData, [e.target.name]: e.target.value });
    setErrors(state => ({ ...state, [e.target.name]: errors[e.target.name] }));
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    if (!Object.keys(errors).some(key => errors[key])) {
      setLoading(true);
      try {
        if (empleado) {
          await axios.put(process.env.REACT_APP_SERVER + '/empleado/update', {
            empleadoId: empleado.usuarioId,
            nombre: formData.name,
            apellido: formData.lastname,
            dni: formData.dni,
            email: formData.email,
            roles: formData.roles.map(r => parseInt(r.value)),
            areaId: formData.area
          });

          const {
            // eslint-disable-next-line no-unused-vars
            empleados: u,
            // eslint-disable-next-line no-unused-vars
            paginasTotales,
            // eslint-disable-next-line no-unused-vars
            count,
            ...queries
          } = empleados;

          dispatch(
            saGetEmpleados({
              ...queries
            })
          );

          toast.success(
            <ToastContent
              title="Empleado editado"
              content="Se ha editado el empleado correctamente"
            />
          );
        } else {
          await axios.post(process.env.REACT_APP_SERVER + '/empleado/create', {
            nombre: formData.name,
            apellido: formData.lastname,
            dni: formData.dni,
            email: formData.email,
            constrasenia: formData.password,
            roles: formData.roles.map(r => parseInt(r.value)),
            areaId: formData.area
          });

          toast.success(
            <ToastContent
              title="Empleado creado"
              content="Se ha creado el empleado correctamente"
            />
          );
        }
        onHide();
        setFormData({
          nombre: '',
          apellido: '',
          dni: '',
          email: '',
          password: '',
          confirm_password: '',
          roles: '',
          area: ''
        });
        setErrors({});
      } catch (error) {
        handleError(error, dispatch);
      }

      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="md" centered>
      <Modal.Header closeButton>
        <Modal.Title>Crear empleado</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row className="g-2 mb-3">
            <Form.Group as={Col} sm={6} className="position-relative">
              {hasLabel && <Form.Label>Nombre</Form.Label>}
              <Form.Control
                placeholder={!hasLabel ? 'Nombre' : ''}
                value={formData.name}
                name="name"
                onChange={handleFieldChange}
                type="text"
                isInvalid={errors.name}
              />

              <FontAwesomeIcon
                style={{
                  position: 'absolute',
                  right: 10,
                  bottom: 12,
                  zIndex: 5
                }}
                className="text-danger fs--2"
                icon="asterisk"
              />

              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} sm={6} className="position-relative">
              {hasLabel && <Form.Label>Apellido</Form.Label>}
              <Form.Control
                placeholder={!hasLabel ? 'Apellido' : ''}
                value={formData.lastname}
                name="lastname"
                onChange={handleFieldChange}
                type="text"
                isInvalid={errors.lastname}
              />
              <FontAwesomeIcon
                style={{
                  position: 'absolute',
                  right: 10,
                  bottom: 12,
                  zIndex: 5
                }}
                className="text-danger fs--2"
                icon="asterisk"
              />

              <Form.Control.Feedback type="invalid">
                {errors.lastname}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Form.Group className="mb-3 position-relative">
            {hasLabel && <Form.Label>DNI</Form.Label>}
            <Form.Control
              placeholder={!hasLabel ? 'DNI' : ''}
              value={formData.dni}
              name="dni"
              onChange={handleFieldChange}
              type="number"
              isInvalid={errors.dni}
              disabled={empleado}
            />

            {!empleado && (
              <FontAwesomeIcon
                style={{
                  position: 'absolute',
                  right: 10,
                  bottom: 12,
                  zIndex: 5
                }}
                className="text-danger fs--2"
                icon="asterisk"
              />
            )}

            <Form.Control.Feedback type="invalid">
              {errors.dni}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3 position-relative">
            {hasLabel && <Form.Label>Email</Form.Label>}
            <Form.Control
              placeholder={!hasLabel ? 'Email' : ''}
              value={formData.email}
              name="email"
              onChange={handleFieldChange}
              type="text"
              isInvalid={errors.email}
            />

            <FontAwesomeIcon
              style={{
                position: 'absolute',
                right: 10,
                bottom: 12,
                zIndex: 5
              }}
              className="text-danger fs--2"
              icon="asterisk"
            />

            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>

          <Row className="g-2 mb-3">
            {!empleado && (
              <>
                <Form.Group as={Col} sm={6} className="position-relative">
                  {hasLabel && <Form.Label>Contraseña</Form.Label>}
                  <Form.Control
                    placeholder={!hasLabel ? 'Contraseña' : ''}
                    value={formData.password}
                    name="password"
                    onChange={handleFieldChange}
                    type="password"
                  />

                  <FontAwesomeIcon
                    style={{
                      position: 'absolute',
                      right: 10,
                      bottom: 12,
                      zIndex: 5
                    }}
                    className="text-danger fs--2"
                    icon="asterisk"
                  />
                </Form.Group>
                <Form.Group as={Col} sm={6} className="position-relative  ">
                  {hasLabel && <Form.Label>Confirmar contraseña</Form.Label>}
                  <Form.Control
                    placeholder={!hasLabel ? 'Confirmar contraseña' : ''}
                    value={formData.confirm_password}
                    name="confirm_password"
                    onChange={handleFieldChange}
                    type="password"
                    isInvalid={errors.confirm_password}
                  />

                  <FontAwesomeIcon
                    style={{
                      position: 'absolute',
                      right: 10,
                      bottom: 12,
                      zIndex: 5
                    }}
                    className="text-danger fs--2"
                    icon="asterisk"
                  />

                  <Form.Control.Feedback type="invalid">
                    {errors.confirm_password}
                  </Form.Control.Feedback>
                </Form.Group>
              </>
            )}

            <Form.Group as={Col} sm={12} className="position-relative">
              {hasLabel && <Form.Label>Roles</Form.Label>}

              <Select
                closeMenuOnSelect={false}
                options={roles?.map(rol => ({
                  value: rol.id,
                  label: capitalize(rol.nombre)
                }))}
                placeholder="Seleccionar"
                isMulti
                styles={{
                  control: provided => ({
                    ...provided,
                    color: 'var(--falcon-input-color)',
                    backgroundColor: 'var(--falcon-input-bg)',
                    border: '1px solid var(--falcon-input-border-color)',
                    appearance: 'none',
                    borderRadius: ' 0.25rem',
                    boxShadow: 'var(--falcon-box-shadow-inset)',
                    transition:
                      'border-color .15s ease-in-out,box-shadow .15s ease-in-out'
                  })
                }}
                value={formData.roles}
                onChange={value =>
                  setFormData(state => ({ ...state, roles: value }))
                }
              />

              <FontAwesomeIcon
                style={{
                  position: 'absolute',
                  right: 10,
                  bottom: 12,
                  zIndex: 5
                }}
                className="text-danger fs--2"
                icon="asterisk"
              />

              <Form.Control.Feedback type="invalid">
                {errors.roles}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} sm={12} className="position-relative">
              {hasLabel && <Form.Label>Área</Form.Label>}
              <Form.Control
                as="select"
                value={formData.area}
                name="area"
                onChange={handleFieldChange}
                isInvalid={errors.area}
              >
                <option value="">Seleccionar</option>
                {areas?.map(area => (
                  <option key={area.id} value={area.id}>
                    {area.nombre}
                  </option>
                ))}
              </Form.Control>

              <FontAwesomeIcon
                style={{
                  position: 'absolute',
                  right: 10,
                  bottom: 12,
                  zIndex: 5
                }}
                className="text-danger fs--2"
                icon="asterisk"
              />

              <Form.Control.Feedback type="invalid">
                {errors.area}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="danger"
          size="sm"
          onClick={() => {
            onHide();
            setFormData({
              nombre: '',
              apellido: '',
              dni: '',
              email: '',
              password: '',
              confirm_password: '',
              roles: [],
              area: ''
            });
            setErrors({});
          }}
        >
          Cancelar
        </Button>
        <Button
          disabled={
            !formData.name ||
            !formData.lastname ||
            !formData.email ||
            (!empleado && !formData.password) ||
            (!empleado && !formData.confirm_password) ||
            !formData.area ||
            !formData.roles?.length ||
            Object.keys(errors).some(key => errors[key])
          }
          size="sm"
          variant="success"
          onClick={handleSubmit}
        >
          {loading ? (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          ) : empleado ? (
            'Editar Empleado'
          ) : (
            'Crear Empleado'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

EmpleadoModal.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func,
  hasLabel: PropTypes.bool,
  empleado: PropTypes.object,
  empleados: PropTypes.object
};

export default EmpleadoModal;
