import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FalconComponentCard from 'components/common/FalconComponentCard';
import React, { useEffect, useState } from 'react';
import { Breadcrumb } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getPermisos } from 'redux/permisosSlice';
import { createRol, getRoles } from 'redux/rolesSlice';
import ButtonClose from 'utils/buttons/buttonClose';
import ButtonSuccessSubmit from 'utils/buttons/buttonSuccessSubmit';
import Permisos from '../Permisos';
import { Link } from 'react-router-dom';

const CrearRol = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tablaPermisos = useSelector(state => state.permisos.data);
  const userLogged = useSelector(state => state.login.currentUser);
  const token = localStorage.getItem('token');
  const listaRoles = useSelector(state => state.roles.data);
  const [errors, setErrors] = useState({
    errorFound: false,
    alert: null
  });

  useEffect(() => {
    dispatch(getPermisos(token));
    dispatch(getRoles(token));
  }, []);

  const handleSwitch = e => {
    setRol({
      ...rol,
      permisos: {
        ...rol.permisos,
        [e.target.id]: !rol.permisos[e.target.id]
      }
    });
  };

  const permissionId = {};

  tablaPermisos.forEach(grupo =>
    grupo.permissions.map(perm => (permissionId[perm.id] = false))
  );

  useEffect(() => {
    setRol({
      ...rol,
      permisos: permissionId
    });
  }, [tablaPermisos]);

  const [rol, setRol] = useState({
    nombre: '',
    permisos: permissionId
  });

  useEffect(() => {
    if (rol.nombre.length < 2) {
      setErrors({
        errorFound: true,
        alert: 'Ingrese un nombre con mínimo 2 letras.'
      });
    } else if (
      listaRoles &&
      listaRoles.some(element => element.name === rol.nombre)
    ) {
      setErrors({
        errorFound: true,
        alert: 'El nombre ingresado ya está en uso.'
      });
    } else {
      setErrors({
        errorFound: false,
        alert: null
      });
    }
  }, [rol.nombre]);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (!errors.errorFound) {
        const realEstate = userLogged?.realEstate.id;
        await dispatch(createRol(rol, realEstate, token));
        await dispatch(getRoles(token));
        setRol({
          id: '',
          inmobiliaria: '',
          nombre: '',
          permisos: {}
        });
        navigate(`/permisos/roles`);
      }
    } catch (e) {
      console.log(e);
      return e;
    }
  };

  const handleCancel = async e => {
    try {
      e.preventDefault();
      navigate(-1);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="ms-4">
      <FalconComponentCard>
        <FalconComponentCard.Body>
          <div className="d-flex w-100 align-items-center justify-content-between px-3 mt-4 mb-5">
            <h4 className="m-0">
              <FontAwesomeIcon
                icon="fa-plus"
                className="text-success"
                style={{ marginRight: 10 }}
              />
              Crear un nuevo rol
            </h4>

            <Breadcrumb>
              <Breadcrumb.Item>
                <Link to="/permisos/roles">Gestionar roles</Link>
              </Breadcrumb.Item>

              <Breadcrumb.Item href="#" active>
                Crear rol
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>

          <form
            className="d-flex flex-column justify-content-start"
            onSubmit={handleSubmit}
          >
            <div style={{ maxWidth: 350 }} className="my-4 ms-4">
              <h5 className="text-center mb-2">
                Ingrese el nombre <label>*</label>
              </h5>

              <input
                type="text"
                className="form-control form-control-sm mb-2"
                required
                id="firstname"
                aria-describedby="firstnamelHelp"
                placeholder="Nombre"
                value={rol.nombre}
                onChange={e => setRol({ ...rol, nombre: e.target.value })}
              />

              {errors.errorFound && (
                <label className="text-center text-danger w-100">
                  {errors.alert}
                </label>
              )}
            </div>

            <div className="d-flex flex-column align-items-start">
              <h5 className="mb-5 ms-4">Seleccionar permisos</h5>

              <div className="d-flex flex-wrap justify-content-start ms-4">
                {tablaPermisos.map(({ name, permissions }, index) => (
                  <Permisos
                    key={index}
                    rol={rol}
                    name={name}
                    permissions={permissions}
                    handleSwitch={handleSwitch}
                  />
                ))}
              </div>
            </div>
            <div
              className="d-flex flex-row justify-content-end w-100"
              style={{ gap: 50 }}
            >
              <ButtonClose text="Cancelar" funcion={handleCancel} />

              <ButtonSuccessSubmit
                text="Crear rol"
                disabled={errors.errorFound}
              />
            </div>
          </form>
        </FalconComponentCard.Body>
      </FalconComponentCard>
    </div>
  );
};

export default CrearRol;
