import { Injectable, NotFoundException } from '@nestjs/common';
import { Client, LatLngLiteral } from '@googlemaps/google-maps-services-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleMapsService extends Client {
	private readonly accessKey = this.config.get('GOOGLE_MAP_KEY');
	constructor(private config: ConfigService) {
		super();
	}
	async getCoordinates(address: { address: string }) {
		const bounds = {
			northeast: { lat: -34.5225, lng: -58.3505 }, // coordinates for the northeast corner of CABA
			southwest: { lat: -34.7051, lng: -58.5315 }, // coordinates for the southwest corner of CABA
		};
		const geocodeRes = await this.geocode({
			params: {
				address: address.address,
				key: this.accessKey,
			},
		});
		if (!geocodeRes.data.results[0]) {
			return {
				message: 'No se han encontrado resultados',
			};
		}
		const { lat, lng } = geocodeRes.data.results[0].geometry.location;
		if (
			lat < bounds.southwest.lat ||
			lat > bounds.northeast.lat ||
			lng < bounds.southwest.lng ||
			lng > bounds.northeast.lng
		) {
			return {
				message: 'La dirección ingresada no se encuentra en CABA',
			};
		}
		const { address_components } = geocodeRes.data.results[0];
		return {
			lat: lat,
			lng: lng,
			streetNumber: address_components[0].long_name,
			streetName: address_components[1].long_name,
			sublocality_level_1: address_components[2].long_name,
			locality: address_components[3].long_name,
			administrative_area_level_1: address_components[5].long_name,
			administrative_area_level_2: address_components[4].long_name,
			country: address_components[6].long_name,
			postalCode: address_components[7].long_name,
			postalCodeSuffix: address_components[8].long_name,
		};
	}
}
