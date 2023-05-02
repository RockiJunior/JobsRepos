import React from 'react';
import PropTypes from 'prop-types';
import Formulario from './Formulario';
import Transacciones from './transactions/Transacciones';
import Constataciones from './constataciones/Constataciones';
import { useSelector } from 'react-redux';
import areas from 'data/areas';
import InformeFiscalizacionComponent from './informeFiscalizacion/InformeFiscalizacionComponent';
import Denuncia from 'components/expedientes/components/denuncia/Denuncia';

const CustomContentBodyFiscalizacion = ({
  actualKey,
  expediente,
  fiscalizacion
}) => {
  const { user } = useSelector(state => state.authReducer);

  switch (actualKey) {
    case 'formulario':
      return (
        <Formulario
          expediente={expediente}
          fiscalizacion={fiscalizacion}
          isDisabled={
            fiscalizacion.estado !== 'pendiente' ||
            user.empleado.areaId !== areas.fiscalizacion
          }
        />
      );

    case 'constataciones':
      return (
        <Constataciones
          constataciones={fiscalizacion.constataciones || []}
          fiscalizacionId={fiscalizacion.id}
          expedienteId={expediente.id}
          expedienteUserId={expediente.carpeta?.usuarioId}
          isDisabled={
            fiscalizacion.estado !== 'pendiente' ||
            user.empleado.areaId !== areas.fiscalizacion
          }
        />
      );

    case 'transacciones':
      return (
        <Transacciones
          transaccion={fiscalizacion.transaccion}
          cobro={fiscalizacion.cobroFiscalizacion}
          fiscalizacionId={fiscalizacion.id}
          expedienteId={expediente.id}
          isMatriculado={!!expediente.carpeta}
          isDisabled={
            fiscalizacion.estado !== 'pendiente' ||
            user.empleado.areaId !== areas.fiscalizacion
          }
          expedienteCreatedAt={expediente.createdAt}
        />
      );

    case 'informe':
      return fiscalizacion.informeFiscalizacion ? (
        <InformeFiscalizacionComponent
          document={fiscalizacion.informeFiscalizacion}
        />
      ) : null;

    case 'denuncia':
      return <Denuncia denuncia={expediente.denuncia} />;

    default:
      return null;
  }
};

CustomContentBodyFiscalizacion.propTypes = {
  actualKey: PropTypes.string.isRequired,
  expediente: PropTypes.object.isRequired,
  fiscalizacion: PropTypes.object.isRequired
};

export default CustomContentBodyFiscalizacion;
