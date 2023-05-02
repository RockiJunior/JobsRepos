export const capitalize = str => {
  return str
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const decapitalize = str => {
  return str
    .split(' ')
    .map(word => word.toLowerCase())
    .join('_');
};
