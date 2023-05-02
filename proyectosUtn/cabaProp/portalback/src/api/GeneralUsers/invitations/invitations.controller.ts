import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { InvitationsService } from './invitations.service';
import { PermissionEnumList } from '../../../config/enum-types';
import { CheckPermissions } from '../auth/decorators/permission.decorator';
import { UseGuards } from '@nestjs/common';
import { PermissionGuard } from '../auth/guards/permission-guard';
@ApiTags('Invitations')
@Controller('invitations')
export class InvitationsController {
	constructor(private readonly invitationsService: InvitationsService) {}

	@Public()
	@Get(':token')
	findOne(@Param('token') token: string) {
		return this.invitationsService.findOne(token);
	}
}
