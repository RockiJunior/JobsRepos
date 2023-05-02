import Treeview from 'components/common/TreeviewRelations';
import React from 'react';
import PropTypes from 'prop-types';

const Relations = ({ cedula, relations }) => {
  const parseRelations = relations => {
    const {
      id,
      tipo,
      titulo,
      numero,
      estado,
      expedientesHijos,
      tramitesHijos,
      cedulas
    } = relations;
    const children = [];
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

    return {
      name: titulo,
      id: id,
      children: children,
      tipo: tipo + 's',
      numero,
      estado,
      current: id === cedula.id && tipo === 'cedula'
    };
  };

  return relations ? (
    <div style={{ width: 'fit-content' }}>
      <Treeview data={[parseRelations(relations)]} />
    </div>
  ) : null;
};

Relations.propTypes = {
  cedula: PropTypes.object,
  relations: PropTypes.object
};

export default Relations;
