import { IsOptional } from '@nestjs/class-validator';
export class UserListDto {
	propertyId: string;
	userId: string;
	branchOfficeId: number;
	conversationId: number;
	@IsOptional()
	socketId?: string;
}
