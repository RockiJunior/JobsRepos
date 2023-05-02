// Libraries
import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Query,
	BadRequestException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';

// Databases, Controllers, Services & Dtos
import { RealEstateService } from './real-estate.service';
import { CreateRealEstateDto } from './dto/create-real-estate.dto';
import { Public } from '../auth/decorators/public.decorator';
import { CheckPermissions } from '../auth/decorators/permission.decorator';
import { UseGuards } from '@nestjs/common';
import { PermissionGuard } from '../auth/guards/permission-guard';
import { PermissionEnumList } from '../../../config/enum-types';
import { FindAllPropertiesDto } from './dto/find-all-properties.dto';

@ApiTags('Real-Estate')
@Controller('real-estate')
export class RealEstateController {
	constructor(private readonly realEstateService: RealEstateService) {}

	@ApiBearerAuth()
	@CheckPermissions(PermissionEnumList.publishProperty)
	@UseGuards(PermissionGuard)
	@Post()
	create(@Body() createRealEstateDto: CreateRealEstateDto) {
		return this.realEstateService.create(createRealEstateDto);
	}

	@Public()
	@ApiQuery({
		name: 'field',
		required: false,
	})
	@ApiQuery({
		name: 'offset',
		required: true,
	})
	@ApiQuery({
		name: 'limit',
		required: true,
	})
	@Get()
	findAll(@Query() findAllPropertiesDto: FindAllPropertiesDto) {
		return this.realEstateService.findAll(findAllPropertiesDto);
	}

	@Public()
	@Get(':id')
	findOne(@Param('id') id: number) {
		return this.realEstateService.findOne(id);
	}
}
