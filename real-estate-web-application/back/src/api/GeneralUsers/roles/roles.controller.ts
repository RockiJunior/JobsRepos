// Libraries
import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Req,
	UseGuards,
	BadRequestException,
} from '@nestjs/common';
import {
	ApiBearerAuth,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';

// Databases, Controllers, Services & Dtos
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { CheckPermissions } from '../auth/decorators/permission.decorator';
import { PermissionEnumList } from '../../../config/enum-types';
import { PermissionGuard } from '../auth/guards/permission-guard';

@ApiBearerAuth()
@ApiTags('Roles')
@Controller('roles')
export class RolesController {
	constructor(private readonly rolesService: RolesService) {}

	@CheckPermissions(PermissionEnumList.createRoles)
	@UseGuards(PermissionGuard)
	@ApiResponse({
		status: 200,
		description: 'Success Response',
	})
	@ApiResponse({
		type: BadRequestException,
		description: 'Try to fix or fill empty fields',
	})
	@Post(':realEstateId')
	create(
		@Body() createRoleDto: CreateRoleDto,
		@Param('realEstateId') realEstateId: number
	) {
		return this.rolesService.create(createRoleDto, realEstateId);
	}

	@CheckPermissions(PermissionEnumList.seeRoles)
	@UseGuards(PermissionGuard)
	@ApiResponse({
		status: 200,
		description: 'Success Response',
	})
	@ApiResponse({
		type: BadRequestException,
		description: 'Try to fix or fill empty fields',
	})
	@Get()
	findAll() {
		return this.rolesService.findAll();
	}

	@CheckPermissions(PermissionEnumList.seeRoles)
	@UseGuards(PermissionGuard)
	@ApiResponse({
		status: 200,
		description: 'Success Response',
	})
	@ApiResponse({
		type: BadRequestException,
		description: 'Try to fix or fill empty fields',
	})
	@Get(':id')
	findOne(@Param('id') id: number) {
		return this.rolesService.findOne(id);
	}

	@CheckPermissions(PermissionEnumList.editRoles)
	@UseGuards(PermissionGuard)
	@ApiOperation({
		summary: 'Edits role By real estate Id',
	})
	@ApiResponse({
		status: 200,
		description: 'Success Response',
	})
	@ApiResponse({
		type: BadRequestException,
		description: 'Try to fix or fill empty fields',
	})
	@Patch(':realEstateId')
	update(
		@Param('realEstateId') realEstateId: number,
		@Body() updateRoleDto: UpdateRoleDto
	) {
		return this.rolesService.update(realEstateId, updateRoleDto);
	}

	@CheckPermissions(PermissionEnumList.deleteRoles)
	@UseGuards(PermissionGuard)
	@ApiResponse({
		status: 200,
		description: 'Success Response',
	})
	@ApiResponse({
		type: BadRequestException,
		description: 'Try to fix or fill empty fields',
	})
	@Delete(':id')
	remove(@Param('id') id: number) {
		return this.rolesService.remove(id);
	}
}
