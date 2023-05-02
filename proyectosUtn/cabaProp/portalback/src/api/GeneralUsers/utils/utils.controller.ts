import { Controller, Get, Param } from '@nestjs/common';
import { UtilsService } from './utils.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Utils')
@Controller('utils')
export class UtilsController {
	constructor(private readonly utilsService: UtilsService) {}

	// Characteristics ----------------------------------------------------------------------
	@Get('get-characteristics')
	findAllCharacteristics() {
		return this.utilsService.findAllCharacteristics();
	}

	@Get('get-characteristics/:id')
	findOneCharacteristic(@Param('id') id: number) {
		return this.utilsService.findOneCharacteristic(id);
	}

	// Ambiences ----------------------------------------------------------------------
	@Get('get-ambiences')
	findAll() {
		return this.utilsService.findAllAmbiences();
	}

	@Get('get-ambiences/:id')
	findOne(@Param('id') id: number) {
		return this.utilsService.findOneAmbience(id);
	}

	// Antiquities ----------------------------------------------------------------------
	@Get('get-antiquities')
	findAllAntiquities() {
		return this.utilsService.findAllAntiquities();
	}

	@Get('get-antiquities/:id')
	findOneAntiquity(@Param('id') id: number) {
		return this.utilsService.findOneAntiquity(id);
	}

	// Currencies ----------------------------------------------------------------------
	@Get('get-currencies')
	findAllCurrencies() {
		return this.utilsService.findAllCurrencies();
	}

	@Get('get-currencies/:id')
	findOneCurrency(@Param('id') id: number) {
		return this.utilsService.findOneCurrency(id);
	}

	// Operations ----------------------------------------------------------------------
	@Get('get-operations')
	findAllOperations() {
		return this.utilsService.findAllOperations();
	}

	@Get('get-operations/:id')
	findOneOperation(@Param('id') id: number) {
		return this.utilsService.findOneOperation(id);
	}

	// Properties ----------------------------------------------------------------------
	@Get('get-properties')
	findAllProperties() {
		return this.utilsService.findAllProperties();
	}

	@Get('get-properties/:id')
	findOneProperty(@Param('id') id: number) {
		return this.utilsService.findOneProperty(id);
	}
}
