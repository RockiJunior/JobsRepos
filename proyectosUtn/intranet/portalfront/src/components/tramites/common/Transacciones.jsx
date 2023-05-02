import React from 'react';
import { Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import Transaccion from './Transaccion';

const Transacciones = () => {
  const { tramite } = useSelector(state => state.tramiteReducer);
  const { user } = useSelector(state => state.authReducer);

  const getTransaccionesPendingRequest = () => {
    return tramite.transacciones.reduce(
      (acc, transaccion) =>
        transaccion.estado === 'pending' || transaccion.estado === 'request'
          ? acc + 1
          : acc,
      0
    );
  };

  const [transaccionesPorPagar, setTransaccionesPorPagar] = React.useState(
    getTransaccionesPendingRequest()
  );

  React.useEffect(() => {
    setTransaccionesPorPagar(getTransaccionesPendingRequest());
  }, [tramite]);

  return (
    <div>
      {tramite.transacciones?.length ? (
        <Row>
          {tramite.transacciones.map(transaccion => (
            <Transaccion
              key={transaccion.id}
              transaccion={transaccion}
              userId={user.id}
              transaccionesPorPagar={transaccionesPorPagar}
              setTransaccionesPorPagar={setTransaccionesPorPagar}
            />
          ))}
        </Row>
      ) : (
        <h3>No hay pagos pendientes</h3>
      )}
    </div>
  );
};

export default Transacciones;
