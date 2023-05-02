import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-bootstrap';
import StatisticsCard from './StatisticsCard';
import bg1 from 'assets/img/icons/spot-illustrations/corner-2.png';
import bg2 from 'assets/img/icons/spot-illustrations/corner-3.png';
import bg3 from 'assets/img/icons/spot-illustrations/corner-5.png';
import bg4 from 'assets/img/icons/spot-illustrations/corner-8.png';
import permisos from 'data/permisos';
import areas from 'data/areas';
import { useSelector } from 'react-redux';
import { checkRoutePermissionsArea } from 'utils/checkPermissionsArea';

const StatisticsCards = ({ data }) => {
  const { user } = useSelector(state => state.authReducer);

  const statsData = [
    {
      title: 'Trámites Activos CUCICBA',
      value: data.tramitesActivosCount,
      decimal: false,
      suffix: '',
      prefix: '',
      valueClassName: 'text-info',
      image: bg1,
      link: '/tramites',
      linkText: 'Ver Trámites',
      permissions: [permisos.tramites.ver_tramites_todos]
    },
    {
      title: 'Expedientes Activos CUCICBA',
      value: data.expedientesActivosCount,
      decimal: false,
      suffix: '',
      prefix: '',
      valueClassName: 'text-info',
      image: bg2,
      link: '/expedientes',
      linkText: 'Ver Expedientes',
      permissions: [permisos.expedientes.ver_expedientes_todos]
    },
    {
      title: 'Matriculados',
      value: data.matriculadosCount,
      decimal: false,
      suffix: '',
      prefix: '',
      valueClassName: 'text-primary',
      image: bg3,
      link: '/usuarios',
      linkText: 'Ver Matriculados',
      permissions: [permisos.usuarios.ver_usuarios]
    },
    {
      title: 'Trámites que te asignaron',
      value: data.tramitesAsignadosCount,
      decimal: false,
      suffix: '',
      prefix: '',
      valueClassName: 'text-info',
      image: bg4,
      link: '/tramites',
      linkText: 'Ver Trámites',
      areas: [
        areas.matriculacion,
        areas.comisionMatriculacion,
        areas.fiscalizacion,
        areas.finanzas,
        areas.legales,
        areas.tesorero,
        areas.secretario,
        areas.presidente,
        areas.consejoDirectivo,
        areas.inspeccion,
        areas.comisionFiscalizacion,
        areas.mesaEntrada
      ]
    },
    {
      title: 'Trámites en el área',
      value: data.tramitesAreaCount,
      decimal: false,
      suffix: '',
      prefix: '',
      valueClassName: 'text-info',
      image: bg1,
      link: '/tramites_area',
      linkText: 'Ver Trámites',
      areas: [
        areas.matriculacion,
        areas.comisionMatriculacion,
        areas.fiscalizacion,
        areas.finanzas,
        areas.legales,
        areas.tesorero,
        areas.secretario,
        areas.presidente,
        areas.consejoDirectivo,
        areas.inspeccion,
        areas.comisionFiscalizacion,
        areas.mesaEntrada
      ],
      permissions: [permisos.tramites.ver_tramites_area]
    },
    {
      title: 'Trámites sin asignar',
      value: data.tramitesSinAsignarCount,
      decimal: false,
      suffix: '',
      prefix: '',
      valueClassName: 'text-info',
      image: bg2,
      link: '/asignar_tramites',
      linkText: 'Ver Trámites',
      permissions: [permisos.area.asignar_empleados],
      areas: [areas.matriculacion, areas.legales, areas.fiscalizacion]
    },
    {
      title: 'Expedientes que te asignaron',
      value: data.expedientesAsignadosCount,
      decimal: false,
      suffix: '',
      prefix: '',
      valueClassName: 'text-info',
      image: bg3,
      link: '/expedientes',
      linkText: 'Ver Expedientes',
      areas: [areas.legales, areas.fiscalizacion]
    },
    {
      title: 'Expedientes en el área',
      value: data.expedientesAreaCount,
      decimal: false,
      suffix: '',
      prefix: '',
      valueClassName: 'text-info',
      image: bg4,
      link: '/expedientes_area',
      linkText: 'Ver Expedientes',
      areas: [
        areas.consejoDirectivo,
        areas.legales,
        areas.fiscalizacion,
        areas.tribunalEtica
      ],
      permissions: [permisos.expedientes.ver_expedientes_area]
    },
    {
      title: 'Expedientes sin asignar',
      value: data.expedientesSinAsignarCount,
      decimal: false,
      suffix: '',
      prefix: '',
      valueClassName: 'text-info',
      image: bg1,
      link: '/asignar_expedientes',
      linkText: 'Ver Expedientes',
      permissions: [permisos.area.asignar_empleados],
      areas: [areas.legales, areas.fiscalizacion]
    }
  ];

  return (
    <Row className="g-3 mb-3">
      {statsData
        .filter(stat => checkRoutePermissionsArea(stat, user.empleado))
        .map((stat, index) => (
          <Col
            key={stat.title}
            xs={12}
            sm={
              statsData.length % 2 === 0
                ? 6
                : index === statsData.length - 1
                ? 12
                : 6
            }
            md={
              statsData.length % 3 === 0
                ? 4
                : statsData.length % 3 === 1
                ? index === statsData.length - 1
                  ? 12
                  : 4
                : statsData.length % 3 === 2
                ? index === statsData.length - 1
                  ? 6
                  : index === statsData.length - 2
                  ? 6
                  : 4
                : 4
            }
            xl={
              statsData.length % 2 === 0
                ? 6
                : index === statsData.length - 1
                ? 12
                : 6
            }
          >
            <StatisticsCard stat={stat} className="h-100" />
          </Col>
        ))}
    </Row>
  );
};

StatisticsCards.propTypes = {
  data: PropTypes.object
};

export default StatisticsCards;
