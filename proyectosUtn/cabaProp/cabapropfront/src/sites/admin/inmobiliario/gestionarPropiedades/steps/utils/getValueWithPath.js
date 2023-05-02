export const getValueWithPath = (obj, path) => {
  const pathArray = path.split('.');
  let value = obj;

  pathArray.forEach(key => {
    value = value[key];
  });

  return value;
};
