import { IsNotEmpty, IsNumber, IsOptional, IsPositive } from 'class-validator';
import { IsString } from '@nestjs/class-validator';

export class JoinRoomDto {
	@IsString()
	@IsOptional()
	clientId?: string;
	
	@IsString()
	@IsOptional()
	userId?: string;

	@IsString()
	@IsNotEmpty()
	propertyId: string;

	@IsNotEmpty()
	@IsNumber()
	@IsPositive()
	conversationId: number;

	@IsNotEmpty()
	@IsNumber()
	@IsPositive()
	branchOfficeId: number;

	@IsNotEmpty()
	@IsString()
	socketId: string;
}
