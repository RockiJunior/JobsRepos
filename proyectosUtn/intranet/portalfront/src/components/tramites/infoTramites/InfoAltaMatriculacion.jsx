import tramites from 'assets/json/tramites';
import { CustomCard } from 'components/common/CustomCard';
import React, { useEffect } from 'react';
import { Button, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { checkLastProcedureState, tramiteCreate } from 'redux/actions/tramite';

const InfoAltaMatriculacion = () => {
  const { user } = useSelector(state => state.authReducer);
  const { lastProcedure } = useSelector(state => state.tramiteReducer);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isRegistred = !!user;

  const handleIniciarTramite = () => {
    dispatch(
      tramiteCreate(
        { tipoId: tramites.altaMatriculacion, userId: user.id },
        navigate
      )
    );
  };
  useEffect(() => {
    user &&
      dispatch(checkLastProcedureState(user.id, tramites.altaMatriculacion));
  }, [user]);

  const handleNavigateOwnProcedure = () => {
    navigate('/tramites/' + lastProcedure.id);
  };
  return (
    <CustomCard title="Alta de Matriculación" icon="stamp">
      <Card.Body>
        <div className="d-flex justify-content-end mb-1">
          <div>
            {isRegistred &&
              ((lastProcedure && lastProcedure?.estado === 'pendiente') ||
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
              ))}
          </div>
        </div>
        <div>
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
            A PARTIR DEL 28 DE OCTUBRE DE 2022
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
                <td>$ 15.000</td>
              </tr>
              <tr>
                <td>Arancel de Inscripción (por única vez)</td>
                <td>$ 150.000</td>
              </tr>
              <tr>
                <td>Matrícula Anual 2023</td>
                <td>$ 33.000</td>
              </tr>
              <tr>
                <td>Fianza Fiduciaria 2023</td>
                <td>$ 1.000</td>
              </tr>
            </tbody>
          </table>
          <p>
            El Arancel de Inscripción junto con la Matrícula Anual y la Fianza
            Fiduciaria por un total de $184.000- podrá abonarse en un solo pago
            con descuento o en planes de pago de 3, 6 o 10 cuotas sin intereses.
            Por consultas sobre los planes de pago vigentes, comunicarse al
            4124-6060
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
            matrícula de corredor otorgada por la Inspección General de
            Justicia, puedo matricularme? La vieja matrícula de corredor
            otorgada por la Inspección General de Justicia (IGJ) o por el
            Registro Público de Comercio de Capital Federal pudo haberla
            validado ante CUCICBA en los plazos transitorios que establecieron
            para tales fines las leyes 2340 y 3493, habiendo vencido el último
            en diciembre de 2010. Quien no se presentó oportunamente para
            revalidarla, no podrá dar inicio al trámite de matriculación bajo
            esa modalidad ya que actualmente la misma quedó habilitada
            exclusivamente para quienes egresen de la carrera universitaria de
            corredor y presenten la documentación correspondiente.
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
        </div>
        <div className="d-flex justify-content-end">
          <small>Debe estar registrado para iniciar ese tramite</small>
        </div>
      </Card.Body>
    </CustomCard>
  );
};

const titleData = [
  {
    university:
      'Pontificia Universidad Católica Argentina "Santa María de los Buenos Aires"',
    titleName:
      'Martillero Público, Corredor (Inmobiliario y Mobiliario), Administrador de Consorcios y Tasador'
  },
  {
    university: 'Universidad Abierta Interamericana',
    titleName: 'Martillero Público, Corredor y Administrador de Consorcio'
  },
  {
    university: 'Universidad Argentina de la Empresa',
    titleName: 'Martillero Público, Corredor y Administrador de Consorcio'
  },
  {
    university: 'Universidad Argentina John F. Kennedy',
    titleName: 'Técnico Universitario en Martillero'
  },
  {
    university: 'Universidad Blas Pascal',
    titleName: 'Martillero y Corredor Público'
  },
  {
    university: 'Universidad Católica de Cuyo',
    titleName: 'Corredor de Comercio y Martillero'
  },
  {
    university: 'Universidad Católica de La Plata',
    titleName: 'Martillero y Corredor de Comercio'
  },
  {
    university: 'Universidad Católica de Salta',
    titleName: 'Corredor Inmobiliario y Martillero'
  },
  {
    university: 'Universidad Católica de Santa Fe',
    titleName: 'Martillero Público y Corredor Inmoviliario'
  }
];

export default InfoAltaMatriculacion;
