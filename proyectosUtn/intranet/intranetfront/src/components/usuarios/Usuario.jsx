import { CustomCard } from 'components/common/CustomCard';
import CustomTab from 'components/common/CustomTab';
import areas from 'data/areas';
import permisos from 'data/permisos';
import React, { useEffect, useState } from 'react';
import { Card, Nav, Spinner, Tab } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getUsuario } from 'redux/actions/users';
import { checkRoutePermissionsArea } from 'utils/checkPermissionsArea';
import UsuarioContentBody from './components/UsuarioContentBody';

const Usuario = () => {
  const { id } = useParams();
  const { user } = useSelector(state => state.authReducer);
  const { usuario } = useSelector(state => state.usersReducer);
  const dispatch = useDispatch();
  const [key, setKey] = useState(
    localStorage.getItem('tui')
      ? atob(localStorage.getItem('tui'))
      : 'informacion'
  );

  useEffect(() => {
    dispatch(getUsuario(id));
  }, [id]);

  useEffect(() => {
    localStorage.setItem('tui', btoa(key));
  }, [key]);

  return usuario.id ? (
    <CustomCard
      title="Usuario"
      icon="user"
      subtitle={`${usuario?.nombre} ${usuario?.apellido} - ${
        usuario.matricula[0]?.numero ? usuario.matricula : 'DNI ' + usuario?.dni
      }`}
    >
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
            <Nav className="mb-1">
              <CustomTab eventKey="informacion" title="Información" isVisible />

              <CustomTab
                eventKey="tramites"
                title="Trámites"
                isVisible={checkRoutePermissionsArea(
                  {
                    permissions: [
                      [
                        permisos.tramites.ver_tramites_area,
                        permisos.tramites.ver_tramites_todos
                      ]
                    ],
                    areas: [
                      areas.matriculacion,
                      areas.comisionMatriculacion,
                      areas.fiscalizacion,
                      areas.finanzas,
                      areas.legales,
                      areas.tesorero,
                      areas.secretario,
                      areas.presidente,
                      areas.consejoDirectivo,
                      areas.inspeccion,
                      areas.comisionFiscalizacion,
                      areas.mesaEntrada,
                      areas.administracion
                    ]
                  },
                  user.empleado
                )}
              />

              <CustomTab
                eventKey="expedientes"
                title="Expedientes"
                isVisible={checkRoutePermissionsArea(
                  {
                    permissions: [
                      [
                        permisos.expedientes.ver_expedientes_area,
                        permisos.expedientes.ver_expedientes_todos
                      ]
                    ],
                    areas: [
                      areas.legales,
                      areas.fiscalizacion,
                      areas.consejoDirectivo,
                      areas.administracion
                    ]
                  },
                  user.empleado
                )}
              />

              <CustomTab
                eventKey="cedulas"
                title="Cédulas de Notificación"
                isVisible={checkRoutePermissionsArea(
                  {
                    permissions: [
                      [
                        permisos.cedulas.ver_cedulas_area,
                        permisos.cedulas.ver_cedulas_todas
                      ]
                    ],
                    areas: [
                      areas.inspeccion,
                      areas.fiscalizacion,
                      areas.administracion,
                      areas.consejoDirectivo
                    ]
                  },
                  user.empleado
                )}
              />

              <CustomTab
                eventKey="transacciones"
                title="Transacciones"
                isVisible={checkRoutePermissionsArea(
                  {
                    permissions: [
                      [
                        permisos.transacciones.ver_transacciones,
                        permisos.transacciones.ver_transacciones_todas
                      ]
                    ],
                    areas: [
                      areas.finanzas,
                      areas.administracion,
                      areas.consejoDirectivo
                    ]
                  },
                  user.empleado
                )}
              />
            </Nav>
          </Tab.Container>
        </div>
      </Card.Header>
      <Card.Body className="pt-0">
        <UsuarioContentBody usuario={usuario} actualKey={key} />
      </Card.Body>
    </CustomCard>
  ) : (
    <Spinner animation="border" />
  );
};

export default Usuario;
