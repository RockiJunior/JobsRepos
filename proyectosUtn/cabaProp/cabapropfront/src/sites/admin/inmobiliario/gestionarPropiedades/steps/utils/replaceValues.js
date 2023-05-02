export const replaceValues = (obj, values) => {
  for (const key in obj) {
    if (typeof obj[key] === 'object') {
      replaceValues(obj[key], values);
    } else {
      obj[key] = values[key];
    }
  }
};
