import React from 'react';
import PropTypes from 'prop-types';
import Info from './content/Info';
import Transacciones from './content/Transacciones';
import Tramites from './content/Tramites';
import Expedientes from './content/Expedientes';
import Cedulas from './content/Cedulas';

export const UsuarioContentBody = ({ usuario, actualKey }) => {
  switch (actualKey) {
    case 'informacion':
      return <Info usuario={usuario} />;

    case 'tramites':
      return <Tramites tramites={usuario.tramites} />;

    case 'expedientes':
      return <Expedientes expedientes={usuario.expedientes} />;

    case 'cedulas':
      return <Cedulas cedulas={usuario.cedulas} />;

    case 'transacciones':
      return <Transacciones transacciones={usuario.transacciones} />;
  }
};

UsuarioContentBody.propTypes = {
  usuario: PropTypes.object.isRequired,
  actualKey: PropTypes.string.isRequired
};

export default UsuarioContentBody;
