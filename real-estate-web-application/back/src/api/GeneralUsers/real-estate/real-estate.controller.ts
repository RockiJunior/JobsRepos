// Libraries
import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

// Databases, Controllers, Services & Dtos
import { RealEstateService } from './real-estate.service';
import { CreateRealEstateDto } from './dto/create-real-estate.dto';

@ApiTags('Real-Estate')
@Controller('real-estate')
export class RealEstateController {
	constructor(private readonly realEstateService: RealEstateService) {}

	@Post()
	create(@Body() createRealEstateDto: CreateRealEstateDto) {
		return this.realEstateService.create(createRealEstateDto);
	}

	@Get()
	findAll() {
		return this.realEstateService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: number) {
		return this.realEstateService.findOne(id);
	}
}
