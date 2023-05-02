export const NormalizeString = (str) => {
  const normalizedString = str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s/g, "-")
    .toLowerCase();
  return normalizedString;
};
