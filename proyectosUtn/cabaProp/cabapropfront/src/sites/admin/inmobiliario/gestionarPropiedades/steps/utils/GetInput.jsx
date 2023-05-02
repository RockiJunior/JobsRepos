import React from 'react';
import { Antiquity } from '../components/Antiquity';
import { CoveredSurface } from '../components/CoveredSurface';
import { Description } from '../components/Description';
import { Expensas } from '../components/Expensas';
import { MinusPlusInput } from '../components/MinusPlusInput';
import { Price } from '../components/Price';
import { TotalSurface } from '../components/TotalSurface';
import { getValueWithPath } from './getValueWithPath';
import { Form } from 'react-bootstrap';

const handleSwitch = (e, setData) => {
  setData(prev => ({
    ...prev,
    characteristics: {
      ...prev.characteristics,
      [e.target.id]: e.target.checked
    }
  }));
};

export const GetInput = ({
  input: { type, name, title, path, noTotal },
  errors,
  touched,
  values,
  setValues,
  data,
  handleChangeCarac,
  setData
}) => {
  switch (type) {
    case 'minusPlus':
      // eslint-disable-next-line no-case-declarations
      const quantityMinusPlus = getValueWithPath(data, path);

      return (
        <MinusPlusInput
          handleChangeCarac={handleChangeCarac}
          name={name}
          title={title}
          quantity={quantityMinusPlus}
        />
      );

    case 'switch':
      // eslint-disable-next-line no-case-declarations
      const switchValue = getValueWithPath(data, path);

      return (
        <Form.Check
          type="switch"
          label={title}
          id={name}
          onChange={e => handleSwitch(e, setData)}
          checked={switchValue}
        />
      );

    case 'checkbox':
      // eslint-disable-next-line no-case-declarations
      const checkboxValue = getValueWithPath(data, path);

      return (
        <Form.Check
          type="checkbox"
          label={title}
          id={name}
          onChange={e => handleSwitch(e, setData)}
          checked={checkboxValue}
        />
      );

    case 'totalSurface':
      return (
        <TotalSurface errors={errors} touched={touched} noTotal={noTotal} />
      );

    case 'coveredSurface':
      return <CoveredSurface errors={errors} touched={touched} />;

    case 'antiquity':
      return (
        <Antiquity
          errors={errors}
          touched={touched}
          values={values}
          setValues={setValues}
        />
      );

    case 'price':
      return (
        <Price
          errors={errors}
          touched={touched}
          setValues={setValues}
          values={values}
        />
      );

    case 'expenses':
      return <Expensas errors={errors} touched={touched} />;

    case 'description':
      return <Description errors={errors} touched={touched} />;

    default:
      return null;
  }
};
