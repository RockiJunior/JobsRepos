import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common';
import { SearchesService } from './searches.service';
import { CreateSearchDto } from './dto/create-search.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateSearchDto } from './dto/update-search.dto';
import { SearchAlertDto } from './dto/search-alert.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Searches')
@Controller('searches')
export class SearchesController {
	constructor(private readonly searchesService: SearchesService) {}

	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	@Post(':clientId')
	create(
		@Body() createSearchDto: CreateSearchDto,
		@Param('clientId') clientId: string
	) {
		return this.searchesService.create(clientId, createSearchDto);
	}

	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	@Get('get-by-client/:clientId')
	findAllByClientId(@Param('clientId') clientId: string) {
		return this.searchesService.findAllByClientId(clientId);
	}

	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	@Get('get-by-search/:searchId')
	findBySearchId(@Param('searchId') searchId: number) {
		return this.searchesService.findBySearchId(searchId);
	}

	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	@Patch('update-search-name/:searchId')
	updateSearchId(
		@Param('searchId') searchId: number,
		@Body() searchName: UpdateSearchDto
	) {
		return this.searchesService.updateSearchName(searchId, searchName);
	}

	// @Patch('update-search-alert/:searchId')
	// updateSearchAlert(
	// 	@Param('searchId') searchId: number,
	// 	@Body() searchAlertDto: SearchAlertDto
	// ) {
	// 	const { alert } = searchAlertDto;
	// 	return this.searchesService.updateAlert(searchId, alert);
	// }

	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	@Delete(':searchId')
	remove(@Param('searchId') searchId: number) {
		return this.searchesService.remove(searchId);
	}
}
