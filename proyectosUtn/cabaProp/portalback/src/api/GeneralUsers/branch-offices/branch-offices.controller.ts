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
import { Public } from '../auth/decorators/public.decorator';
// Databases, Controllers, Services & Dtos
import { BranchOfficesService } from './branch-offices.service';
import { CreateBranchOfficeDto } from './dto/create-branch-office.dto';

@ApiTags('Branch-Offices')
@Controller('branch-offices')
export class BranchOfficesController {
	constructor(private readonly branchOfficesService: BranchOfficesService) {}

	@Public()
	@Post()
	create(@Body() createBranchOfficeDto: CreateBranchOfficeDto) {
		return this.branchOfficesService.create(createBranchOfficeDto);
	}

	@Public()
	@Get()
	findAll() {
		return this.branchOfficesService.findAll();
	}

	@Public()
	@Get(':id')
	findOne(@Param('id') id: number) {
		return this.branchOfficesService.findOne(id);
	}
}
