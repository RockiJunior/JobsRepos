/*nombreArtistico*/
//Function to convert camel case to normal case

export const capitalize = str => {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, function (str) {
      return str.toUpperCase();
    })
    .trim();
};
