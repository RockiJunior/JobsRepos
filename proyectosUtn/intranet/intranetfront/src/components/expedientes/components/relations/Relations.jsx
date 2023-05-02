import Treeview from 'components/common/TreeviewRelations';
import React from 'react';
import PropTypes from 'prop-types';

const Relations = ({ expediente, relations }) => {
  const parseRelations = relations => {
    const {
      id,
      tipo,
      titulo,
      numero,
      estado,
      expedientesHijos,
      tramitesHijos,
      procesosLegales,
      fiscalizaciones,
      cedulas
    } = relations;
    const children = [];
    const expedienteChildren = [];
    if (expedientesHijos) {
      expedientesHijos.forEach(expediente => {
        children.push(parseRelations(expediente));
      });
    }
    if (tramitesHijos) {
      tramitesHijos.forEach(tramite => {
        children.push(parseRelations(tramite));
      });
    }
    if (cedulas) {
      cedulas.forEach(cedula => {
        children.push(parseRelations(cedula));
      });
    }

    if (procesosLegales) {
      expedienteChildren.push(
        ...procesosLegales.map(pl => ({
          name: 'Proceso Legal: ' + pl.id,
          id: pl.id,
          tipo: `expedientes/${id}/procesos_legales`,
          numero: pl.id,
          estado: pl.estado
        }))
      );
    }

    if (fiscalizaciones) {
      expedienteChildren.push(
        ...fiscalizaciones.map(pl => ({
          name: 'Fiscalizacion: ' + pl.titulo,
          id: pl.id,
          tipo: `expedientes/${id}/fiscalizaciones`,
          numero: pl.id,
          estado: pl.estado
        }))
      );
    }

    return {
      name: titulo,
      id: id,
      children: [...children, ...expedienteChildren],
      tipo: tipo + 's',
      numero,
      estado,
      current: id === expediente.id && tipo === 'expediente'
    };
  };

  return relations ? (
    <div style={{ width: 'fit-content' }}>
      <Treeview data={[parseRelations(relations)]} />
    </div>
  ) : null;
};

Relations.propTypes = {
  expediente: PropTypes.object,
  relations: PropTypes.object
};

export default Relations;
