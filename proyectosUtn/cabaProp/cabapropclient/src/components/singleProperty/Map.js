import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const Map = () => {
  // * States
  const location = useSelector(
    (state) => state.properties.singleProperty
  ).location;
  let MY_MAPTYPE_ID = "style_KINESB";

  // * Methods
  const initialize = () => {
    let featureOpts = [
      {
        featureType: "administrative",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#666666",
          },
        ],
      },
      {
        featureType: "all",
        elementType: "labels",
        stylers: [{ visibility: "simplified" }],
      },
      {
        featureType: "landscape",
        elementType: "all",
        stylers: [
          {
            color: "#e2e2e2",
          },
        ],
      },
      {
        featureType: "poi",
        elementType: "all",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {
        featureType: "road",
        elementType: "all",
        stylers: [
          {
            saturation: -100,
          },
          {
            lightness: 45,
          },
          {
            visibility: "off",
          },
        ],
      },
      {
        featureType: "road.highway",
        elementType: "all",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {
        featureType: "road.arterial",
        elementType: "labels.icon",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {
        featureType: "transit",
        elementType: "all",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {
        featureType: "water",
        elementType: "all",
        stylers: [
          {
            color: "#aadaff",
          },
          {
            visibility: "on",
          },
        ],
      },
    ];
    let myGent = new window.google.maps.LatLng(location.lat, location.lng);
    let mapOptions = {
      zoom: 17,
      mapTypeControl: true,
      zoomControl: true,
      zoomControlOptions: {
        style: window.google.maps.ZoomControlStyle.SMALL,
        position: window.google.maps.ControlPosition.LEFT_TOP,
        mapTypeIds: [window.google.maps.MapTypeId.ROADMAP, MY_MAPTYPE_ID],
      },
      mapTypeId: MY_MAPTYPE_ID,
      scaleControl: false,
      streetViewControl: false,
      center: myGent,
    };
    let map = new window.google.maps.Map(
      document.getElementById("map-canvas"),
      mapOptions
    );
    let styledMapOptions = {
      name: "style_KINESB",
    };

    // let image = 'assets/images/resource/mapmarker.png';
    //   let marker = new window.google.maps.Marker({
    //       position: Kine,
    //       map: map,
    // animation: window.google.maps.Animation.DROP,
    //       title: 'B4318, Gumfreston SA70 8RA, United Kingdom',
    // icon: image
    //   });

    let customMapType = new window.google.maps.StyledMapType(
      featureOpts,
      styledMapOptions
    );
    map.mapTypes.set(MY_MAPTYPE_ID, customMapType);
  };

  useEffect(() => {
    initialize();
    //eslint-disable-next-line
  }, []);
  return (
    <div className="col-lg-12">
      <div className="property_sp_map mt30">
        <div className="h400 bdrs3" id="map-canvas"></div>
      </div>
    </div>
  );
};

export default Map;
