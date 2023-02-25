import { IsNumber, IsOptional } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateClientUserMessageDto {
	@ApiProperty({
		description: 'Property Id',
	})
	@IsString()
	@IsNotEmpty({
		message: 'Please enter the property Id',
	})
	propertyId: string;

	@ApiProperty({
		description: 'Client Id',
	})
	@IsString()
    @IsOptional()
	clientId?: string;
    
    @ApiProperty({
		description: 'User Id',
	})
	@IsString()
    @IsOptional()
	userId?: string;

	@ApiProperty({
		description: 'Conversation Id',
	})
	@IsOptional()
	@IsNumber()
	@IsPositive()
	conversationId: number;

	@ApiProperty({
		description: 'Branch Office Id',
	})
	@IsNumber()
	@IsPositive()
	branchOfficeId: number;

	@ApiProperty({
		description: 'Enter the query message',
	})
	@IsNotEmpty({
		message: 'Please enter the message',
	})
	@IsString()
	message: any;
}
