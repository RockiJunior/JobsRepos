import React from 'react';
import PropTypes from 'prop-types';
import { InputGroup } from 'react-bootstrap';
import DatosMatriculado from './components/DatosMatriculado';
import DatosNoMatriculado from './components/DatosNoMatriculado';

const Denuncia = ({ denuncia }) => {
  return (
    <div>
      <InputGroup size="sm" className="mb-3">
        <InputGroup.Text className="bg-primary text-white w-100 rounded">
          <strong>Denunciante</strong>
        </InputGroup.Text>
        <span className="form-control p-3">
          {denuncia.info.denuncianteMatriculado ? (
            <DatosMatriculado id={denuncia.info.denuncianteMatriculado} />
          ) : (
            <DatosNoMatriculado denuncia={denuncia} isDenunciado={false} />
          )}
        </span>
      </InputGroup>

      <InputGroup size="sm" className="mb-3">
        <InputGroup.Text className="bg-primary text-white w-100 rounded">
          <strong>Denunciado</strong>
        </InputGroup.Text>
        <span className="form-control p-3">
          {denuncia.info.denunciadoMatriculado ? (
            <DatosMatriculado id={denuncia.info.denunciadoMatriculado} />
          ) : (
            <DatosNoMatriculado denuncia={denuncia} isDenunciado={true} />
          )}
        </span>
      </InputGroup>

      <InputGroup size="sm">
        <InputGroup.Text className="bg-primary text-white w-100 rounded">
          <strong>Motivo</strong>
        </InputGroup.Text>
        <span className="form-control">{denuncia.motivo}</span>
      </InputGroup>
    </div>
  );
};

Denuncia.propTypes = {
  denuncia: PropTypes.object.isRequired
};

export default Denuncia;
