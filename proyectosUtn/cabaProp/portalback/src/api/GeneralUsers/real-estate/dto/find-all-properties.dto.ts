import { ApiProperty } from '@nestjs/swagger';
import { PhoneNumberDecorator } from '../../users/decorators/phoneNumber.decorator';
import { IsString } from '@nestjs/class-validator';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class FindAllPropertiesDto {
	@ApiProperty({
		description: 'Real Estate Fantasy Name',
	})
	@IsString()
	@IsOptional()
	field: string;

	@IsNumber()
	@IsNotEmpty()
	limit?: number;

	@IsNumber()
	@IsOptional()
	offset?: number;
}
