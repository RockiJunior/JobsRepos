// Libraries
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
// Databases, Controllers, Services & Dtos
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { CheckPermissions } from '../auth/decorators/permission.decorator';
import { PermissionEnumList } from '../../../config/enum-types';
import { PermissionGuard } from '../auth/guards/permission-guard';

@ApiBearerAuth()
@ApiTags('Permissions')
@Controller('permissions')
export class PermissionsController {
	constructor(private readonly permissionsService: PermissionsService) {}

	@CheckPermissions(
		PermissionEnumList.createRoles,
		PermissionEnumList.editRoles,
		PermissionEnumList.seeRoles,
		PermissionEnumList.deleteRoles
	)
	@UseGuards(PermissionGuard)
	@Get()
	findAll() {
		return this.permissionsService.findAll();
	}
}
