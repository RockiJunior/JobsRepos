import { useEffect, useState } from "react";

const Gallery = ({ data }) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(null);
  const [images, setImages] = useState();

  // * Methods
  // Move to the previous image in the gallery
  const prevImg = () => {
    if (currentImgIndex > 0) {
      setCurrentImgIndex(currentImgIndex - 1);
    } else {
      setCurrentImgIndex(data.images.length - 1);
    }
  };

  // Move to the next image in the gallery
  const nextImg = () => {
    if (currentImgIndex < data.images.length - 1) {
      setCurrentImgIndex(currentImgIndex + 1);
    } else {
      setCurrentImgIndex(0);
    }
  };

  // * Life Cycle
  useEffect(() => {
    const imagesArray = data.images;
    const emptyObjects = Array(10 - imagesArray.length).fill({});
    setImages([...imagesArray, ...emptyObjects]);
    // eslint-disable-next-line
  }, []);

  return (
    <>
      {/* Thumbnails */}
      {images && (
        <div className="gallery-main">
          <div className="gallery-main-left">
            <img
              className="gallery-main-img cursor-pointer"
              src={
                images[0]?.url
                  ? images[0].url
                  : `/uploads/properties/${images[0]?.filename}`
              }
              alt="0.jpg"
              onClick={() => setCurrentImgIndex(0)}
            />
          </div>

          <div className="gallery-main-right">
            {images.map(
              (thumb, index) => {
                if (index === 0) return null;
                if (thumb?.filename) {
                  return (
                    <img
                      key={index}
                      src={
                        thumb?.url
                          ? thumb.url
                          : `/uploads/properties/${thumb?.filename}`
                      }
                      alt={index + 1}
                      className="pic-thumb"
                      onClick={() => setCurrentImgIndex(index)}
                    />
                  );
                }
                return <div className="grid-bg" key={index} />;
              }
              // )
            )}
          </div>
        </div>
      )}
      {/* <span className="baddge_left">DESTACADO</span>
                <span className="baddge_right">
                  {[2, 3].includes(data.operation_type)
                    ? "EN ALQUILER"
                    : "EN VENTA"}
                </span> */}

      {/* Popup Gallery */}
      {currentImgIndex !== null && (
        <div className="pic-popup-gallery">
          <span className="pic-close" onClick={() => setCurrentImgIndex(null)}>
            &times;
          </span>
          <img
            src={
              images[currentImgIndex]?.url
                ? images[currentImgIndex].url
                : `/uploads/properties/${images[currentImgIndex]?.filename}`
            }
            alt="Popup"
            className="pic-popup-img"
          />
          <span className="pic-prev" onClick={prevImg}>
            &#10094;
          </span>
          <span className="pic-next" onClick={nextImg}>
            &#10095;
          </span>
        </div>
      )}
    </>
  );
};

export default Gallery;
