import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const DatosNoMatriculado = ({ denuncia, isDenunciado }) => {
  const [data, setData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    mail: '',
    domicilio: '',
    telefono: '',
    codigoPostal: ''
  });

  useEffect(() => {
    setData({
      nombre: isDenunciado
        ? denuncia.nombreDenunciado
        : denuncia.nombreDenunciante,
      apellido: isDenunciado
        ? denuncia.apellidoDenunciado
        : denuncia.apellidoDenunciante,
      dni: isDenunciado
        ? denuncia.info.contacto.dniDenunciado
        : denuncia.info.contacto.dniDenunciante,
      mail: isDenunciado
        ? denuncia.info.contacto.mailDenunciado
        : denuncia.info.contacto.mailDenunciante,
      domicilio: isDenunciado
        ? denuncia.info.contacto.domicilioDenunciado
        : denuncia.info.contacto.domicilioDenunciante,
      telefono: isDenunciado
        ? denuncia.info.contacto.telefonoDenunciado
        : denuncia.info.contacto.telefonoDenunciante,
      codigoPostal: isDenunciado
        ? denuncia.info.contacto.codigoPostalDenunciado
        : denuncia.info.contacto.codigoPostalDenunciante
    });
  }, [denuncia, isDenunciado]);

  return (
    <div>
      <p className="m-0 text-dark">
        Es Matriculado: <strong>No</strong>
      </p>

      <p className="m-0 text-dark">
        Nombre: <strong>{data.nombre || '-'}</strong>
      </p>

      <p className="m-0 text-dark">
        Apellido: <strong>{data.apellido || '-'}</strong>
      </p>

      <p className="m-0 text-dark">
        DNI: <strong>{data.dni || '-'}</strong>
      </p>

      <p className="m-0 text-dark">
        Email: <strong>{data.mail || '-'}</strong>
      </p>

      <p className="m-0 text-dark">
        Teléfono: <strong>{data.telefono || '-'}</strong>
      </p>

      <p className="m-0 text-dark">
        Domicilio: <strong>{data.domicilio || '-'}</strong>
      </p>

      <p className="m-0 text-dark">
        Código Postal: <strong>{data.codigoPostal || '-'}</strong>
      </p>
    </div>
  );
};

DatosNoMatriculado.propTypes = {
  denuncia: PropTypes.object.isRequired,
  isDenunciado: PropTypes.bool.isRequired
};

export default DatosNoMatriculado;
