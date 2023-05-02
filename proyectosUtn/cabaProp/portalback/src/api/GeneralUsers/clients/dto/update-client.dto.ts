import { IsOptional} from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length, IsString } from 'class-validator';
import { PhoneNumberDecorator } from '../../users/decorators/phoneNumber.decorator';

export class UpdateClientDto {
	@ApiProperty({
		description: 'User name',
	})
	@IsNotEmpty({
		message: 'Please enter a user name',
	})
	@IsOptional()
	@IsString()
	@Length(1, 30, { message: 'Invalid first name' })
	firstName?: string;

	@ApiProperty({
		description: 'User lastName',
	})
	@IsNotEmpty({
		message: 'Please enter a user lastName',
	})
	@IsOptional()
	@IsString()
	@Length(1, 40, { message: 'Invalid last name' })
	lastName?: string;

	@ApiProperty({
		description: 'Phone number of user',
	})
	@IsOptional()
	@PhoneNumberDecorator({
		message: 'Incorrect phone number, must be at between 7 & 13 digits',
	})
	phoneNumber: string;
}
