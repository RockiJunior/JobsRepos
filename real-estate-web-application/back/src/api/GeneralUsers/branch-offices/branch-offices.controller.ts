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
import { BranchOfficesService } from './branch-offices.service';
import { CreateBranchOfficeDto } from './dto/create-branch-office.dto';

@ApiTags('Branch-Offices')
@Controller('branch-offices')
export class BranchOfficesController {
	constructor(private readonly branchOfficesService: BranchOfficesService) {}

	@Post()
	create(@Body() createBranchOfficeDto: CreateBranchOfficeDto) {
		return this.branchOfficesService.create(createBranchOfficeDto);
	}

	@Get()
	findAll() {
		return this.branchOfficesService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: number) {
		return this.branchOfficesService.findOne(id);
	}

}
