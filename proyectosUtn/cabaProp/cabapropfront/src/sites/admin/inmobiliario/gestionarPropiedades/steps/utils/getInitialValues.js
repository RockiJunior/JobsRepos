import { getValueWithPath } from './getValueWithPath';

export const getInitialValues = (data, initialValues) => {
  const newInitialValues = {};

  initialValues.forEach(({ name, path }) => {
    newInitialValues[name] = getValueWithPath(data, path);
  });

  return newInitialValues;
};
