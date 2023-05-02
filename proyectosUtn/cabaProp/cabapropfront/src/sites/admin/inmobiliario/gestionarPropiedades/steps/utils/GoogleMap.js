import React, { useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Map, Marker, GoogleApiWrapper, Polygon } from 'google-maps-react';
import googleMapStyles from './googleMapStyles.js';
import AppContext from 'context/Context';
import { coords } from './coords.js';
import messageHandler from 'utils/messageHandler.js';

const GoogleMap = ({
  mapStyle,
  darkStyle,
  className,
  children,
  values,
  setValues,
  ...rest
}) => {
  const {
    config: { isDark }
  } = useContext(AppContext);
  const [center, setCenter] = useState({
    lat: values.lat,
    lng: values.lng
  });

  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current && darkStyle) {
      if (isDark) {
        mapRef.current.map.setOptions({
          styles: googleMapStyles[darkStyle]
        });
      } else {
        mapRef.current.map.setOptions({
          styles: googleMapStyles[mapStyle]
        });
      }
    }
  }, [isDark]);

  useEffect(() => {
    setCenter({
      lat: values.lat,
      lng: values.lng
    });
  }, [values]);

  const handleClick = (old, event, newMarker) => {
    const lat = newMarker.latLng.lat();
    const lng = newMarker.latLng.lng();
    const inside = isInsidePolygon(lat, lng, coords);
    if (inside) {
      setCenter({ lat, lng });
      setValues({
        ...values,
        lat: newMarker.latLng.lat(),
        lng: newMarker.latLng.lng()
      });
    } else {
      messageHandler('error', 'La ubicación debe pertenecer a CABA');
      setCenter({ lat: values.lat, lng: values.lng });
    }
  };

  const isInsidePolygon = (x, y, polygon) => {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      let xi = polygon[i].lat,
        yi = polygon[i].lng;
      let xj = polygon[j].lat,
        yj = polygon[j].lng;

      let intersect =
        yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  };
  return (
    <div className="d-flex justify-content-start position-relative">
      <Map
        mapTypeControl={false}
        scaleControl={false}
        streetViewControl={false}
        panControl={false}
        fullscreenControl={false}
        containerStyle={{
          width: '100%',
          height: '350px'
        }}
        styles={googleMapStyles[mapStyle]}
        ref={mapRef}
        {...rest}
      >
        {values.lat && values.lng && (
          <Marker
            position={center}
            onDragend={(old, event, newMarker) =>
              handleClick(old, event, newMarker)
            }
            draggable={true}
            title="Dirección de la propiedad"
          />
        )}

        <Polygon
          paths={coords}
          strokeColor="#0000FF"
          strokeOpacity={0}
          strokeWeight={2}
          fillColor="#0000FF"
          fillOpacity={0}
        />
      </Map>
    </div>
  );
};

GoogleMap.propTypes = {
  mapStyle: PropTypes.oneOf([
    'Default',
    'Gray',
    'Midnight',
    'Hopper',
    'Beard',
    'AssassianCreed',
    'SubtleGray',
    'Tripitty',
    'Cobalt'
  ]),
  darkStyle: PropTypes.oneOf([
    'Default',
    'Gray',
    'Midnight',
    'Hopper',
    'Beard',
    'AssassianCreed',
    'SubtleGray',
    'Tripitty',
    'Cobalt'
  ]),
  className: PropTypes.string,
  children: PropTypes.node,
  ...Map.propTypes
};

GoogleMap.defaultProps = { mapStyle: 'Beard' };

// TODO: Do you provide the apiKey in production, instruct user to use his own apiKey
export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_MAP_KEY,
  language: 'es'
})(GoogleMap);
