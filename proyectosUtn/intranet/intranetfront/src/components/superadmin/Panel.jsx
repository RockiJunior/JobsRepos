import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CustomTab from 'components/common/CustomTab';
import React, { useState } from 'react';
import { Button, Card, Nav, Tab } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import Empleados from './components/Empleados';
import Roles from './components/Roles';
import permisosData from 'data/permisos';
import { useEffect } from 'react';
import { checkPermissions } from 'utils/checkPermissionsArea';
import { CustomCard } from 'components/common/CustomCard';
import Config from './components/Config';

const Panel = () => {
  const { user } = useSelector(state => state.authReducer);

  const [key, setKey] = useState(null);
  const [createRol, setCreateRol] = useState(false);
  const [createEmpleado, setCreateEmpleado] = useState(false);

  const handleContentCardBody = () => {
    switch (key) {
      case 'roles':
        return checkPermissions(
          [permisosData.roles.ver_roles],
          user.empleado
        ) ? (
          <Roles createRol={createRol} setCreateRol={setCreateRol} />
        ) : null;

      case 'empleados':
        return (
          <Empleados
            createEmpleado={createEmpleado}
            setCreateEmpleado={setCreateEmpleado}
          />
        );

      case 'config':
        return <Config />;

      default:
        return null;
    }
  };

  useEffect(() => {
    if (checkPermissions([permisosData.roles.ver_roles], user.empleado)) {
      setKey('roles');
    } else if (
      checkPermissions([permisosData.empleados.ver_empleados], user.empleado)
    ) {
      setKey('empleados');
    } else {
      setKey('config');
    }
  }, [user]);

  return (
    <>
      <CustomCard
        title="Gestión de Usuarios"
        subtitle="Administre Usuarios, Roles y Permisos."
        icon="user"
      >
        <Card className="bg-white">
          <Card.Header>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between'
              }}
            >
              <Tab.Container
                activeKey={key}
                onSelect={k => setKey(k)}
                className="mb-1"
              >
                <Nav>
                  <CustomTab
                    eventKey="roles"
                    title="Roles"
                    isVisible={checkPermissions(
                      [permisosData.roles.ver_roles],
                      user.empleado
                    )}
                  />

                  <CustomTab
                    eventKey="empleados"
                    title="Empleados"
                    isVisible={checkPermissions(
                      [permisosData.empleados.ver_empleados],
                      user.empleado
                    )}
                  />

                  <CustomTab
                    eventKey="config"
                    title="Configuración"
                    isVisible /* ={checkPermissions(
                      [permisosData.empleados.ver_empleados],
                      user.empleado
                    )} */
                  />
                </Nav>
              </Tab.Container>

              {key === 'roles' &&
                checkPermissions(
                  [permisosData.roles.crear_roles],
                  user.empleado
                ) && (
                  <div
                    style={{
                      transition:
                        'border-color .3s ease-in-out,box-shadow .3s ease-in-out'
                    }}
                  >
                    <Button
                      size="sm"
                      onClick={() => setCreateRol(state => !state)}
                      style={
                        createRol
                          ? {
                              boxShadow: '0 0 0 0.3rem rgba(31,56,111, 0.25)',
                              borderColor: 'var(--falcon-light)'
                            }
                          : {
                              boxShadow: 'none',
                              borderColor: 'var(--falcon-primary)'
                            }
                      }
                    >
                      Crear rol <FontAwesomeIcon icon="plus" />
                    </Button>
                  </div>
                )}

              {key === 'empleados' &&
                checkPermissions(
                  [permisosData.empleados.crear_empleados],
                  user.empleado
                ) && (
                  <Button size="sm" onClick={() => setCreateEmpleado(true)}>
                    Crear empleado <FontAwesomeIcon icon="plus" />
                  </Button>
                )}
            </div>
          </Card.Header>
          <Card.Body className="pt-0">{handleContentCardBody()}</Card.Body>
        </Card>
      </CustomCard>
    </>
  );
};

export default Panel;
