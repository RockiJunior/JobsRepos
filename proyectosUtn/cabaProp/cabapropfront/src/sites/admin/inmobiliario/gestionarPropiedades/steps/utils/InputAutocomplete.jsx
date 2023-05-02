import React, { useEffect, useRef, useState } from 'react';
import messageHandler from 'utils/messageHandler';
import { listaBarrios } from '../../mockup/barrios';
const apiKey = process.env.REACT_APP_MAP_KEY;
const mapApiJs = 'https://maps.googleapis.com/maps/api/js';
const geocodeJson = 'https://maps.googleapis.com/maps/api/geocode/json';

// load google map api js

/* function loadAsyncScript(src) {
  return new Promise(resolve => {
    const script = document.createElement("script");
    Object.assign(script, {
      type: "text/javascript",
      async: true,
      src
    })
    script.addEventListener("load", () => resolve(script));
    document.head.appendChild(script);
  })
} */

const extractAddress = place => {
  const address = {
    city: '',
    state: '',
    zip: '',
    country: '',
    plain() {
      const city = this.city ? this.city + ', ' : '';
      const zip = this.zip ? this.zip + ', ' : '';
      const state = this.state ? this.state + ', ' : '';
      return city + zip + state + this.country;
    }
  };

  if (!Array.isArray(place?.address_components)) {
    return address;
  }

  place.address_components.forEach(component => {
    const types = component.types;
    const value = component.long_name;

    if (types.includes('locality')) {
      address.city = value;
    }

    if (types.includes('administrative_area_level_2')) {
      address.state = value;
    }

    if (types.includes('postal_code')) {
      address.zip = value;
    }

    if (types.includes('country')) {
      address.country = value;
    }
  });

  return address;
};

const InputAddressAutocomplete = ({
  ready,
  values,
  setValues,
  emptyInput,
  setEmptyInput
}) => {
  const searchInput = useRef(null);
  const currentBarrio =
    values.barrio > 0 &&
    listaBarrios.find(barrio => barrio.value === values.barrio);
  const inputValue =
    values.lat && `${values.street} ${values.number}, Buenos Aires, Argentina`;
  // init gmap script
  /* const initMapScript = () => {
    // if script already loaded
    if(window.google) {
      return Promise.resolve();
    }
    const src = `${mapApiJs}?key=${apiKey}&libraries=places&v=weekly`;
    return loadAsyncScript(src);
  }
 */
  // do something on address change
  const onChangeAddress = autocomplete => {
    const place = autocomplete.getPlace();
    if (
      place.address_components &&
      place.address_components[0].types.includes('street_number') &&
      place.address_components[5].short_name === 'CABA'
    ) {
      const barrioId = listaBarrios.find(
        barrio => barrio.label === place.address_components[2].long_name
      );

      if (barrioId) {
        setValues({
          number: parseInt(place.address_components[0].long_name),
          street: place.address_components[1].short_name,
          barrio: barrioId.value,
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          cp: place.address_components[7].short_name,
          cp_suffix: place.address_components[8]?.short_name || '',
          area_level_1: place.address_components[5].long_name,
          area_level_2: place.address_components[4].short_name,
          locality: place.address_components[3].long_name
        });
      }
    } else {
      setValues({
        number: '',
        street: '',
        barrio: '',
        lat: null,
        lng: null,
        cp: '',
        cp_suffix: '',
        area_level_1: '',
        area_level_2: '',
        locality: ''
      });

      if (place.address_components) {
        messageHandler(
          'error',
          place.address_components[5].short_name !== 'CABA'
            ? 'La dirección ingresada no corresponde a CABA'
            : 'La dirección ingresada no existe o no tiene altura asignada, verifique los datos e intente nuevamente.'
        );
      }
    }
  };

  const checkData = string => {
    if (!string.trim()) {
      setEmptyInput(true);
      setValues({
        number: '',
        street: '',
        barrio: '',
        lat: null,
        lng: null,
        cp: '',
        cp_suffix: '',
        area_level_1: '',
        area_level_2: '',
        locality: ''
      });
    } else {
      setEmptyInput(false);
    }
  };

  // init autocomplete
  const initAutocomplete = () => {
    if (!searchInput.current) return;
    var buenosAires = new window.google.maps.LatLngBounds(
      new window.google.maps.LatLng(-34.6202, -58.3737),
      new window.google.maps.LatLng(-34.5384, -58.4883),
      new window.google.maps.LatLng(-34.6597, -58.6038),
      new window.google.maps.LatLng(-34.4969, -58.4798),
      new window.google.maps.LatLng(-34.7338, -58.4322),
      new window.google.maps.LatLng(-34.5365, -58.2676),
      new window.google.maps.LatLng(-34.7161, -58.5403),
      new window.google.maps.LatLng(-34.5196, -58.3338)
    );
    const options = {
      types: ['address'],
      bounds: buenosAires,
      componentRestrictions: {
        country: 'ar'
      }
    };
    const autocomplete = new window.google.maps.places.Autocomplete(
      searchInput.current,
      options
    );
    autocomplete.setFields(['address_component', 'geometry']);
    autocomplete.addListener('place_changed', () =>
      onChangeAddress(autocomplete)
    );
  };

  const reverseGeocode = ({ latitude: lat, longitude: lng }) => {
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?&location=37.76999%2C-122.44696&radius=500&key=${apiKey}'`;
    // const url = `${geocodeJson}?key=${apiKey}&latlng=${lat},${lng}`;
    searchInput.current.value = 'Getting your location...';
    fetch(url)
      .then(response => response.json())
      .then(location => {
        const place = location.results[0];
        const _address = extractAddress(place);
        searchInput.current.value = _address.plain();
      });
  };

  const findMyLocation = e => {
    e.preventDefault();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        reverseGeocode(position.coords);
      });
    }
  };

  // load map script after mounted
  useEffect(() => {
    if (ready) initAutocomplete();
  }, [ready]);

  return (
    <div className="mb-2">
      <input
        className="form-control form-control-sm"
        ref={searchInput}
        type="text"
        defaultValue={inputValue}
        placeholder="Calle y altura..."
        onBlur={e => checkData(e.target.value)}
        onSubmit={findMyLocation}
      />
    </div>
  );
};

export default InputAddressAutocomplete;
