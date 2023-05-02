import { Controller, Get, Param, BadRequestException } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CheckPermissions } from '../auth/decorators/permission.decorator';
import { PermissionEnumList } from '../../../config/enum-types';
import { UseGuards } from '@nestjs/common';
import { PermissionGuard } from '../auth/guards/permission-guard';
import { Public } from '../auth/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Conversations')
@Controller('conversations')
export class ConversationsController {
	constructor(private readonly conversationsService: ConversationsService) {}

	@ApiBearerAuth()
	@CheckPermissions(PermissionEnumList.seeConversation)
	@UseGuards(PermissionGuard)
	@ApiResponse({
		status: 200,
		description: 'Success Response',
	})
	@ApiResponse({
		type: BadRequestException,
		description: 'Try to fix or fill empty fields',
	})
	@Get(':conversationId')
	findOneClient(@Param('conversationId') conversationId: number) {
		return this.conversationsService.findByConversationId(conversationId);
	}

	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	@ApiResponse({
		status: 200,
		description: 'Success Response',
	})
	@ApiResponse({
		type: BadRequestException,
		description: 'Try to fix or fill empty fields',
	})
	@Get('conversation/:clientId/:propertyId')
	findConversationByPropertyAndClientId(
		@Param('clientId') clientId: string,
		@Param('propertyId') propertyId: string
	) {
		return this.conversationsService.findConversationByPropertyAndClientId(
			clientId,
			propertyId
		);
	}

	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	@ApiResponse({
		status: 200,
		description: 'Success Response',
	})
	@ApiResponse({
		type: BadRequestException,
		description: 'Try to fix or fill empty fields',
	})
	@Get('client/:clientId')
	findOne(@Param('clientId') clientId: string) {
		return this.conversationsService.findConversationsByClientId(clientId);
	}

	@ApiBearerAuth()
	@CheckPermissions(PermissionEnumList.seeConversation)
	@UseGuards(PermissionGuard)
	@ApiResponse({
		status: 200,
		description: 'Success Response',
	})
	@ApiResponse({
		type: BadRequestException,
		description: 'Try to fix or fill empty fields',
	})
	@Get('property/:propertyId')
	findAll(@Param('propertyId') propertyId: string) {
		return this.conversationsService.findConversationsByPropertyId(propertyId);
	}

	@ApiBearerAuth()
	@CheckPermissions(PermissionEnumList.seeConversation)
	@UseGuards(PermissionGuard)
	@ApiResponse({
		status: 200,
		description: 'Success Response',
	})
	@ApiResponse({
		type: BadRequestException,
		description: 'Try to fix or fill empty fields',
	})
	@Get('branchOfficeId/:branchOfficeId')
	findConversationsByBranchOfficeId(@Param('branchOfficeId') branchOfficeId: number) {
		return this.conversationsService.findConversationsByBranchOfficeId(branchOfficeId);
	}
}
