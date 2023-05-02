import tramites from 'assets/json/tramites';
import React, { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { checkLastProcedureState, tramiteCreate } from 'redux/actions/tramite';

const InfoSolicitudLicenciaPasividad = () => {
  const { user } = useSelector(state => state.authReducer);
  const { lastProcedure } = useSelector(state => state.tramiteReducer);

  const idTipoTramite = tramites.solicitudLicenciaPasividadUsuario;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isRegistred = !!user;

  const handleIniciarTramite = () => {
    dispatch(
      tramiteCreate({ tipoId: idTipoTramite, userId: user.id }, navigate)
    );
  };
  useEffect(() => {
    // TODO: Fetch if the user have a process in progress
    user && dispatch(checkLastProcedureState(user.id, idTipoTramite));
  }, [user]);

  const handleNavigateOwnProcedure = () => {
    navigate('/tramites/' + lastProcedure.id);
  };

  return (
    <div className="container">
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.2rem'
        }}
      >
        <h4
          style={{
            fontWeight: 700,
            marginTop: '20px'
          }}
        >
          Solicitud de Licencia por Pasividad
        </h4>
        <div>
          {isRegistred ? (
            (lastProcedure && lastProcedure?.estado === 'pendiente') ||
            lastProcedure?.estado === 'finalizado' ? (
              <Button
                type="button"
                className="btn btn-primary"
                style={{
                  cursor: 'pointer'
                }}
                onClick={handleNavigateOwnProcedure}
              >
                Ir a mi tramite
              </Button>
            ) : lastProcedure && lastProcedure.estado === 'rechazado' ? (
              <>
                <Button
                  type="button"
                  className="btn btn-primary"
                  style={{
                    cursor: 'pointer'
                  }}
                  onClick={handleIniciarTramite}
                >
                  Iniciar nuevo tramite
                </Button>
                <Button
                  type="button"
                  className="btn btn-danger"
                  style={{
                    cursor: 'pointer',
                    marginLeft: '1rem'
                  }}
                  onClick={handleNavigateOwnProcedure}
                >
                  Ir a mi tramite rechazado
                </Button>
              </>
            ) : (
              <Button
                type="button"
                className="btn btn-primary"
                style={{
                  cursor: 'pointer'
                }}
                onClick={handleIniciarTramite}
              >
                Iniciar Tramite
              </Button>
            )
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <div>
                <Link to="/login">
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{
                      cursor: 'pointer'
                    }}
                  >
                    Iniciar sesión
                  </button>
                </Link>
                <Link to="/register">
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{
                      cursor: 'pointer',
                      marginLeft: '10px'
                    }}
                  >
                    Registrarse
                  </button>
                </Link>
              </div>
              <small>Debe estar registrado para iniciar ese tramite</small>
            </div>
          )}
        </div>
      </div>
      {/* <div>
        <p>
          Cuáles son los requisitos de matriculación? Los requisitos podrá
          visualizarlos en nuestra web ingresando en la solapa Requisitos de
          Matriculación y reuniendo todos los ítems detallados allí entre el
          punto 1 y 9 inclusive, una vez reunidos en mano deberá contactarse
          telefónicamente para solicitar una entrevista dado que la misma la
          concedemos de forma inmediata.
        </p>
        <p
          style={{
            fontWeight: 700,
            textDecoration: 'underline'
          }}
        >
          Cuáles son los valores de inscripción y matriculación?
        </p>

        <small
          style={{
            color: 'red'
          }}
        >
          A PARTIR DEL 20 DE OCTUBRE DE 2021
        </small>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Concepto</th>
              <th scope="col">Costo</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Gastos Administrativos (por única vez)</td>
              <td>$ 3.000</td>
            </tr>
            <tr>
              <td>Arancel de Inscripción (por única vez)</td>
              <td>$ 60.000</td>
            </tr>
            <tr>
              <td>Matrícula Anual 2022</td>
              <td>$ 14.000</td>
            </tr>
            <tr>
              <td>Fianza Fiduciaria 2022</td>
              <td>$ 600</td>
            </tr>
          </tbody>
        </table>
        <p>
          El Arancel de Inscripción junto con la matrícula anual y la Fianza
          Fiduciaria por un total de $74.600- podrá abonarse en un solo pago con
          descuento del 10% o en planes de pago de 3, 6 o 10 cuotas sin
          intereses. Por consultas sobre los planes de pago vigentes,
          comunicarse al 4124-6060
        </p>
        <p
          style={{
            fontWeight: 700,
            textDecoration: 'underline'
          }}
        >
          Puedo matricularme siendo abogado, contador y/o arquitecto?
        </p>
        <p>
          El hecho de tener título de abogado, contador y/o arquitecto no lo
          habilita para matricularse en CUCICBA, deberá hacer la carrera
          universitaria de corredor y una vez obtenido el título y analítico
          correspondiente podrá iniciar el trámite de matriculación. Tengo
          matrícula de corredor otorgada por la Inspección General de Justicia,
          puedo matricularme? La vieja matrícula de corredor otorgada por la
          Inspección General de Justicia (IGJ) o por el Registro Público de
          Comercio de Capital Federal pudo haberla validado ante CUCICBA en los
          plazos transitorios que establecieron para tales fines las leyes 2340
          y 3493, habiendo vencido el último en diciembre de 2010. Quien no se
          presentó oportunamente para revalidarla, no podrá dar inicio al
          trámite de matriculación bajo esa modalidad ya que actualmente la
          misma quedó habilitada exclusivamente para quienes egresen de la
          carrera universitaria de corredor y presenten la documentación
          correspondiente.
        </p>
        <p
          style={{
            fontWeight: 700,
            textDecoration: 'underline'
          }}
        >
          Qué universidades dictan la carrera de corredor?
        </p>

        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Universidad</th>
              <th scope="col">Titulo</th>
            </tr>
          </thead>
          <tbody>

            {titleData.map((title, index) => {
              return (
                <tr key={index}>
                  <td>{title.university}</td>
                  <td>{title.titleName}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div> */}
    </div>
  );
};

export default InfoSolicitudLicenciaPasividad;
