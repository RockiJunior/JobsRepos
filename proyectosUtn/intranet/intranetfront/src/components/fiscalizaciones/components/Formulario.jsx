import { CustomAccordionItem } from 'components/expedientes/components/infoAccordion/CustomAccordionItem';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Accordion } from 'react-bootstrap';
import FiscalizacionInputs from './inputs/FiscalizacionInputs';

const Formulario = ({ fiscalizacion, expediente, isDisabled }) => {
  const [actualSection, setActualSection] = useState(0);
  const goToSection = section => {
    setActualSection(section);
  };

  return (
    <Accordion
      activeKey={actualSection}
      onSelect={section => goToSection(section)}
    >
      {fiscalizacion.tipo.secciones.map((accordionItem, index) => (
        <CustomAccordionItem
          key={index}
          eventKey={index}
          title={accordionItem.titulo}
        >
          <FiscalizacionInputs
            inputs={accordionItem.inputs}
            title={accordionItem.titulo}
            status={accordionItem.estado}
            isDisabled={isDisabled}
            expediente={expediente}
            fiscalizacionId={fiscalizacion.id}
          />
        </CustomAccordionItem>
      ))}
    </Accordion>
  );
};

Formulario.propTypes = {
  fiscalizacion: PropTypes.object.isRequired,
  expediente: PropTypes.object.isRequired,
  isDisabled: PropTypes.bool.isRequired
};

export default Formulario;
