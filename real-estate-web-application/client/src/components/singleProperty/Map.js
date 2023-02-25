import React, { useEffect } from 'react'

const Map = ({location}) => {
  let MY_MAPTYPE_ID = 'style_KINESB';

const initialize = () => {
  let featureOpts = [
    {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#666666"
            }
        ]
    },
    {
    "featureType": 'all',
    "elementType": 'labels',
    "stylers": [
            { visibility: 'simplified' }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "color": "#e2e2e2"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 45
            },
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "color": "#aadaff"
            },
            {
                "visibility": "on"
            }
        ]
    }
];
  let myGent = new google.maps.LatLng(location.lat, location.lng);
  let Kine = new google.maps.LatLng(location.lat, location.lng);
  let mapOptions = {
    zoom: 17,
    mapTypeControl: true,
    zoomControl: true,
    zoomControlOptions: {
        style: google.maps.ZoomControlStyle.SMALL,
        position: google.maps.ControlPosition.LEFT_TOP,
        mapTypeIds: [google.maps.MapTypeId.ROADMAP, MY_MAPTYPE_ID]
    },
    mapTypeId: MY_MAPTYPE_ID,
    scaleControl: false,
    streetViewControl: false,
    center: myGent
  }
  let map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);  
  let styledMapOptions = {
    name: 'style_KINESB'
  };

let image = 'assets/images/resource/mapmarker.png';
  let marker = new google.maps.Marker({
      position: Kine,
      map: map,
animation: google.maps.Animation.DROP,
      title: 'B4318, Gumfreston SA70 8RA, United Kingdom',
// icon: image
  });

  let customMapType = new google.maps.StyledMapType(featureOpts, styledMapOptions);
  map.mapTypes.set(MY_MAPTYPE_ID, customMapType);
}

useEffect(()=>{
  initialize()
},[])
  return (
    <div className="col-lg-12">
    <div className="property_sp_map mt30">
      <div className="h400 bdrs3" id="map-canvas"></div>
    </div>
  </div>

  )
}

export default Map