import tramites from 'assets/json/tramites';
import { CustomCard } from 'components/common/CustomCard';
import React, { useEffect } from 'react';
import { Card, Image, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { tipoTramiteGetById } from 'redux/actions/tramite';
import { TituloSeccion } from './TituloSeccion';
import { Formulario } from './Formulario';
import success from 'assets/img/generic/success.png';

const SistemaDenuncias = () => {
  const { tipoTramite, tramiteExternoResponse } = useSelector(
    state => state.tramiteReducer
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(tipoTramiteGetById(tramites.denunciaExterna));
  }, []);

  return (
    <CustomCard title="Sistema de Denuncias" icon="bullhorn">
      <Card.Body>
        {!tramiteExternoResponse ? (
          tipoTramite ? (
            <>
              <TituloSeccion title="¿Qué es el sistema de denuncias?" />
              <div className="px-3 pt-2 text-justify">
                <p
                  dangerouslySetInnerHTML={{
                    __html: tipoTramite.descripcion
                  }}
                />
              </div>

              <TituloSeccion title="Formulario de denuncia" className="mt-4" />
              <div className="px-3 pt-2">
                <Formulario secciones={tipoTramite.secciones} />
              </div>
            </>
          ) : (
            <center>
              <Spinner
                animation="border"
                variant="primary"
                style={{ width: '3rem', height: '3rem' }}
              />
            </center>
          )
        ) : (
          <div>
            <div className="d-flex flex-column align-items-center">
              <h3 className="m-0">¡Denuncia enviada!</h3>
              <br />
              <Image src={success} style={{ maxWidth: 250 }} />
              <br />
              <p className="text-dark m-0">
                Tu denuncia ha sido enviada, en breve te llegará un mail con un
                link para que puedas seguir el estado de tu denuncia.
              </p>

              {/* <Button>OK</Button> */}

              <br />
              <br />

              <small>
                <p className="text-dark m-0">
                  Si deseas realizar otra denuncia, puedes hacerlo{' '}
                  <a
                    href=""
                    onClick={e => {
                      e.preventDefault();
                      dispatch({
                        type: 'TRAMITES_CREAR_EXTERNO',
                        payload: null
                      });
                    }}
                  >
                    aquí
                  </a>
                </p>
              </small>
            </div>
          </div>
        )}
      </Card.Body>
    </CustomCard>
  );
};

export default SistemaDenuncias;
