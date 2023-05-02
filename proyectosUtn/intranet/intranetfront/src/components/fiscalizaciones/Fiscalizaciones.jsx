import React, { useState } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { capitalize } from 'utils/capitalize';
import { Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import SoftBadge from 'components/common/SoftBadge';
import classNames from 'classnames';

const Fiscalizaciones = ({ expediente }) => {
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);

  return (
    <div>
      <Table>
        <thead>
          <tr>
            <th className="pt-0">Título</th>
            <th className="pt-0">Fecha</th>
            <th className="pt-0">Estado</th>
          </tr>
        </thead>
        <tbody>
          {expediente.fiscalizaciones.map((fiscalizacion, i) => {
            return (
              <tr
                key={i}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(false)}
                style={{
                  backgroundColor: i === hover ? 'var(--falcon-gray-300)' : '',
                  cursor: 'pointer'
                }}
                onClick={() =>
                  navigate(
                    `/expedientes/${expediente.id}/fiscalizaciones/${fiscalizacion.id}`
                  )
                }
              >
                <td>{fiscalizacion.titulo}</td>
                <td>
                  {dayjs(fiscalizacion.createdAt).format('DD/MM/YYYY HH:mm')}
                </td>
                <td>
                  <SoftBadge
                    bg={classNames({
                      success: fiscalizacion.estado === 'finalizada',
                      warning: fiscalizacion.estado === 'causa_penal',
                      danger: fiscalizacion.estado === 'cancelada',
                      info: fiscalizacion.estado === 'archivada',
                      secondary: fiscalizacion.estado === 'pendiente'
                    })}
                  >
                    {capitalize(fiscalizacion.estado)}
                  </SoftBadge>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

Fiscalizaciones.propTypes = {
  expediente: PropTypes.object.isRequired
};

export default Fiscalizaciones;
