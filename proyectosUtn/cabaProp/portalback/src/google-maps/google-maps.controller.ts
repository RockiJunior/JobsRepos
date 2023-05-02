import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common';
import { GoogleMapsService } from './google-maps.service';
import { Public } from '../api/GeneralUsers/auth/decorators/public.decorator';

@Controller('google-maps')
export class GoogleMapsController {
	constructor(private readonly googleMapsService: GoogleMapsService) {}

	@Public()
	@Get('get-coordinates')
	async getCoordinates(@Body() body: any) {
		return this.googleMapsService.getCoordinates(body);
	}
}
