import SectionTitle from 'components/common/SectionTitle';
import React from 'react';
import { Card } from 'react-bootstrap';
import PropTypes from 'prop-types';

export const CustomCard = ({
  title,
  icon,
  className,
  style,
  children,
  subtitle
}) => {
  return (
    <>
      <SectionTitle
        icon={icon}
        title={title}
        transform="shrink-2"
        className="pb-2"
        subtitle={subtitle}
      />

      <Card className={className + ' bg-white'} style={style}>
        {children}
      </Card>
    </>
  );
};
CustomCard.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node.isRequired,
  subtitle: PropTypes.string
};
