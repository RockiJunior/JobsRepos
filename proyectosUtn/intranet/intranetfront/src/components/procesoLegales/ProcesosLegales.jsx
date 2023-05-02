import React, { useState } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { capitalize } from 'utils/capitalize';
import { OverlayTrigger, Table, Tooltip } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import SoftBadge from 'components/common/SoftBadge';
import classNames from 'classnames';

const ProcesosLegales = ({ expediente }) => {
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);

  return (
    <div>
      <Table>
        <thead>
          <tr>
            <th className="pt-0 text-center">Paso Actual</th>
            <th className="pt-0 text-center">Fecha</th>
            <th className="pt-0 text-center">Estado</th>
          </tr>
        </thead>
        <tbody>
          {expediente.procesosLegales.map((procesoLegal, i) => {
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
                    `/expedientes/${expediente.id}/procesos_legales/${procesoLegal.id}`
                  )
                }
              >
                <td>
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip>
                        <strong>{procesoLegal.pasoActualLabel.title}</strong>
                      </Tooltip>
                    }
                  >
                    <div className="d-flex justify-content-center">
                      <SoftBadge bg="secondary" className="text-primary">
                        {procesoLegal.pasoActualLabel.label || '-'}
                      </SoftBadge>
                    </div>
                  </OverlayTrigger>
                </td>
                <td className="text-center">
                  {dayjs(procesoLegal.createdAt).format('DD/MM/YYYY HH:mm')}
                </td>
                <td className="text-center">
                  <SoftBadge
                    bg={classNames({
                      success: procesoLegal.estado === 'finalizado',
                      danger: procesoLegal.estado === 'cancelado',
                      info: procesoLegal.estado === 'iniciado',
                      primary:
                        procesoLegal.estado !== 'finalizado' &&
                        procesoLegal.estado !== 'cancelado' &&
                        procesoLegal.estado !== 'iniciado'
                    })}
                  >
                    {capitalize(procesoLegal.estado)}
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

ProcesosLegales.propTypes = {
  expediente: PropTypes.object.isRequired
};

export default ProcesosLegales;
