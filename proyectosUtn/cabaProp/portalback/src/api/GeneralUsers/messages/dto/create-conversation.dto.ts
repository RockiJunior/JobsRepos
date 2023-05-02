import { IsNumber, IsOptional } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateConversationDto {
	@ApiProperty({
		description: 'Property Id',
	})
	@IsString()
	@IsNotEmpty({
		message: 'Please enter the property Id',
	})
	propertyId?: string;

	@ApiProperty({
		description: 'Client Id',
	})
	@IsString()
	clientId?: string;

	@ApiProperty({
		description: 'Branch Office Id',
	})
	@IsNumber()
	@IsPositive()
	branchOfficeId?: any;

	@ApiProperty({
		description: 'Enter the query message',
	})
	@IsNotEmpty({
		message: 'Please enter the message',
	})
	@IsString()
	message?: any;
}
