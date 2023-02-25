import { IsNumber, IsOptional } from '@nestjs/class-validator';
import { IsPositive, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserMessageDto {
	@ApiProperty({
		description: 'Property Id',
	})
	@IsString()
	@IsNotEmpty({
		message: 'Please enter the property Id',
	})
	propertyId: string;

	@ApiProperty({
		description: 'User Id',
	})
	@IsNotEmpty({
		message: 'Please enter the user Id',
	})
	@IsString()
	userId: string;

	@ApiProperty({
		description: 'Branch Office Id',
	})
	@IsNumber()
	@IsPositive()
	@IsNotEmpty({
		message: 'Please enter the branch office Id',
	})
	branchOfficeId: number;

	@ApiProperty({
		description: 'Conversation Id',
	})
	@IsOptional()
	@IsNumber()
	@IsPositive()
	conversationId: number;

	@ApiProperty({
		description: 'Enter the query message',
	})
	@IsNotEmpty({
		message: 'Please enter the message',
	})
	@IsString()
	message: string;
	
}
