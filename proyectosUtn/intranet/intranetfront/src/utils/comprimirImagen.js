import imageCompression from 'browser-image-compression';

const comprimirImagen = async file => {
  const options = {
    maxSizeMB: 1
  };
  try {
    const blob = await imageCompression(file, options);
    const archivo = new File([blob], file.name, { type: file.type });
    return archivo;
  } catch (error) {
    console.log(error);
  }
};

export default comprimirImagen;
