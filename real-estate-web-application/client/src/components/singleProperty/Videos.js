import React from "react";

const Videos = ({ data }) => {
  const video = data.video?.split("watch?v=")[1]
  const video360 = data.video360?.split("watch?v=")[1]
  return (
    <>
      {data.video && (
        <div className="col-lg-12">
          <div className="additional_details pb40 mt50 bb1">
            <div className="row">
              <div className="col-lg-12">
                <h4 className="mb10">Video de la propiedad</h4>
              </div>
              <iframe
                width="50"
                height="450"
                src={`https://www.youtube.com/embed/${video}`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
      {video360 && (
        <div className="col-lg-12">
          <div className="additional_details pb40 mt50 bb1">
            <div className="row">
              <div className="col-lg-12">
                <h4 className="mb10">Tour 360° de la propiedad</h4>
              </div>
              <iframe
                width="560"
                height="450"
                src={`https://www.youtube.com/embed/${video360}`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
      {/* <div className="col-lg-12">
        <div className="additional_details pb40 mt50 bb1">
          <div className="row">
            <div className="col-lg-12">
              <h4 className="mb10">Tour 360° de la propiedad</h4>
            </div>
            <div className="title">
              <a
                className="ml20"
                href="https://www.youtube.com/watch?v=QnqvmnuEUUw"
              >
                https://www.youtube.com/watch?v=QnqvmnuEUUw
              </a>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default Videos;
